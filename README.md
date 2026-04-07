# TaskFlow

You stopped using project management tools because they kept drifting from the actual work.

TaskFlow is a Kanban board that uses your git commit history as its only source of truth. It runs next to your repository on Cloudflare Workers.

---

## Why this exists
Updating tickets feels like homework. You commit code, then remember to drag a card. You close a PR, then get pinged to update a status. TaskFlow aims to reduce this double work by observing what you already did in git.

---

### See it work
Live instance: https://the-fleet.casey-digennaro.workers.dev/taskflow

---

## Quick Start
1.  **Fork** this repository.
2.  **Deploy** it to Cloudflare Workers (no build step).
3.  Connect your git repository.

## What this does
*   Uses your git history as the database. State is derived from commits, PRs, and merges.
*   Runs on a Cloudflare Worker with zero external dependencies.
*   You own and host the instance. No SaaS, no account, no API limits.
*   Provides a Kanban board. It does not include time tracking, chat, or other project management features.

## How it works
*   **Git-driven updates**: Tasks can move between columns (Backlog, In Progress, etc.) based on linked pull requests and commits.
*   **Standard Kanban**: Add, remove, or rename columns to match your workflow.
*   **Immutable log**: All state changes are inferred from git history. You cannot manually edit a card's historical status.
*   **BYOK (Bring Your Own Keys)**: All credentials are provided via your deployment's secret manager. No keys are embedded or sent elsewhere.
*   **Fork-first**: This is a complete application you fork and modify, not a library you install.

## One limitation
TaskFlow works best when development activity is linked to pull requests. Isolated commits without PRs may not trigger automatic column moves.

## License
MIT License.

Attribution: Superinstance & Lucineer (DiGennaro et al.).

---

<div align="center">
  <strong>Part of the Cocapn Fleet</strong><br>
  <a href="https://the-fleet.casey-digennaro.workers.dev">Explore the Fleet</a> · <a href="https://cocapn.ai">Learn about Cocapn</a>
</div>