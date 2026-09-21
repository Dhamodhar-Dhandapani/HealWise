import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Mail, Lock, Activity } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div className="flex items-center justify-center mb-6 gap-2 text-accent">
                    <Activity size={32} />
                    <h1 style={{ marginBottom: 0 }}>HealWise</h1>
                </div>
                <h2 className="mb-2" style={{ textAlign: 'center' }}>Welcome Back</h2>
                <p className="mb-6" style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Login to access your dashboard</p>

                {error && <div className="text-danger mb-4" style={{ textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '0.5rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label flex justify-between">
                            <span>Password</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Enter your password"
                                required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={isLoading}>
                        <LogIn size={18} />
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 flex items-center justify-center gap-2" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Don't have an account?</span>
                    <Link to="/register" className="text-accent" style={{ textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
}
