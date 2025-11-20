import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuthStore } from '~/stores/useAuthStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute ensures that the wrapped content is only visible to authenticated users.
 * If the user is not authenticated, it redirects to the login page.
 * It also shows a simple loading state while the auth status is being resolved.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    if (isLoading || !isAuthenticated) {
        // Simple loading placeholder; can be replaced with a spinner component.
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return <>{children}</>;
}
