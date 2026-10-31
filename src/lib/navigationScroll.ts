/** Query-only updates refine the current page; actual page changes start at the top. */
export function shouldResetNavigationScroll(currentPath: string, targetPath: string, explicit?: boolean) {
  return explicit ?? (targetPath !== '.' && targetPath !== currentPath);
}