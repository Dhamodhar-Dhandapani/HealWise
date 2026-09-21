import { useEffect, useState } from 'react';
import { getHospitals, createHospital, deleteHospital, updateBeds, getBedInventory, allotBed, dischargeBed, setBedInventory } from '../../api/hospitals';
import { Bed, RefreshCw, Plus, X, Trash2, Settings, UserPlus, LogOut } from 'lucide-react';

const BED_CATEGORIES = ['ICU', 'GENERAL', 'PEDIATRIC', 'VENTILATOR'];

export default function Hospitals() {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showInventory, setShowInventory] = useState(null); // hospitalId
    const [inventory, setInventory] = useState([]);
    const [invLoading, setInvLoading] = useState(false);
    const [showAllot, setShowAllot] = useState(null); // hospitalId
    const [showSetInv, setShowSetInv] = useState(null); // hospitalId
    const [updateBedsId, setUpdateBedsId] = useState(null);
    const [bedsCount, setBedsCount] = useState('');
    const [form, setForm] = useState({ name: '', address: '', email: '', contactNumber: '', totalBeds: '', availableBeds: '' });
    const [allotForm, setAllotForm] = useState({ patientId: '', category: 'GENERAL' });
    const [invForm, setInvForm] = useState({ category: 'GENERAL', totalCount: '', availableCount: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const data = await getHospitals();
            setHospitals(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchHospitals(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createHospital({
                name: form.name, address: form.address, email: form.email,
                contactNumber: form.contactNumber,
                totalBeds: Number(form.totalBeds), availableBeds: Number(form.availableBeds)
            });
            setShowAdd(false);
            setForm({ name: '', address: '', email: '', contactNumber: '', totalBeds: '', availableBeds: '' });
            fetchHospitals();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this hospital?')) return;
        try {
            await deleteHospital(id);
            setHospitals(prev => prev.filter(h => (h.id || h.HospitalId || h.hospitalId) !== id));
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const handleUpdateBeds = async (id) => {
        try {
            await updateBeds(id, { beds: Number(bedsCount) });
            setUpdateBedsId(null);
            fetchHospitals();
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const openInventory = async (hospitalId) => {
        setShowInventory(hospitalId);
        setInvLoading(true);
        try {
            const data = await getBedInventory(hospitalId);
            setInventory(Array.isArray(data) ? data : []);
        } catch {
            setInventory([]);
        } finally {
            setInvLoading(false);
        }
    };

    const handleAllotBed = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await allotBed(showAllot, Number(allotForm.patientId), allotForm.category);
            setShowAllot(null);
            if (showInventory) openInventory(showInventory);
            fetchHospitals();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDischarge = async (hospitalId, allotmentId) => {
        if (!window.confirm('Discharge this patient?')) return;
        try {
            await dischargeBed(hospitalId, allotmentId);
            if (showInventory) openInventory(showInventory);
            fetchHospitals();
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const handleSetInventory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await setBedInventory(showSetInv, invForm.category, Number(invForm.totalCount), Number(invForm.availableCount));
            setShowSetInv(null);
            if (showInventory) openInventory(showInventory);
            fetchHospitals();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getId = (h) => h.id || h.HospitalId || h.hospitalId;
    const getName = (h) => h.name || h.Name;
    const getAddr = (h) => h.address || h.Address;
    const getTotal = (h) => h.totalBeds ?? h.TotalBeds ?? 0;
    const getAvail = (h) => h.availableBeds ?? h.AvailableBeds ?? 0;

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>Hospitals & Beds</h1>
                    <p className="text-secondary">Manage facilities, bed capacities, and allotments.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={fetchHospitals}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Hospital</button>
                </div>
            </div>

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {hospitals.length === 0 ? <div className="glass-panel text-center p-8 w-full" style={{ gridColumn: '1 / -1' }}>No hospitals found.</div> : hospitals.map(h => (
                        <div key={getId(h)} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                                    <Bed className="text-accent" /> {getName(h)}
                                </h3>
                                <button className="btn" style={{ padding: '0.3rem', background: 'transparent', border: 'none' }} onClick={() => handleDelete(getId(h))} title="Delete"><Trash2 size={16} className="text-danger" /></button>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{getAddr(h)}</p>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Capacity</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0 }}>{getTotal(h)}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Available Beds</p>
                                    <p style={{ fontWeight: 700, fontSize: '1.25rem', margin: 0, color: 'var(--success)' }}>{getAvail(h)}</p>
                                </div>
                            </div>

                            {/* Update Beds inline */}
                            {updateBedsId === getId(h) ? (
                                <div className="flex gap-2 mb-4">
                                    <input className="form-input" type="number" placeholder="New bed count" value={bedsCount} onChange={e => setBedsCount(e.target.value)} style={{ flex: 1 }} />
                                    <button className="btn btn-primary" onClick={() => handleUpdateBeds(getId(h))}>Save</button>
                                    <button className="btn btn-secondary" onClick={() => setUpdateBedsId(null)}>×</button>
                                </div>
                            ) : (
                                <button className="btn btn-secondary mb-2 w-full" style={{ justifyContent: 'center', marginBottom: '0.5rem' }} onClick={() => { setUpdateBedsId(getId(h)); setBedsCount(''); }}>
                                    <Settings size={14} /> Update Beds
                                </button>
                            )}

                            <div className="flex gap-2">
                                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => openInventory(getId(h))}>
                                    <Bed size={14} /> Manage Inventory
                                </button>
                                <button className="btn btn-secondary" style={{ justifyContent: 'center' }} onClick={() => { setShowAllot(getId(h)); setAllotForm({ patientId: '', category: 'GENERAL' }); }} title="Allot Bed">
                                    <UserPlus size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Hospital Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Add Hospital</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowAdd(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label className="form-label">Hospital Name *</label>
                                    <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Address *</label>
                                    <input className="form-input" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email *</label>
                                    <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Contact Number *</label>
                                    <input className="form-input" required value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Total Beds *</label>
                                    <input className="form-input" type="number" min="0" required value={form.totalBeds} onChange={e => setForm({ ...form, totalBeds: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Available Beds *</label>
                                    <input className="form-input" type="number" min="0" required value={form.availableBeds} onChange={e => setForm({ ...form, availableBeds: e.target.value })} />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating...' : 'Add Hospital'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bed Inventory Modal */}
            {showInventory && (
                <div className="modal-overlay" onClick={() => setShowInventory(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Bed Inventory — Hospital #{showInventory}</h2>
                            <div className="flex gap-2">
                                <button className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => { setShowSetInv(showInventory); setInvForm({ category: 'GENERAL', totalCount: '', availableCount: '' }); }}><Plus size={14} /> Set Inventory</button>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowInventory(null)}><X size={18} /></button>
                            </div>
                        </div>
                        {invLoading ? <p className="text-center">Loading...</p> : (
                            inventory.length === 0 ? <p className="text-center text-muted">No bed inventory configured.</p> : (
                                <div className="glass-table-container">
                                    <table className="glass-table">
                                        <thead><tr><th>ID</th><th>Category</th><th>Total</th><th>Available</th></tr></thead>
                                        <tbody>
                                            {inventory.map(inv => (
                                                <tr key={inv.id}>
                                                    <td>{inv.id}</td>
                                                    <td><span className="badge badge-info">{inv.category || inv.bedCategory}</span></td>
                                                    <td>{inv.totalCount}</td>
                                                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{inv.availableCount}</td>
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

            {/* Allot Bed Modal */}
            {showAllot && (
                <div className="modal-overlay" onClick={() => setShowAllot(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Allot Bed — Hospital #{showAllot}</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowAllot(null)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleAllotBed}>
                            <div className="form-group">
                                <label className="form-label">Patient ID *</label>
                                <input className="form-input" type="number" required value={allotForm.patientId} onChange={e => setAllotForm({ ...allotForm, patientId: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bed Category *</label>
                                <select className="form-select" value={allotForm.category} onChange={e => setAllotForm({ ...allotForm, category: e.target.value })}>
                                    {BED_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAllot(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Allotting...' : 'Allot Bed'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Set Inventory Modal */}
            {showSetInv && (
                <div className="modal-overlay" onClick={() => setShowSetInv(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Set Bed Inventory</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowSetInv(null)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSetInventory}>
                            <div className="form-group">
                                <label className="form-label">Bed Category *</label>
                                <select className="form-select" value={invForm.category} onChange={e => setInvForm({ ...invForm, category: e.target.value })}>
                                    {BED_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Total Count *</label>
                                    <input className="form-input" type="number" min="0" required value={invForm.totalCount} onChange={e => setInvForm({ ...invForm, totalCount: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Available Count *</label>
                                    <input className="form-input" type="number" min="0" required value={invForm.availableCount} onChange={e => setInvForm({ ...invForm, availableCount: e.target.value })} />
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowSetInv(null)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Saving...' : 'Set Inventory'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
