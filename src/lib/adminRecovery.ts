export function adminRecoveryState(search: string, hash: string, hasSession: boolean) {
  const query = new URLSearchParams(search);
  const fragment = new URLSearchParams(hash.replace(/^#/, ''));
  const linkError = query.has('error') || fragment.has('error');
  return {
    resetMode: query.get('reset') === '1' || fragment.get('type') === 'recovery' || linkError,
    sessionReady: hasSession && !linkError,
    linkError,
  };
}

export function adminRecoveryRedirect(origin: string) {
  return new URL('/admin-login?reset=1', origin).href;
}