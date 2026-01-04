import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { UserProfileDropdown, ClockInOutCard, AttendanceCalendar } from '../components';
import { attendanceApi } from '../api';
import { Attendance } from '../types';
import './Home.css';

export function Home() {
    const { isAdmin } = useAuth();
    const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
    const [isLoadingToday, setIsLoadingToday] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchTodayAttendance = async () => {
        try {
            const data = await attendanceApi.getTodayAttendance();
            setTodayAttendance(data);
        } catch (error) {
            console.error('Failed to fetch today attendance:', error);
        } finally {
            setIsLoadingToday(false);
        }
    };

    useEffect(() => {
        fetchTodayAttendance();
    }, []);

    const handleClockAction = () => {
        fetchTodayAttendance();
        setRefreshTrigger((prev) => prev + 1);
    };

    const formatTime = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="home-container">
            <nav className="home-navbar">
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
                <UserProfileDropdown />
            </nav>

            <main className="home-content">
                <div className="page-header">
                    <h1>Presensi Karyawan</h1>
                    <div className="today-status">
                        <div className="status-item">
                            <span className="status-label">Clock-in:</span>
                            <span className={`status-value ${todayAttendance?.clockIn ? 'active' : ''}`}>
                                {isLoadingToday ? '...' : formatTime(todayAttendance?.clockIn ?? null)}
                            </span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Clock-out:</span>
                            <span className={`status-value ${todayAttendance?.clockOut ? 'active' : ''}`}>
                                {isLoadingToday ? '...' : formatTime(todayAttendance?.clockOut ?? null)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="home-grid">
                    <div className="grid-left">
                        <ClockInOutCard
                            todayAttendance={todayAttendance}
                            onClockAction={handleClockAction}
                        />
                    </div>
                    <div className="grid-right">
                        <AttendanceCalendar refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </main>
        </div>
    );
}
