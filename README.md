# TaskFlow

You don't need another project management board that falls out of sync.

---

## Why this exists
Most kanban tools require duplicating work: writing tickets, moving cards, and updating statuses separate from your actual commits and PRs. TaskFlow builds your board directly from your team's existing git history.

TaskFlow is a Kanban board that uses your git commit history as its source of truth. It is powered by the Cocapn Fleet.

---

## Try the demo
A live public instance is available: https://the-fleet.casey-digennaro.workers.dev/taskflow

---

## What it does
-   **Status updates happen when you push code.** A card's column changes when you push a commit, open a pull request, or merge.
-   **There is no separate database.** Git is your source of truth. There's nothing additional to back up, sync, or corrupt.
-   **You host and control it.** This runs entirely on your Cloudflare account. Your credentials never leave your environment.
-   **It reflects work as it happened.** The board is derived from immutable git history, not manually edited statuses.

## Key Features
*   **Git as the System of Record:** Task state is inferred from commits, PRs, and merges.
*   **Zero Dependencies:** A single Cloudflare Worker with no build step and no npm packages.
*   **Self-Hosted BYOK:** All credentials are stored in your Cloudflare Secrets. No data is sent to external servers.
*   **Fork-First Philosophy:** This is a complete, working application. Fork it and modify it for your needs.

---

## Quick Start
1.  Fork this repository.
2.  Deploy it to Cloudflare Workers.
3.  Configure your git provider credentials as environment secrets.
4.  Your board will populate from your default branch.

## One Honest Limitation
TaskFlow is designed for teams that coordinate work through git branches and pull requests. If your workflow doesn't use these mechanisms, the automatic status tracking may not fit your process.

## Architecture
TaskFlow is a stateless application running on Cloudflare Workers. It queries your git provider's API on each request to build the current project state. There is no application database, background worker, or sync process.

## License
MIT License.

Attribution: Superinstance & Lucineer (DiGennaro et al.).

---

<div align="center">
  <strong>Part of the Cocapn Fleet</strong><br>
  <a href="https://the-fleet.casey-digennaro.workers.dev">Explore the Fleet</a> · <a href="https://cocapn.ai">Learn about Cocapn</a>
</div>