import { useEffect, useState } from 'react';
import { getPatients, getPatient, createPatient, updatePatient, deletePatient } from '../../api/patients';
import { Users, RefreshCw, Plus, X, Trash2, Edit, Eye } from 'lucide-react';

const emptyForm = { name: '', email: '', address: '', phone: '', gender: '', birthDate: '', emergencyContact: '', bloodGroup: '', alergies: '', chronicConditions: '' };

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [viewPatient, setViewPatient] = useState(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data = await getPatients();
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPatients(); }, []);

    const openAdd = () => {
        setForm({ ...emptyForm });
        setEditingId(null);
        setShowAdd(true);
    };

    const openEdit = (p) => {
        setForm({
            name: p.name || '', email: p.email || '', address: p.address || '',
            phone: p.phone || '', gender: p.gender || '', birthDate: p.birthDate || '',
            emergencyContact: p.emergencyContact || '', bloodGroup: p.bloodGroup || '',
            alergies: p.alergies || '', chronicConditions: p.chronicConditions || ''
        });
        setEditingId(p.id);
        setShowAdd(true);
    };

    const handleViewProfile = async (id) => {
        try {
            const data = await getPatient(id);
            setViewPatient(data);
        } catch (err) {
            alert('Failed to load: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await updatePatient(editingId, form);
            } else {
                await createPatient(form);
            }
            setShowAdd(false);
            setEditingId(null);
            fetchPatients();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this patient record?')) return;
        try {
            await deletePatient(id);
            setPatients(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const closeModal = () => { setShowAdd(false); setEditingId(null); };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>Patients Directory</h1>
                    <p className="text-secondary">View, create, and manage registered patients.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={fetchPatients}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn btn-primary" onClick={openAdd}><Plus size={16} /> Add Patient</button>
                </div>
            </div>

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div className="glass-panel">
                    <div className="glass-table-container">
                        <table className="glass-table">
                            <thead><tr><th>ID</th><th>Name</th><th>Gender</th><th>Phone</th><th>Blood</th><th>Actions</th></tr></thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center p-8">No records found.</td></tr>
                                ) : patients.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td style={{ fontWeight: 500, color: 'var(--accent-primary)' }}><Users size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />{p.name}</td>
                                        <td>{p.gender || '—'}</td>
                                        <td>{p.phone || p.contactNumber || p.contact || '—'}</td>
                                        <td><span className="badge badge-danger">{p.bloodGroup || '—'}</span></td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn btn-secondary" style={{ padding: '0.35rem 0.5rem' }} onClick={() => handleViewProfile(p.id)} title="View Profile"><Eye size={14} /></button>
                                                <button className="btn btn-secondary" style={{ padding: '0.35rem 0.5rem' }} onClick={() => openEdit(p)} title="Edit"><Edit size={14} /></button>
                                                <button className="btn" style={{ padding: '0.35rem 0.5rem', background: 'transparent', border: 'none' }} onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={14} className="text-danger" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Add/Edit Patient Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>{editingId ? 'Edit Patient' : 'Add Patient'}</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={closeModal}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone *</label>
                                    <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Gender *</label>
                                    <select className="form-select" required value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Birth Date *</label>
                                    <input className="form-input" type="date" required value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Blood Group *</label>
                                    <select className="form-select" required value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                                        <option value="">Select</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Address *</label>
                                    <input className="form-input" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Emergency Contact *</label>
                                    <input className="form-input" required value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Allergies</label>
                                    <input className="form-input" value={form.alergies} onChange={e => setForm({ ...form, alergies: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Chronic Conditions</label>
                                    <input className="form-input" value={form.chronicConditions} onChange={e => setForm({ ...form, chronicConditions: e.target.value })} />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : editingId ? 'Update Patient' : 'Add Patient'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {viewPatient && (
                <div className="modal-overlay" onClick={() => setViewPatient(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Patient Profile</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setViewPatient(null)}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                ['Name', viewPatient.name],
                                ['Email', viewPatient.email],
                                ['Phone', viewPatient.phone],
                                ['Gender', viewPatient.gender],
                                ['Birth Date', viewPatient.birthDate],
                                ['Blood Group', viewPatient.bloodGroup],
                                ['Address', viewPatient.address],
                                ['Emergency Contact', viewPatient.emergencyContact],
                                ['Allergies', viewPatient.alergies || '—'],
                                ['Chronic Conditions', viewPatient.chronicConditions || '—'],
                            ].map(([label, val]) => (
                                <div key={label} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)' }}>
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{val || '—'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
