export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  console.error("Captured error:", error, context);
}
