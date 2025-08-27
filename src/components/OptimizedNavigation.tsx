import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface OptimizedNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const OptimizedNavigation: React.FC<OptimizedNavigationProps> = ({ 
  children, 
  className 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Safe navigation function that avoids window.location.href
  const safeNavigate = (path: string) => {
    if (path.startsWith('tel:') || path.startsWith('mailto:')) {
      // Use window.location.href only for external protocols
      window.location.href = path;
    } else {
      // Use React Router for internal navigation
      navigate(path);
    }
  };

  // Handle phone calls
  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Handle email
  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  // Share function with fallback
  const handleShare = async (title: string, text: string) => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (error) {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(url);
        } catch (clipboardError) {
          console.log('Share and clipboard failed');
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
      } catch (error) {
        console.log('Clipboard access failed');
      }
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            safeNavigate,
            handlePhoneCall,
            handleEmail,
            handleShare,
            currentPath: location.pathname,
          } as any);
        }
        return child;
      })}
    </div>
  );
};