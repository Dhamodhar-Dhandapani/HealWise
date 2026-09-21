import { NavLink } from 'react-router-dom';
import { Home, Calendar, Users, Activity, Bed, Pill, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
    const { user } = useAuth();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
        { name: 'Appointments', path: '/appointments', icon: <Calendar size={20} /> },
        { name: 'Doctors', path: '/doctors', icon: <Stethoscope size={20} /> },
        { name: 'Hospitals & Beds', path: '/hospitals', icon: <Bed size={20} /> },
        { name: 'Patients', path: '/patients', icon: <Users size={20} /> },
        { name: 'Medicines', path: '/medicines', icon: <Pill size={20} /> },
        // A user settings page could be added later
    ];

    return (
        <aside className="glass-panel" style={{ width: '260px', height: '100%', borderRadius: 0, borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', zIndex: 20 }}>
            <div className="p-6 flex items-center gap-3 text-accent" style={{ borderBottom: '1px solid var(--glass-border)', padding: '1.25rem 1.5rem' }}>
                <Activity size={28} />
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>HealWise</span>
            </div>

            <div className="flex-1" style={{ overflowY: 'auto', padding: '1.5rem 1rem' }}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider pl-3" style={{ color: 'var(--text-muted)' }}>Menu</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {navItems.map(item => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--border-radius-md)',
                                    textDecoration: 'none',
                                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                    borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                                    fontWeight: isActive ? 500 : 400,
                                    transition: 'all var(--transition-fast)'
                                })}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
