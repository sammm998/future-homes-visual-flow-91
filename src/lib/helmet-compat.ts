// Compat shim: react-helmet-async is CJS, so named imports break under SSR
// module evaluation in dev. Import the module namespace and re-export the
// pieces in a way that works in both CJS-interop and ESM contexts.
import * as helmetPkg from "react-helmet-async";

const m: any = (helmetPkg as any).default ?? helmetPkg;

export const Helmet: typeof helmetPkg.Helmet = m.Helmet ?? (helmetPkg as any).Helmet;
export const HelmetProvider: typeof helmetPkg.HelmetProvider =
  m.HelmetProvider ?? (helmetPkg as any).HelmetProvider;
