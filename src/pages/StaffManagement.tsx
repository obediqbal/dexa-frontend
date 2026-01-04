import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserProfileDropdown } from '../components';
import './Pages.css';

export function StaffManagement() {
    const { isAdmin } = useAuth();

    return (
        <div className="page-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <span className="logo-not">Not</span><span className="logo-talenta">Talenta</span>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAdmin && (
                        <>
                            <Link to="/admin/staff" className="nav-link active">Staff Management</Link>
                            <Link to="/admin/attendance" className="nav-link">Staff Attendance</Link>
                        </>
                    )}
                </div>
                <UserProfileDropdown />
            </nav>

            <main className="main-content">
                <div className="page-header">
                    <h1>Staff Management</h1>
                    <p>Manage your organization's staff members</p>
                </div>

                <div className="placeholder-card">
                    <div className="placeholder-icon">👥</div>
                    <h2>Staff Management Page</h2>
                    <p>Admin-only staff management features will appear here.</p>
                    <p className="placeholder-note">Coming soon: Staff list, add/edit staff, and more.</p>
                </div>
            </main>
        </div>
    );
}
