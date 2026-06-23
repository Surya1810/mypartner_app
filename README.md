# AI Agent Template for Nuxt.js Projects

A structured planning and execution template for building Nuxt.js projects with AI agents.
It provides a complete two-agent system (Planner + Executor) with rules, skills, and progress
tracking that covers auth, frontend, backend, and code quality best practices.

---

## > IMPORTANT: Rename Agent Files to Match Your AI Tools

`PLANNER.md` and `EXECUTOR.md` are the two core agent instruction files in this template.
**Before using this template, rename them to match the AI agents you are actually using.**

Each AI platform reads its own named file as the agent's system context:

| Template file | Rename to   | Used by                   |
| ------------- | ----------- | ------------------------- |
| `PLANNER.md`  | `CLAUDE.md` | Claude Code (Anthropic)   |
| `PLANNER.md`  | `AGENTS.md` | OpenAI Codex              |
| `PLANNER.md`  | `GEMINI.md` | Gemini CLI (Google)       |
| `EXECUTOR.md` | `GEMINI.md` | Gemini CLI (as executor)  |
| `EXECUTOR.md` | `CLAUDE.md` | Claude Code (as executor) |

**Example — using Claude Code as Planner and Gemini CLI as Executor:**

```bash
cp PLANNER.md CLAUDE.md
cp EXECUTOR.md GEMINI.md
```

**Example — using Claude Code for both roles:**
Merge the relevant sections from both files into a single `CLAUDE.md`, or keep them as
separate files with descriptive names and load them manually per session.

The content of these files does not change — only the filename changes to match what
each AI platform looks for automatically.

---

## Template Structure

```
.plan/
  rules/
    shared.md       ← shared rules (naming, TypeScript, commits, code quality)
    auth.md         ← complete auth contract (frontend + backend)
    frontend.md     ← CSS, UI, animation, file display rules
    backend.md      ← server architecture, API docs, security
  skills/
    auth.md         ← concrete auth implementation (plugins, middleware, API handlers)
    frontend.md     ← Nuxt 4 patterns, shadcn-vue, vee-validate, animation
    backend.md      ← route handlers, ORM, Zod, logging, file serving
  PROGRESS.md       ← execution progress tracking for all plans
PLANNER.md          ← instructions for the planning AI agent (rename before use)
EXECUTOR.md         ← instructions for the executing AI agent (rename before use)
README.md           ← this file
```

---

## How It Works

This template uses a two-role system:

- **Planner** — reads project requirements, interviews the user, then produces plan files
  (`.plan/01-project-setup.md`, `.plan/feat/`, `.plan/fix/`, etc.)
- **Executor** — reads the plan files produced by the Planner and implements them step by step

Both agents read `PROGRESS.md` first at the start of every session to understand the current
state of the project before taking any action.

---

## Prerequisites

Before starting a new project from this template, make sure the following are installed:

- **Python 3.10+** — required by code-review-graph
- **Node.js 24 LTS** — runtime for Nuxt.js projects
- **uv** (recommended) — faster Python package manager

Install `uv` if not already available:

```bash
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

---

## Installing code-review-graph

`code-review-graph` is an MCP tool that builds a structural map of the codebase using
Tree-sitter. AI agents use it to understand relationships between files, functions, and the
blast radius of changes — far more efficient than reading files one by one.
It claims a median token reduction of ~82x compared to naive file scanning.

### 1. Install the package

```bash
# With uv (recommended)
uv tool install code-review-graph

# Or with pip
pip install code-review-graph

# Or with pipx
pipx install code-review-graph
```

### 2. Configure your AI editor

Run the following command inside the project folder:

```bash
# Auto-detect all installed platforms
code-review-graph install

# Or target a specific platform
code-review-graph install --platform claude-code
code-review-graph install --platform cursor
code-review-graph install --platform windsurf
code-review-graph install --platform gemini-cli
code-review-graph install --platform codex
```

This command automatically:

- Detects installed AI editors and coding tools
- Writes the correct MCP server configuration for each
- Injects graph-aware instructions into platform rule files

Restart your editor or AI tool after installation.

### 3. Build the graph for the first time

Run this inside the project folder:

```bash
code-review-graph build
```

The graph parses the entire codebase (roughly 10 seconds for a 500-file project).

### 4. Keep the graph updated during development

Run watch mode in a separate terminal to keep the graph in sync as files change:

```bash
code-review-graph watch
```

Or use the daemon for multiple projects at once:

```bash
crg-daemon add ~/path/to/project --alias project-name
crg-daemon start
```

### Excluding files from the graph

Create `.code-review-graphignore` in the project root to exclude files that do not need indexing:

```
node_modules/**
.nuxt/**
dist/**
*.generated.ts
```

Files already listed in `.gitignore` are automatically excluded.

---

## Starting a New Project

### Step 1 — Copy the template

Copy the entire template into a new project folder:

```bash
cp -r /path/to/general-nuxt /path/to/new-project
cd /path/to/new-project
```

### Step 2 — Rename agent files

Rename `PLANNER.md` and `EXECUTOR.md` to match the AI tools you are using.
See the [important note at the top of this file](#-important-rename-agent-files-to-match-your-ai-tools) for the full mapping table.

### Step 3 — Install code-review-graph

Follow the installation steps above if not already done.

### Step 4 — Open a Planner session

Open your editor with the AI agent active and ask it to read the Planner file:

```
Read CLAUDE.md (or whichever file you renamed PLANNER.md to) and start a planning
session for a new project.
```

The Planner agent will:

1. Read `PROGRESS.md` to understand the current state
2. Read all rules and skills files
3. Conduct a project brief interview (project name, domain, database, features, design brief, etc.)
4. Fill in `.plan/rules/` with project-specific configuration
5. Write phase files one by one (`01-project-setup.md`, `02-database-schema.md`, etc.)
6. Log each phase as a row in the Setup Phases table in `PROGRESS.md`

### Step 5 — Open an Executor session

Once the Planner has finished writing all plan files, open a new session and ask the agent
to read the Executor file:

```
Read GEMINI.md (or whichever file you renamed EXECUTOR.md to) and start executing
from the first phase.
```

The Executor agent will:

1. Read `PROGRESS.md` to determine which phase to work on
2. Read all rules and skills files
3. Execute each phase in order
4. Update `PROGRESS.md` after each unit of work is completed

### Step 6 — Build the graph after scaffolding

Once Phase 01 (project setup) is complete and Nuxt files are in place:

```bash
code-review-graph build
```

Run this once, then use `watch` or the daemon for all subsequent sessions.

---

## Branch Rules

| Branch                          | Contents                                                    |
| ------------------------------- | ----------------------------------------------------------- |
| `development`, feature branches | Everything — including `.plan/`, agent files, editor config |
| `main` / `master`               | Application code only — no AI agent or tooling artifacts    |

The following files must be **committed and pushed to `development`** but must **not exist on `main`/`master`**:

```
.plan/          .github/        .kiro/          .qoder/
.vscode/        .cursorrules    .mcp.json       .opencode.json
.windsurfrules  AGENTS.md       CLAUDE.md       GEMINI.md       QODER.md
```

Do **not** add these to the project-wide `.gitignore` — they need to be tracked on development
branches. Add them to `.gitignore` only on the `main`/`master` branch after the cleanup merge.

**Before merging or opening a PR to `main`/`master`:**

```bash
# Check whether any artifacts are in the diff
git diff main...HEAD -- .plan .github .kiro .qoder .vscode \
  .cursorrules .mcp.json .opencode.json .windsurfrules \
  AGENTS.md CLAUDE.md GEMINI.md QODER.md

# If any appear, untrack them before merging
git rm --cached -r .plan .github .kiro .qoder .vscode \
  .cursorrules .mcp.json .opencode.json .windsurfrules \
  AGENTS.md CLAUDE.md GEMINI.md QODER.md

git commit -m "chore: remove dev-only artifacts before merge to main"
```

---

## Useful code-review-graph Commands

| Command                                    | Purpose                                                 |
| ------------------------------------------ | ------------------------------------------------------- |
| `code-review-graph build`                  | Build the graph for the first time or do a full rebuild |
| `code-review-graph update`                 | Incremental update — re-parses changed files only       |
| `code-review-graph watch`                  | Auto-update the graph whenever a file is saved          |
| `code-review-graph status`                 | Display current graph statistics                        |
| `code-review-graph visualize`              | Generate an interactive HTML graph                      |
| `code-review-graph detect-changes --brief` | Risk panel and token savings estimate                   |
| `code-review-graph serve`                  | Start the MCP server manually                           |
| `crg-daemon start`                         | Run the background daemon for multiple projects         |
