import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_FILE = join(__dirname, 'tasks.json');
const COCAPN_URL = 'http://localhost:3100';
const PORT = 3000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function loadTasks() {
  try {
    const raw = await readFile(TASKS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveTasks(tasks) {
  await writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

async function proxyToCocapn(method, path, body = null) {
  const url = new URL(path, COCAPN_URL);
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  const resp = await fetch(url, {
    method,
    headers: opts.headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = resp.headers.get('content-type') || '';

  // Handle SSE response — collect all data chunks into one response
  if (contentType.includes('text/event-stream')) {
    const text = await resp.text();
    // Extract content from SSE data lines
    const lines = text.split('\n');
    const parts = [];
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') break;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.content) parts.push(parsed.content);
        } catch {
          // skip malformed
        }
      }
    }
    return { content: parts.join('') };
  }

  return resp.json();
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;
  const method = req.method;

  const ts = new Date().toISOString();
  console.info(`[taskflow] ${method} ${path} — ${ts}`);

  try {
    // --- Serve index.html -------------------------------------------------
    if (method === 'GET' && path === '/') {
      const html = await readFile(join(__dirname, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    // --- Task CRUD --------------------------------------------------------

    // GET /api/tasks
    if (method === 'GET' && path === '/api/tasks') {
      const tasks = await loadTasks();
      return json(res, tasks);
    }

    // POST /api/tasks
    if (method === 'POST' && path === '/api/tasks') {
      const body = await parseBody(req);
      const tasks = await loadTasks();
      const task = {
        id: randomUUID(),
        title: body.title || 'Untitled',
        description: body.description || '',
        priority: body.priority || 'medium',
        assignee: body.assignee || '',
        column: body.column || 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(task);
      await saveTasks(tasks);
      return json(res, task, 201);
    }

    // PUT /api/tasks/:id
    const putMatch = path.match(/^\/api\/tasks\/([a-f0-9-]+)$/);
    if (method === 'PUT' && putMatch) {
      const id = putMatch[1];
      const body = await parseBody(req);
      const tasks = await loadTasks();
      const idx = tasks.findIndex((t) => t.id === id);
      if (idx === -1) return json(res, { error: 'Task not found' }, 404);
      tasks[idx] = { ...tasks[idx], ...body, updatedAt: new Date().toISOString() };
      await saveTasks(tasks);
      return json(res, tasks[idx]);
    }

    // DELETE /api/tasks/:id
    const delMatch = path.match(/^\/api\/tasks\/([a-f0-9-]+)$/);
    if (method === 'DELETE' && delMatch) {
      const id = delMatch[1];
      const tasks = await loadTasks();
      const filtered = tasks.filter((t) => t.id !== id);
      if (filtered.length === tasks.length) return json(res, { error: 'Task not found' }, 404);
      await saveTasks(filtered);
      return json(res, { ok: true });
    }

    // --- Agent proxy ------------------------------------------------------

    // POST /api/agent/chat
    if (method === 'POST' && path === '/api/agent/chat') {
      const body = await parseBody(req);
      const result = await proxyToCocapn('POST', '/api/chat', {
        message: body.message,
        name: body.name || 'User',
      });
      return json(res, result);
    }

    // GET /api/agent/status
    if (method === 'GET' && path === '/api/agent/status') {
      const result = await proxyToCocapn('GET', '/api/status');
      return json(res, result);
    }

    // --- 404 --------------------------------------------------------------
    return json(res, { error: 'Not found' }, 404);
  } catch (err) {
    console.error(`[taskflow] Error handling ${method} ${path}:`, err.message);

    // If cocapn is unreachable, return a friendly error
    if (err.code === 'ECONNREFUSED') {
      return json(res, {
        error: 'Cocapn agent is not running. Start it with: npx cocapn --web --port 3100',
        content: 'The AI agent is offline. Please start the cocapn server first.',
      }, 502);
    }

    return json(res, { error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.info(`[taskflow] TaskFlow running at http://localhost:${PORT}`);
  console.info(`[taskflow] Expecting cocapn agent at ${COCAPN_URL}`);
});
