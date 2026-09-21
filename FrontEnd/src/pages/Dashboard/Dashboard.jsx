import { Users, Calendar, Stethoscope, Bed, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getPatients } from '../../api/patients';
import { getAppointments } from '../../api/appointments';
import { getDoctors } from '../../api/doctors';
import { getHospitals } from '../../api/hospitals';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ patients: '—', appointments: '—', doctors: '—', beds: '—' });
    const [recentAppts, setRecentAppts] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const [pats, appts, docs, hosps] = await Promise.allSettled([
                    getPatients(),
                    getAppointments(),
                    getDoctors(),
                    getHospitals()
                ]);
                const patList = pats.status === 'fulfilled' && Array.isArray(pats.value) ? pats.value : [];
                const apptList = appts.status === 'fulfilled' && Array.isArray(appts.value) ? appts.value : [];
                const docList = docs.status === 'fulfilled' && Array.isArray(docs.value) ? docs.value : [];
                const hospList = hosps.status === 'fulfilled' && Array.isArray(hosps.value) ? hosps.value : [];

                const totalBeds = hospList.reduce((sum, h) => sum + (h.availableBeds || h.AvailableBeds || 0), 0);

                setStats({
                    patients: patList.length.toLocaleString(),
                    appointments: apptList.length.toLocaleString(),
                    doctors: docList.length.toLocaleString(),
                    beds: totalBeds.toLocaleString()
                });
                setDoctors(docList);
                setRecentAppts(apptList.slice(-5).reverse());
            } catch { /* graceful fallback */ }
        };
        load();
    }, []);

    const getDoctorName = (id) => {
        const d = doctors.find(doc => doc.id === id);
        return d ? `Dr. ${d.name}` : `DR-${id}`;
    };

    const statCards = [
        { title: 'Total Patients', value: stats.patients, icon: <Users size={24} />, color: 'var(--accent-primary)', glow: 'rgba(59, 130, 246, 0.2)' },
        { title: 'Appointments', value: stats.appointments, icon: <Calendar size={24} />, color: 'var(--warning)', glow: 'rgba(245, 158, 11, 0.2)' },
        { title: 'Doctors', value: stats.doctors, icon: <Stethoscope size={24} />, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.2)' },
        { title: 'Available Beds', value: stats.beds, icon: <Bed size={24} />, color: 'var(--success)', glow: 'rgba(16, 185, 129, 0.2)' },
    ];

    return (
        <div className="page-container animate-fade-in" style={{ padding: '2rem' }}>
            <div className="mb-8 p-6 glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))', borderLeft: '4px solid var(--accent-primary)' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    Welcome back, <span className="text-accent">{user?.firstName || 'Admin'}</span>!
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Here's an overview of the HealWise operational status.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map((stat, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', fontWeight: 500 }}>{stat.title}</p>
                                <h3 style={{ fontSize: '2.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.025em' }}>{stat.value}</h3>
                            </div>
                            <div style={{ padding: '0.85rem', borderRadius: '0.75rem', background: stat.glow, color: stat.color, boxShadow: `0 4px 12px ${stat.glow}` }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 500, marginTop: 'auto' }}>
                            <TrendingUp size={14} />
                            <span>Live from API</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div className="flex justify-between items-center mb-6">
                    <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>Recent Appointments</h3>
                </div>
                <div className="glass-table-container">
                    <table className="glass-table">
                        <thead>
                            <tr><th>ID</th><th>Date/Time</th><th>Doctor</th><th>Patient ID</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {recentAppts.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-8">No recent appointments.</td></tr>
                            ) : recentAppts.map(a => (
                                <tr key={a.id}>
                                    <td>APT-{a.id}</td>
                                    <td>{a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}</td>
                                    <td>{getDoctorName(a.doctorId)}</td>
                                    <td>PT-{a.patientId}</td>
                                    <td><span className={`badge ${a.status === 'CANCELLED' ? 'badge-danger' : a.status === 'COMPLETED' ? 'badge-success' : 'badge-info'}`}>{a.status || 'SCHEDULED'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
