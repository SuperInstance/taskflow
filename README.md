# TaskFlow

You stop updating the ticket two hours before you finish the work. The kanban card never gets moved after the merge. We know.

TaskFlow builds your project board directly from your team's git activity. Status updates happen when you push code, not when you remember to drag a card.

This is a Kanban board application built on the Cocapn Fleet runtime. It runs on your Cloudflare Workers account and uses your git history as the single source of truth.

## Live Demo

A public instance is available: [https://the-fleet.casey-digennaro.workers.dev/taskflow](https://the-fleet.casey-digennaro.workers.dev/taskflow)

## How It Works

This is not a SaaS tool with a git integration. There is no separate database, sync job, or background worker. Each time the board is loaded, it rebuilds the state live from your git provider's API.

You configure a connection to your git provider (GitHub, GitLab, etc.). The application reads your repository's branches, pull requests, and commits to infer task status, ownership, and progress.

## What It Does

*   **Automatic Status Updates:** Cards move based on git events: branching, committing, opening a pull request, merging.
*   **Git as Source of Truth:** No parallel data store. The board reflects the actual work history in your repository.
*   **Self-Hosted & Controlled:** Deploys to your Cloudflare account. Your credentials stay in your environment.
*   **No Fake History:** The timeline is built from commits, not retrospective ticket edits.

## Key Features

*   **Inferred State:** Task progress, owners, and timelines are derived 100% from commits, branches, and PRs.
*   **Zero Dependencies:** A single Cloudflare Worker with no build step and zero npm packages.
*   **Fork First:** This is complete, working software. Fork it, modify it, and own it without upstream lock-in.
*   **BYOK Security:** All credentials are stored only in your Cloudflare Secrets.

## Quick Start

1.  Fork this repository.
2.  Deploy it to Cloudflare Workers.
3.  Configure your git provider credentials as Worker Secrets.
4.  Load the application URL. Your board will populate from your connected repository.

## One Honest Limitation

TaskFlow is designed for teams that coordinate work through git branches and pull requests. If your workflow does not use these patterns, the automatic status tracking will not apply. This tool will not support manual card dragging.

## Architecture

TaskFlow is a stateless application running on Cloudflare Workers, built on the Cocapn Fleet runtime. It fetches data from your git provider's API on each request and renders the board client-side. There is no caching or persistence layer.

---

Attribution: Superinstance & Lucineer (DiGennaro et al.).

<div>
  <a href="https://the-fleet.casey-digennaro.workers.dev">The Fleet</a> •
  <a href="https://cocapn.ai">Cocapn</a>
</div>