# TaskFlow

Your kanban board updates when you push a commit, not when you remember to move a card. TaskFlow builds a project view directly from your team’s git history—branches, pull requests, and merges become live columns. It eliminates the need to manually drag cards.

This is a minimal Kanban board that runs on your Cloudflare Workers account. It uses your git provider’s API as the single source of truth. There is no separate database and no background sync.

---

## Why This Exists

Many project tools ask you to duplicate work you already did in git. You open a PR, then you go move a ticket. You merge, then you mark it done. TaskFlow simply reads what already happened and shows you the board.

---

## Live Demo

See it working: [https://the-fleet.casey-digennaro.workers.dev/taskflow](https://the-fleet.casey-digennaro.workers.dev/taskflow)

---

## Quick Start

1.  **Fork** this repository.
2.  Deploy it to Cloudflare Workers. There is no build step and zero npm packages.
3.  Add your git provider credentials as Worker Secrets. Credentials never leave your account.
4.  Load your board. It will populate from your live repository data.

---

## Features

*   **Automatic Status** – Cards move when someone branches, opens a PR, or merges. No manual updates are required.
*   **Git as Source** – There is no other database. If it happened in your repo, it is on the board.
*   **Self-Hosted** – It runs on your Cloudflare account. You control the deployment.
*   **Inferred Context** – Task owners and timelines are pulled from commit history.
*   **Fork-First** – You can modify or extend this code without upstream lock-in.
*   **Zero Trust Credentials** – All tokens live only in Cloudflare Secrets.

---

## How It Works

1.  **No Stored State** – The entire board is rebuilt from your git API on each page load. Nothing becomes stale.
2.  **No Manual Edits** – You cannot drag cards. The board reflects what your team *actually did* in git, not what they say they are doing.
3.  **Zero Dependencies** – There are no npm packages. The entire application is in a single, readable Worker script.

---

## Limitations

TaskFlow is built for teams that coordinate work through git branches and pull requests. If your workflow does not use these patterns, the automatic tracking will not work. Manual card movement is intentionally not supported.

**One specific constraint:** The board rebuilds on every request by fetching data from your git provider's API. If you have a very large repository with hundreds of active pull requests, this may approach API rate limits or slow down page load.

---

## License

MIT License. You may use, modify, and redistribute this work for any purpose.

Attribution: Superinstance and Lucineer (DiGennaro et al.)

<div style="text-align:center;padding:16px;color:#64748b;font-size:.8rem"><a href="https://the-fleet.casey-digennaro.workers.dev" style="color:#64748b">The Fleet</a> &middot; <a href="https://cocapn.ai" style="color:#64748b">Cocapn</a></div>