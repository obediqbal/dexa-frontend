import { useAuth } from '../context';
import { Link } from 'react-router-dom';
import './Pages.css';

export function Home() {
    const { user, logout, isAdmin } = useAuth();

    return (
        <div className="page-container">
            <nav className="navbar">
                <div className="nav-brand">
                    <span className="logo-not">Not</span><span className="logo-talenta">Talenta</span>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link active">Home</Link>
                    {isAdmin && (
                        <>
                            <Link to="/admin/staff" className="nav-link">Staff Management</Link>
                            <Link to="/admin/attendance" className="nav-link">Staff Attendance</Link>
                        </>
                    )}
                </div>
                <div className="nav-user">
                    <span className="user-email">{user?.email}</span>
                    <span className="user-role-badge">{user?.role}</span>
                    <button className="logout-button" onClick={logout}>
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="main-content">
                <div className="page-header">
                    <h1>Attendance Dashboard</h1>
                    <p>Track your work from home attendance</p>
                </div>

                <div className="placeholder-card">
                    <div className="placeholder-icon">📋</div>
                    <h2>Attendance Page</h2>
                    <p>Your attendance tracking features will appear here.</p>
                    <p className="placeholder-note">Coming soon: Clock in/out, attendance history, and more.</p>
                </div>
            </main>
        </div>
    );
}
