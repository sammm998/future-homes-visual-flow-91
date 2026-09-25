// TanStack's current client-core barrel imports its server request storage.
// Client branches never use it, but bundling the Node implementation crashes
// browsers before hydration. Keep the same API without importing Node built-ins.
export async function runWithStartContext<T>(
  _context: unknown,
  fn: () => T | Promise<T>,
): Promise<T> {
  return await fn();
}

export function getStartContext(options?: { throwIfNotFound?: boolean }): undefined {
  if (options?.throwIfNotFound === false) return undefined;
  throw new Error("Start request context is only available on the server.");
}