import { describe, expect, it } from 'vitest';
import { adminRecoveryRedirect, adminRecoveryState } from '../src/lib/adminRecovery';

describe('admin password recovery', () => {
  it('does not allow an expired link to change an existing signed-in account', () => {
    expect(adminRecoveryState('?reset=1', '#error=access_denied&error_code=otp_expired', true).sessionReady).toBe(false);
  });
  it('keeps a valid reset session on the password page', () => {
    expect(adminRecoveryState('?reset=1', '', true)).toEqual({ resetMode: true, sessionReady: true, linkError: false });
    expect(adminRecoveryState('?reset=1', '', false).sessionReady).toBe(false);
  });
  it('sends reset links to password selection, not the CMS dashboard', () => {
    expect(adminRecoveryRedirect('https://future-homes-visual-flow-91.lovable.app')).toBe('https://future-homes-visual-flow-91.lovable.app/admin-login?reset=1');
  });
});