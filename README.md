# casemgr-mcp

Stdio-to-HTTP bridge for the [CaseMgr](https://casemgr.systems) MCP server. Enables any MCP client that supports stdio transport (Claude Desktop, Cursor, etc.) to connect to CaseMgr's hosted endpoint.

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

CaseMgr is a CMMN-based case management system with 184 MCP tools for managing cases, notes, tasks, files, bookmarks, todos, invoices, durations, expenses, and workflows.

**Features:**
- Cases & items — notes, tasks, stages, milestones, sentries, bookmarks, files, folders, todos
- CMMN workflows — sentry-gated stage execution with automatic lifecycle management
- Billing & invoicing — time tracking, expenses, client management, LaTeX/PDF invoice generation
- Semantic search — natural language search across all content
- AI work queue — dispatch, claim, and complete work items for multi-agent workflows
- Models & templates — reusable case plan models with publish, version, and instantiate
- File management — upload, download, versioning
- Workspaces & worktrees — organize cases, link git worktrees

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CASEMGR_API_TOKEN` | Yes | — | API token from casemgr.systems/tokens |
| `CASEMGR_URL` | No | `https://casemgr.systems/mcp` | MCP endpoint URL (for self-hosted instances) |

## License

MIT
