import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserProfileDropdown } from './UserProfileDropdown';

interface NavbarProps {
    activePage: 'home' | 'staff' | 'attendance';
}

export function Navbar({ activePage }: NavbarProps) {
    const { isAdmin } = useAuth();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <span className="logo-not">Not</span>
                <span className="logo-talenta">Talenta</span>
            </div>
            <div className="nav-links">
                <Link to="/" className={`nav-link ${activePage === 'home' ? 'active' : ''}`}>
                    Home
                </Link>
                {isAdmin && (
                    <>
                        <Link to="/admin/staff" className={`nav-link ${activePage === 'staff' ? 'active' : ''}`}>
                            Manajemen Staf
                        </Link>
                        <Link to="/admin/attendance" className={`nav-link ${activePage === 'attendance' ? 'active' : ''}`}>
                            Presensi Staf
                        </Link>
                    </>
                )}
            </div>
            <UserProfileDropdown />
        </nav>
    );
}
