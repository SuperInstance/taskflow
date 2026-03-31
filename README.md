# TaskFlow

Kanban board with an AI co-pilot — powered by [cocapn](https://github.com/nicobailon/cocapn).

## What is TaskFlow?

TaskFlow is a task management app with a built-in AI agent that understands your board. The cocapn agent lives inside the sidebar, analyzes your tasks in real-time, and helps your team stay focused and unblocked.

### Features

- **Kanban board** with three columns: To Do, In Progress, Done
- **Drag-and-drop** tasks between columns (HTML5 drag/drop)
- **Priority badges** — color-coded: low, medium, high, critical
- **Assignee avatars** with colored initials
- **AI co-pilot** sidebar — ask questions about your board, get standup summaries, identify blockers
- **Task CRUD** — create, update, delete tasks via REST API
- **Dark theme** — easy on the eyes, built for focus
- **Responsive** — works on desktop and mobile

### How cocapn Makes It Sentient

The cocapn agent reads the current board state as context with every chat message. It knows:
- How many tasks are in each column
- What priorities exist and who's assigned
- The history and age of each task

The agent's personality is defined in `cocapn/soul.md` — edit it to change how the co-pilot behaves.

## Quick Start

### Terminal 1: Start the cocapn agent

```bash
cd /tmp/taskflow
npx cocapn --web --port 3100
```

### Terminal 2: Start the app

```bash
cd /tmp/taskflow
node server.js
```

### Open in browser

```
http://localhost:3000
```

## Architecture

```
Browser (index.html)
  │
  ├── GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id
  │     → server.js → tasks.json
  │
  └── POST /api/agent/chat → server.js → cocapn (localhost:3100)
       GET /api/agent/status
```

- **server.js** — Pure Node.js HTTP server (no Express). Serves the UI and REST API. Proxies agent requests to cocapn.
- **tasks.json** — Task persistence (auto-created).
- **cocapn/** — Agent configuration: `soul.md` (personality), `cocapn.json` (runtime config).

## Configuration

Edit `cocapn/cocapn.json` to change the LLM provider:

```json
{
  "mode": "private",
  "port": 3100,
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat"
  }
}
```

Edit `cocapn/soul.md` to change the agent's personality, tone, and capabilities.

## License

MIT
