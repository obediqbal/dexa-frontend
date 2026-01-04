import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components';
import { Login, Home, StaffManagement, StaffAttendance } from './pages';
import { useAuth } from './context';

function App() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public route */}
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />

            {/* Protected routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            {/* Admin-only routes */}
            <Route
                path="/admin/staff"
                element={
                    <ProtectedRoute adminOnly>
                        <StaffManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/attendance"
                element={
                    <ProtectedRoute adminOnly>
                        <StaffAttendance />
                    </ProtectedRoute>
                }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
