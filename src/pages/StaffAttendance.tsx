import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserProfileDropdown } from '../components';
import './Pages.css';

export function StaffAttendance() {
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
                            <Link to="/admin/staff" className="nav-link">Staff Management</Link>
                            <Link to="/admin/attendance" className="nav-link active">Staff Attendance</Link>
                        </>
                    )}
                </div>
                <UserProfileDropdown />
            </nav>

            <main className="main-content">
                <div className="page-header">
                    <h1>Staff Attendance</h1>
                    <p>View and manage all staff attendance records</p>
                </div>

                <div className="placeholder-card">
                    <div className="placeholder-icon">📊</div>
                    <h2>Staff Attendance Page</h2>
                    <p>Admin-only attendance overview will appear here.</p>
                    <p className="placeholder-note">Coming soon: Attendance table, filters, and export.</p>
                </div>
            </main>
        </div>
    );
}
