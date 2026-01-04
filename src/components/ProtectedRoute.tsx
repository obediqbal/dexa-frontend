import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
