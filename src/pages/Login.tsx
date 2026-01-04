import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context';
import './Login.css';

interface LocationState {
    from?: { pathname: string };
}

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login({ email, password });

            const state = location.state as LocationState;
            const from = state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setApiError(
                err.response?.data?.message || 'Login failed. Please check your credentials.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <span className="logo-not">Not</span><span className="logo-talenta">Talenta</span>
                    </div>
                    <h1 className="login-title">Welcome Back</h1>
                    <p className="login-subtitle">Sign in to your account</p>
                </div>

                {apiError && (
                    <div className="login-error-banner">
                        <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p>{apiError}</p>
                    </div>
                )}

                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                            }}
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                        {errors.password && <p className="form-error">{errors.password}</p>}
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        <span className="login-button-content">
                            {isLoading && <span className="button-spinner" />}
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </span>
                    </button>
                </form>
            </div>
        </div>
    );
}
