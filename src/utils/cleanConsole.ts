// Production console cleanup utility
export const cleanConsole = () => {
  if (import.meta.env.PROD) {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    // Keep console.error for production debugging
  }
};

// Call this in production builds
if (import.meta.env.PROD) {
  cleanConsole();
}
