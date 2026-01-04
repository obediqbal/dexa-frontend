import { useState, useEffect, useRef, useCallback } from 'react';
import { Attendance } from '../types';
import { attendanceApi } from '../api';
import './ClockInOutCard.css';

interface ClockInOutCardProps {
    todayAttendance: Attendance | null;
    onClockAction: () => void;
}

const DAYS_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function ClockInOutCard({ todayAttendance, onClockAction }: ClockInOutCardProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isClockedIn = todayAttendance?.clockIn && !todayAttendance?.clockOut;
    const actionLabel = isClockedIn ? 'Clock-out' : 'Clock-in';

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Photo must be less than 5MB');
                return;
            }
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Photo must be less than 5MB');
                return;
            }
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
            setError(null);
        }
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleClockAction = async () => {
        if (!photo) {
            setError('Please upload a WFH proof photo');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isClockedIn) {
                await attendanceApi.clockOut(photo);
            } else {
                await attendanceApi.clockIn(photo);
            }
            setPhoto(null);
            setPhotoPreview(null);
            onClockAction();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || `Failed to ${actionLabel.toLowerCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="clock-card">
            {(!todayAttendance?.clockIn || !todayAttendance?.clockOut) && (
                <div className="attendance-warning">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>
                        {!todayAttendance?.clockIn
                            ? "You haven't clocked in today"
                            : "You haven't clocked out today"}
                    </span>
                </div>
            )}

            <div className="clock-info">
                <div className="info-row">
                    <span className="info-label">Hari:</span>
                    <span className="info-value">{DAYS_ID[currentTime.getDay()]}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Tanggal:</span>
                    <span className="info-value">{formatDate(currentTime)}</span>
                </div>
                <div className="info-row">
                    <span className="info-label">Waktu:</span>
                    <span className="info-value time">{formatTime(currentTime)}</span>
                </div>
            </div>

            <div className="photo-section">
                <label className="photo-label">Bukti foto WFH:</label>
                <div
                    className={`photo-upload ${photoPreview ? 'has-photo' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {photoPreview ? (
                        <img src={photoPreview} alt="WFH proof" className="photo-preview" />
                    ) : (
                        <div className="upload-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Upload</span>
                            <span className="upload-hint">Click or drag photo here</span>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        hidden
                    />
                </div>
            </div>

            {error && <div className="clock-error">{error}</div>}

            <button
                className={`clock-button ${isClockedIn ? 'clock-out' : 'clock-in'}`}
                onClick={handleClockAction}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="button-loading">
                        <span className="spinner"></span>
                        Processing...
                    </span>
                ) : (
                    actionLabel
                )}
            </button>
        </div>
    );
}
