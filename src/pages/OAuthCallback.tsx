import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const provider = searchParams.get('provider');
      const error = searchParams.get('error');

      if (error) {
        const errorMessages: Record<string, string> = {
          no_code: 'OAuth authorization failed',
          google_auth_failed: 'Google authentication failed',
          github_auth_failed: 'GitHub authentication failed',
        };

        toast.error(errorMessages[error] || 'Authentication failed');
        navigate('/login');
        return;
      }

      if (token) {
        // Store token
        localStorage.setItem('token', token);

        // Decode JWT to get user info
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Store basic user info
          localStorage.setItem('user', JSON.stringify({
            userId: payload.userId,
            email: payload.email,
            name: payload.email.split('@')[0], // Will be updated from API
          }));

          // Show success message
          const providerName = provider === 'google' ? 'Google' : 'GitHub';
          toast.success(`Successfully logged in with ${providerName}!`);

          // Redirect to dashboard
          navigate('/');
        } catch (err) {
          toast.error('Failed to process authentication');
          navigate('/login');
        }
      } else {
        toast.error('Authentication failed - no token received');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Completing sign in...</h2>
        <p className="text-slate-600">Please wait while we set up your account</p>
      </div>
    </div>
  );
}

