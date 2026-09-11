// Thin client-side wrapper around the WebMCP browser proposal
// (navigator.modelContext), which lets a page register tools that
// in-browser AI agents can call directly against live page data.
// The API is experimental and not yet in TS's DOM lib, so it's typed
// here, and every call is feature-detected and no-ops when unsupported.

export type WebMCPToolResult = {
  content: Array<{ type: "text"; text: string }>;
};

export type WebMCPTool<TInput = any> = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: TInput) => WebMCPToolResult | Promise<WebMCPToolResult>;
};

interface ModelContextAPI {
  registerTool: (tool: WebMCPTool) => Promise<void> | void;
  unregisterTool: (name: string) => Promise<void> | void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContextAPI;
  }
}

export const isWebMCPSupported = (): boolean =>
  typeof navigator !== "undefined" && !!navigator.modelContext;

// Polls for navigator.modelContext to appear — a WebMCP-polyfilling extension
// injects it asynchronously, which can land after this module's caller has
// already mounted, so a one-shot check at call time can miss it.
const waitForModelContext = (
  cancelledRef: { current: boolean },
  pollIntervalMs: number,
  timeoutMs: number,
): Promise<boolean> =>
  new Promise((resolve) => {
    const deadline = Date.now() + timeoutMs;
    const check = () => {
      if (cancelledRef.current) return resolve(false);
      if (isWebMCPSupported()) return resolve(true);
      if (Date.now() > deadline) return resolve(false);
      setTimeout(check, pollIntervalMs);
    };
    check();
  });

// Registers a tool and returns an unregister function, safe to call even
// when the browser never gains WebMCP support. Waits for navigator.modelContext
// to become available (a polyfilling extension injects it asynchronously),
// then awaits registration before considering the tool live.
export function registerWebMCPTool(
  tool: WebMCPTool,
  { pollIntervalMs = 100, timeoutMs = 5000 } = {},
): () => void {
  const cancelledRef = { current: false };
  let registered = false;

  (async () => {
    const supported = await waitForModelContext(
      cancelledRef,
      pollIntervalMs,
      timeoutMs,
    );
    if (!supported) {
      if (!cancelledRef.current && process.env.NODE_ENV !== "production") {
        console.info(
          `[webmcp] navigator.modelContext never became available — tool "${tool.name}" was not registered. WebMCP isn't natively implemented by any shipping browser yet; it needs a polyfilling extension (e.g. MCP-B) to test locally.`,
        );
      }
      return;
    }
    if (cancelledRef.current) return;
    await navigator.modelContext!.registerTool(tool);
    if (cancelledRef.current) {
      await navigator.modelContext!.unregisterTool(tool.name);
      return;
    }
    registered = true;
  })();

  return () => {
    cancelledRef.current = true;
    if (registered) {
      void navigator.modelContext?.unregisterTool(tool.name);
    }
  };
}

export function jsonResult(data: unknown): WebMCPToolResult {
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
}
