import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="glass-panel" style={{ borderRadius: 0, borderBottom: '1px solid var(--glass-border)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
            <div className="flex items-center gap-4">
                <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>Hospital Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-3 pl-6" style={{ borderLeft: '1px solid var(--glass-border)' }}>
                    <div className="flex flex-col items-end" style={{ lineHeight: 1.2 }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.firstName ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}` : 'User'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role || 'Administrator'}</span>
                    </div>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px var(--accent-glow)' }}>
                        <User size={18} color="white" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="ml-2 btn"
                        style={{ padding: '0.5rem', border: '1px solid var(--glass-border)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--danger)', borderRadius: 'var(--border-radius-sm)' }}
                        title="Logout"
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
}
