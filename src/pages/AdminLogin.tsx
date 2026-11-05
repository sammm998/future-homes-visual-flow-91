import React, { useEffect, useState } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { supabase } from '@/integrations/legacy/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const isReset = new URLSearchParams(window.location.search).get('reset') === '1'
      || new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    setResetMode(isReset);
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setResetMode(true);
      setSessionReady(Boolean(session));
    });
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(Boolean(data.session));
      if (data.session && !isReset) navigate('/admin-dashboard', { replace: true });
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetMode) {
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
      navigate('/admin-dashboard', { replace: true });
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
    navigate('/admin-dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">{resetMode ? 'Set your password' : 'Admin Login'}</CardTitle>
          <CardDescription>{resetMode ? (sessionReady ? 'Future Homes International' : 'The link is invalid or expired. Request a new password email.') : 'Logga in för att komma åt admin dashboard'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading || (resetMode && !sessionReady)}>
              {loading ? 'Please wait...' : resetMode ? 'Save password' : 'Logga in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
