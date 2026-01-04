import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Staff } from '../types';
import { staffApi } from '../api';
import { useAuth } from '../context';
import './UserProfileDropdown.css';

export function UserProfileDropdown() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [profile, setProfile] = useState<Staff | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await staffApi.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) {
        return <div className="profile-skeleton">Loading...</div>;
    }

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            <button className="profile-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span>Halo, </span>
                <span className="profile-name">{profile?.firstName || 'User'}</span>
                <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="profile-menu">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                        </div>
                        <div className="profile-details">
                            <div className="profile-fullname">{profile?.firstName} {profile?.lastName}</div>
                            <div className="profile-email">{profile?.email}</div>
                        </div>
                    </div>
                    <div className="profile-meta">
                        {profile?.department && (
                            <div className="meta-item">
                                <span className="meta-label">Department</span>
                                <span className="meta-value">{profile.department}</span>
                            </div>
                        )}
                        {profile?.position && (
                            <div className="meta-item">
                                <span className="meta-label">Position</span>
                                <span className="meta-value">{profile.position}</span>
                            </div>
                        )}
                    </div>
                    <div className="profile-actions">
                        <button className="logout-btn" onClick={handleLogout}>
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
