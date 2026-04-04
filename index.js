#!/usr/bin/env node

/**
 * CaseMgr MCP Bridge — stdio-to-HTTP transport adapter.
 *
 * Reads JSON-RPC messages from stdin, forwards them to the CaseMgr
 * Streamable HTTP endpoint, and writes responses to stdout.
 *
 * Usage:
 *   CASEMGR_API_TOKEN=your_token casemgr-mcp
 *   CASEMGR_API_TOKEN=your_token CASEMGR_URL=https://your-instance.com/mcp casemgr-mcp
 *
 * MCP client config (Claude Desktop, etc.):
 *   {
 *     "mcpServers": {
 *       "casemgr": {
 *         "command": "casemgr-mcp",
 *         "env": {
 *           "CASEMGR_API_TOKEN": "your_token_here"
 *         }
 *       }
 *     }
 *   }
 */

const MCP_URL = process.env.CASEMGR_URL || "https://casemgr.systems/mcp";
const API_TOKEN = process.env.CASEMGR_API_TOKEN;

if (!API_TOKEN) {
  process.stderr.write(
    "Error: CASEMGR_API_TOKEN environment variable is required.\n" +
      "Get your token at https://casemgr.systems/tokens\n"
  );
  process.exit(1);
}

let sessionId = null;
let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;

  // Process complete JSON-RPC messages (newline-delimited)
  let newlineIdx;
  while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIdx).trim();
    buffer = buffer.slice(newlineIdx + 1);
    if (line) handleMessage(line);
  }
});

process.stdin.on("end", () => {
  if (buffer.trim()) handleMessage(buffer.trim());
});

async function handleMessage(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    process.stderr.write(`Invalid JSON: ${line}\n`);
    return;
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
      "MCP-Protocol-Version": "2025-03-26",
    };

    if (sessionId) {
      headers["MCP-Session-Id"] = sessionId;
    }

    const res = await fetch(MCP_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(msg),
    });

    // Capture session ID from response
    const sid = res.headers.get("mcp-session-id");
    if (sid) sessionId = sid;

    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("text/event-stream")) {
      // SSE response — parse event stream
      const text = await res.text();
      for (const line of text.split("\n")) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data) process.stdout.write(data + "\n");
        }
      }
    } else {
      // JSON response
      const body = await res.text();
      if (body.trim()) process.stdout.write(body + "\n");
    }
  } catch (err) {
    process.stderr.write(`HTTP error: ${err.message}\n`);

    // Send JSON-RPC error response if we have an id
    if (msg.id !== undefined) {
      const errorResponse = {
        jsonrpc: "2.0",
        id: msg.id,
        error: {
          code: -32000,
          message: `Transport error: ${err.message}`,
        },
      };
      process.stdout.write(JSON.stringify(errorResponse) + "\n");
    }
  }
}
