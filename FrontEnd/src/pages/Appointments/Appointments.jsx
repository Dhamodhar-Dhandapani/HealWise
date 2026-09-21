import { useEffect, useState } from 'react';
import { getAppointments, createAppointment, cancelAppointment, getByPatient, getByDoctor } from '../../api/appointments';
import { Calendar, RefreshCw, Plus, X, Ban, Search } from 'lucide-react';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filterPatient, setFilterPatient] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [form, setForm] = useState({ patientId: '', doctorId: '', hospitalId: '', slotId: '', notes: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchAppts = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAppointments();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppts(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAppointment({
                patientId: Number(form.patientId),
                doctorId: Number(form.doctorId),
                hospitalId: Number(form.hospitalId),
                slotId: Number(form.slotId),
                notes: form.notes
            });
            setShowModal(false);
            setForm({ patientId: '', doctorId: '', hospitalId: '', slotId: '', notes: '' });
            fetchAppts();
        } catch (err) {
            alert('Failed to book: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await cancelAppointment(id);
            setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        } catch (err) {
            alert('Failed to cancel: ' + err.message);
        }
    };

    const handleFilter = async () => {
        setLoading(true);
        setError('');
        try {
            let data;
            if (filterPatient) {
                data = await getByPatient(Number(filterPatient));
            } else if (filterDoctor && filterDate) {
                data = await getByDoctor(Number(filterDoctor), filterDate);
            } else {
                data = await getAppointments();
            }
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilterPatient('');
        setFilterDoctor('');
        setFilterDate('');
        fetchAppts();
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>Appointments</h1>
                    <p className="text-secondary">Manage and schedule hospital appointments.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={fetchAppts}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Book Appointment</button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="form-group">
                    <label className="form-label">Patient ID</label>
                    <input className="form-input" type="number" placeholder="e.g. 1" value={filterPatient} onChange={e => { setFilterPatient(e.target.value); setFilterDoctor(''); setFilterDate(''); }} />
                </div>
                <div className="form-group">
                    <label className="form-label">Doctor ID</label>
                    <input className="form-input" type="number" placeholder="e.g. 1" value={filterDoctor} onChange={e => { setFilterDoctor(e.target.value); setFilterPatient(''); }} />
                </div>
                <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={handleFilter}><Search size={14} /> Filter</button>
                <button className="btn btn-secondary" onClick={clearFilters}>Clear</button>
            </div>

            {error && <div className="glass-panel text-center p-6 mb-6"><p className="text-danger">{error}</p></div>}

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div className="glass-panel">
                    <div className="glass-table-container">
                        <table className="glass-table">
                            <thead><tr><th>ID</th><th>Date/Time</th><th>Doctor ID</th><th>Patient ID</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {appointments.length === 0 ? <tr><td colSpan="6" className="text-center p-8">No appointments found.</td></tr> : appointments.map(a => (
                                    <tr key={a.id}>
                                        <td>APT-{a.id}</td>
                                        <td><Calendar size={14} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--accent-primary)' }} />{a.appointmentDate ? new Date(a.appointmentDate).toLocaleString() : '—'}</td>
                                        <td>DR-{a.doctorId}</td>
                                        <td>PT-{a.patientId}</td>
                                        <td><span className={`badge ${a.status === 'CANCELLED' ? 'badge-danger' : 'badge-success'}`}>{a.status || 'SCHEDULED'}</span></td>
                                        <td>
                                            {a.status !== 'CANCELLED' && (
                                                <button className="btn btn-danger" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleCancel(a.id)} title="Cancel Appointment">
                                                    <Ban size={13} /> Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Book Appointment Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Book Appointment</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Patient ID *</label>
                                    <input className="form-input" type="number" required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Doctor ID *</label>
                                    <input className="form-input" type="number" required value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Hospital ID *</label>
                                    <input className="form-input" type="number" required value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Slot ID *</label>
                                    <input className="form-input" type="number" required value={form.slotId} onChange={e => setForm({ ...form, slotId: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Notes</label>
                                    <input className="form-input" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Booking...' : 'Book Appointment'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
