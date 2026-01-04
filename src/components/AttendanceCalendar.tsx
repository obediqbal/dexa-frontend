import { useState, useEffect } from 'react';
import { Attendance } from '../types';
import { attendanceApi } from '../api';
import './AttendanceCalendar.css';

interface AttendanceCalendarProps {
    refreshTrigger?: number;
}

export function AttendanceCalendar({ refreshTrigger }: AttendanceCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const fetchAttendances = async () => {
            setIsLoading(true);
            try {
                const startDate = new Date(year, month, 1).toISOString().split('T')[0];
                const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

                const response = await attendanceApi.getAttendanceHistory({
                    startDate,
                    endDate,
                    limit: 50,
                });
                setAttendances(response.data);
            } catch (error) {
                console.error('Failed to fetch attendance history:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAttendances();
    }, [year, month, refreshTrigger]);

    const getDaysInMonth = () => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: (number | null)[] = [];

        // Add empty cells for days before first day
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        return days;
    };

    const getAttendanceForDay = (day: number): Attendance | undefined => {
        return attendances.find((a) => {
            const date = new Date(a.clockIn);
            return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const goToPrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const days = getDaysInMonth();

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button className="nav-btn" onClick={goToPrevMonth}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <h3 className="month-title">{monthName}</h3>
                <button className="nav-btn" onClick={goToNextMonth}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="calendar-weekdays">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>

            {isLoading ? (
                <div className="calendar-loading">
                    <div className="spinner"></div>
                    Loading...
                </div>
            ) : (
                <div className="calendar-grid">
                    {days.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="calendar-cell empty"></div>;
                        }

                        const attendance = getAttendanceForDay(day);
                        const dayIsToday = isToday(day);

                        return (
                            <div key={day} className={`calendar-cell ${dayIsToday ? 'today' : ''} ${attendance ? 'has-attendance' : ''}`}>
                                <div className="cell-date">{day}</div>
                                {attendance && (
                                    <div className="cell-times">
                                        <div className="time-in">
                                            <span className="time-label">In:</span>
                                            <span>{formatTime(attendance.clockIn)}</span>
                                        </div>
                                        {attendance.clockOut && (
                                            <div className="time-out">
                                                <span className="time-label">Out:</span>
                                                <span>{formatTime(attendance.clockOut)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
