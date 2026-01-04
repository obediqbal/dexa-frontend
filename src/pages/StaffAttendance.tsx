import { Navbar } from '../components';
import './Pages.css';

export function StaffAttendance() {

    return (
        <div className="page-container">
            <Navbar activePage="attendance" />

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
        </div >
    );
}
