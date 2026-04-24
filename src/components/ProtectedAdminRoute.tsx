import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<Props> = ({ children }) => {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | undefined) => {
      if (!userId) {
        if (mounted) setStatus('unauthorized');
        return;
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      if (mounted) setStatus(!error && data ? 'authorized' : 'unauthorized');
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id);
    });

    supabase.auth.getSession().then(({ data }) => check(data.session?.user?.id));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthorized') {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
