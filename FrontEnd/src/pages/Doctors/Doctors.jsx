import { useEffect, useState } from 'react';
import { getDoctors, createDoctor, getAvailability, createSlots } from '../../api/doctors';
import { Stethoscope, RefreshCw, Plus, X, Clock, CalendarDays } from 'lucide-react';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRegister, setShowRegister] = useState(false);
    const [showSchedule, setShowSchedule] = useState(null); // doctorId
    const [showAddSlot, setShowAddSlot] = useState(null); // doctorId
    const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [form, setForm] = useState({ name: '', qualification: '', specialization: '', fee: '', hospitalId: '' });
    const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchDoctors = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDoctors();
            setDoctors(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createDoctor({
                name: form.name,
                qualification: form.qualification,
                specialization: form.specialization,
                fee: Number(form.fee),
                hospitalId: Number(form.hospitalId)
            });
            setShowRegister(false);
            setForm({ name: '', qualification: '', specialization: '', fee: '', hospitalId: '' });
            fetchDoctors();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const viewSchedule = async (doctorId) => {
        setShowSchedule(doctorId);
        setSlotsLoading(true);
        try {
            const data = await getAvailability(doctorId, scheduleDate);
            setSlots(Array.isArray(data) ? data : []);
        } catch {
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const refreshSchedule = async () => {
        if (!showSchedule) return;
        setSlotsLoading(true);
        try {
            const data = await getAvailability(showSchedule, scheduleDate);
            setSlots(Array.isArray(data) ? data : []);
        } catch {
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createSlots(showAddSlot, {
                date: slotForm.date,
                startTime: slotForm.startTime,
                endTime: slotForm.endTime
            });
            setShowAddSlot(null);
            setSlotForm({ date: '', startTime: '', endTime: '' });
            if (showSchedule) refreshSchedule();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>Doctor Directory</h1>
                    <p className="text-secondary">Manage physicians, schedules, and consultation slots.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={fetchDoctors}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowRegister(true)}><Plus size={16} /> Register Doctor</button>
                </div>
            </div>

            {error ? (
                <div className="glass-panel text-center" style={{ padding: '2rem' }}>
                    <p className="text-danger mb-4">{error}</p>
                    <button className="btn btn-primary" onClick={fetchDoctors}>Retry</button>
                </div>
            ) : loading ? (
                <div className="flex justify-center p-8">Loading doctors...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {doctors.length === 0 ? (
                        <div className="glass-panel text-center" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                            <Stethoscope size={48} className="text-muted mb-4 opacity-50" style={{ margin: '0 auto' }} />
                            <p>No doctors found.</p>
                        </div>
                    ) : (
                        doctors.map(d => (
                            <div key={d.id} className="glass-card flex flex-col" style={{ padding: '1.5rem' }}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Stethoscope size={24} color="white" />
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Dr. {d.name}</h3>
                                        <p style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.875rem' }}>{d.specialization}</p>
                                    </div>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--border-radius-sm)' }}>
                                    <p className="flex justify-between mb-2">
                                        <span className="text-muted text-sm">Qualification:</span>
                                        <span className="font-medium">{d.qualification}</span>
                                    </p>
                                    <p className="flex justify-between mb-2">
                                        <span className="text-muted text-sm">Fee:</span>
                                        <span className="font-medium">₹{d.fee}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-muted text-sm">Hospital ID:</span>
                                        <span className="font-medium">{d.hospitalId}</span>
                                    </p>
                                </div>

                                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                                    <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => viewSchedule(d.id)}>
                                        <Clock size={14} /> View Schedule
                                    </button>
                                    <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setShowAddSlot(d.id); setSlotForm({ date: '', startTime: '', endTime: '' }); }}>
                                        <Plus size={14} /> Add Slot
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Register Doctor Modal */}
            {showRegister && (
                <div className="modal-overlay" onClick={() => setShowRegister(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Register Doctor</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowRegister(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleRegister}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Specialization *</label>
                                    <input className="form-input" required value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Qualification *</label>
                                    <input className="form-input" required value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Fee *</label>
                                    <input className="form-input" type="number" step="0.01" required value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Hospital ID *</label>
                                    <input className="form-input" type="number" required value={form.hospitalId} onChange={e => setForm({ ...form, hospitalId: e.target.value })} />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowRegister(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Registering...' : 'Register Doctor'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Schedule Modal */}
            {showSchedule && (
                <div className="modal-overlay" onClick={() => setShowSchedule(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}><CalendarDays size={20} style={{ display: 'inline', marginRight: '0.5rem' }} />Schedule — Doctor #{showSchedule}</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowSchedule(null)}><X size={18} /></button>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input className="form-input" type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                            <button className="btn btn-primary" onClick={refreshSchedule}>Load</button>
                        </div>
                        {slotsLoading ? <p className="text-center">Loading slots...</p> : (
                            slots.length === 0 ? <p className="text-center text-muted">No available slots for this date.</p> : (
                                <div className="glass-table-container">
                                    <table className="glass-table">
                                        <thead><tr><th>Slot ID</th><th>Date</th><th>Start</th><th>End</th><th>Available</th></tr></thead>
                                        <tbody>
                                            {slots.map(s => (
                                                <tr key={s.id}>
                                                    <td>{s.id}</td>
                                                    <td>{s.date}</td>
                                                    <td>{s.startTime}</td>
                                                    <td>{s.endTime}</td>
                                                    <td><span className={`badge ${s.available ? 'badge-success' : 'badge-danger'}`}>{s.available ? 'Yes' : 'No'}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Add Slot Modal */}
            {showAddSlot && (
                <div className="modal-overlay" onClick={() => setShowAddSlot(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Add Time Slot — Doctor #{showAddSlot}</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowAddSlot(null)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAddSlot}>
                            <div className="form-group">
                                <label className="form-label">Date *</label>
                                <input className="form-input" type="date" required value={slotForm.date} onChange={e => setSlotForm({ ...slotForm, date: e.target.value })} />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Start Time *</label>
                                    <input className="form-input" type="time" required value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">End Time *</label>
                                    <input className="form-input" type="time" required value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSlot(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Adding...' : 'Add Slot'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
