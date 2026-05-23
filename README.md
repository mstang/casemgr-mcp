# casemgr-mcp
[![smithery badge](https://smithery.ai/badge/mstang/casemgr)](https://smithery.ai/servers/mstang/casemgr)


**A shared workspace your AI agent actually writes to — 184 MCP tools.**

It creates notes when it finds things, plans tasks when work appears, and marks them done. You review and edit. Persistent memory + semantic search across a graph of notes, tasks, and files.

This package is the stdio-to-HTTP bridge for the [CaseMgr](https://casemgr.systems) MCP server — use it with any MCP client that supports stdio transport (Claude Desktop, Cursor, etc.). For Claude Code, see [below](#claude-code-cli) — it supports HTTP natively and doesn't need this bridge.

## Quick Start

```bash
npm install -g casemgr-mcp
```

Get an API token at [casemgr.systems/tokens](https://casemgr.systems/tokens).

## MCP Client Config

### Claude Desktop / Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "casemgr": {
      "command": "casemgr-mcp",
      "env": {
        "CASEMGR_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

### Claude Code (CLI)

Claude Code supports Streamable HTTP natively — you don't need this bridge:

```json
{
  "mcpServers": {
    "casemgr": {
      "url": "https://casemgr.systems/mcp",
      "headers": {
        "Authorization": "Bearer your_token_here"
      }
    }
  }
}
```

## What is CaseMgr?

A shared, persistent workspace for you and your AI agent — 184 MCP tools across a graph of notes, tasks, files, calendar, and agent presence.

Your agent creates notes when it finds things. Plans tasks when there's work to do. Marks them done as it finishes. You review, edit, and add your own. Nothing is ephemeral — every session resumes exactly where the last one left off, and semantic search spans everything either of you ever wrote.

**What's in the workspace:**

- **Persistent memory** — every session resumes where the last one left off; nothing is ephemeral
- **Bidirectional graph** — agent and user both read and write notes, tasks, bookmarks, files, todos
- **Semantic search** — natural-language search across everything either of you ever wrote
- **Multi-agent task queue** — dispatch, claim, and complete work items across multiple agents
- **Event-driven workflows** — CMMN stages with sentry-gated execution and auto-lifecycle management
- **Reusable templates** — case plan models with publish, version, and instantiate
- **File management** — upload, download, versioning, content-aware embeddings
- **Workspaces & worktrees** — organize cases, link git worktrees across machines
- **Time tracking & billing** — durations, expenses, invoices with LaTeX/PDF generation

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CASEMGR_API_TOKEN` | Yes | — | API token from casemgr.systems/tokens |
| `CASEMGR_URL` | No | `https://casemgr.systems/mcp` | MCP endpoint URL (for self-hosted instances) |

## License

MIT
