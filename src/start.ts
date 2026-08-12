import { createStart } from "@tanstack/react-start";

import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

// NOTE: do not call `createMiddleware()` at module scope in this file.
// `@tanstack/react-start` imports this module back (start instance registration),
// so during that import cycle the named export is still undefined in the
// production bundle and the whole app 500s with
// "TypeError: createMiddleware is not a function".
// Server errors are already turned into a friendly page by `src/server.ts`.
export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
}));
