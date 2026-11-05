import React, { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/legacy/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import { adminRecoveryRedirect, adminRecoveryState } from '@/lib/adminRecovery';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const initial = adminRecoveryState(window.location.search, window.location.hash, false);
    const isReset = initial.resetMode;
    setResetMode(isReset);
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setResetMode(true);
      setSessionReady(Boolean(session) && !initial.linkError);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(Boolean(data.session) && !initial.linkError);
      setCheckingSession(false);
      if (data.session && !isReset) navigate('/admin', { replace: true });
    }).catch(() => {
      setSessionReady(false);
      setCheckingSession(false);
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: adminRecoveryRedirect(window.location.origin),
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      setEmailSent(true);
    } catch {
      toast.error('Could not request the email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetMode) {
      if (!sessionReady || checkingSession) return;
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) {
        toast.error(error.message);
        return;
      }
      setPassword('');
      setConfirmPassword('');
      toast.success('Password saved');
      navigate('/admin', { replace: true });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Inloggad');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{resetMode ? 'Set your password' : 'Admin Login'}</CardTitle>
          <CardDescription>{resetMode ? (checkingSession ? 'Checking your password link...' : sessionReady ? 'Future Homes International' : 'The link is invalid or expired. Request a new password email.') : 'Logga in för att komma åt CMS'}</CardDescription>
        </CardHeader>
        <CardContent>
          {resetMode && !checkingSession && !sessionReady ? (
            <form onSubmit={handleRecoveryEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email</Label>
                <Input id="recovery-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailSent(false); }} required />
              </div>
              {emailSent && <p role="status" className="text-sm text-muted-foreground">A new password email has been requested. Open only the latest email; older links may no longer work.</p>}
              <Button type="submit" className="w-full" disabled={loading || emailSent}>{loading ? 'Please wait...' : 'Send new password email'}</Button>
            </form>
          ) : <form onSubmit={handleLogin} className="space-y-4">
            {!resetMode && <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>}
            <div className="space-y-2">
              <Label htmlFor="password">{resetMode ? 'New password' : 'Lösenord'}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={resetMode ? 'new-password' : 'current-password'}
              />
            </div>
            {resetMode && <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input id="confirm-password" type="password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>}
            <Button type="submit" className="w-full" disabled={loading || checkingSession || (resetMode && !sessionReady)}>
              {loading ? 'Please wait...' : resetMode ? 'Save password' : 'Logga in'}
            </Button>
          </form>}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
