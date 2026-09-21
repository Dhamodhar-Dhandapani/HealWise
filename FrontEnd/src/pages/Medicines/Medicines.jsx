import { useEffect, useState } from 'react';
import { getOrders, createOrder, updateStatus, getByPatient } from '../../api/medicines';
import { Pill, RefreshCw, Plus, X, Search, Trash2 } from 'lucide-react';

export default function Medicines() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [filterPatient, setFilterPatient] = useState('');
    const [form, setForm] = useState({ patientId: '', deliveryAddress: '', prescriptionUrl: '', items: [{ medicineName: '', quantity: '', price: '', requiresPrescription: false }] });
    const [submitting, setSubmitting] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createOrder({
                patientId: Number(form.patientId),
                deliveryAddress: form.deliveryAddress,
                prescriptionUrl: form.prescriptionUrl || null,
                items: form.items.map(i => ({
                    medicineName: i.medicineName,
                    quantity: Number(i.quantity),
                    price: Number(i.price),
                    requiresPrescription: i.requiresPrescription
                }))
            });
            setShowAdd(false);
            setForm({ patientId: '', deliveryAddress: '', prescriptionUrl: '', items: [{ medicineName: '', quantity: '', price: '', requiresPrescription: false }] });
            fetchOrders();
        } catch (err) {
            alert('Failed: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateStatus(id, newStatus);
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed: ' + err.message);
        }
    };

    const handleFilter = async () => {
        if (!filterPatient) { fetchOrders(); return; }
        setLoading(true);
        try {
            const data = await getByPatient(Number(filterPatient));
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => setForm({ ...form, items: [...form.items, { medicineName: '', quantity: '', price: '', requiresPrescription: false }] });
    const removeItem = (idx) => setForm({ ...form, items: form.items.filter((_, i) => i !== idx) });
    const updateItem = (idx, field, val) => {
        const items = [...form.items];
        items[idx] = { ...items[idx], [field]: val };
        setForm({ ...form, items });
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>Medicine Orders</h1>
                    <p className="text-secondary">Track, create, and update medication orders.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={fetchOrders}><RefreshCw size={16} /> Refresh</button>
                    <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} /> Place Order</button>
                </div>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                <div className="form-group">
                    <label className="form-label">Patient ID</label>
                    <input className="form-input" type="number" placeholder="e.g. 1" value={filterPatient} onChange={e => setFilterPatient(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={handleFilter}><Search size={14} /> Filter</button>
                <button className="btn btn-secondary" onClick={() => { setFilterPatient(''); fetchOrders(); }}>Clear</button>
            </div>

            {loading ? <div className="p-8 text-center">Loading...</div> : (
                <div className="glass-panel">
                    <div className="glass-table-container">
                        <table className="glass-table">
                            <thead><tr><th>Order ID</th><th>Patient ID</th><th>Medicine</th><th>Quantity</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {orders.length === 0 ? <tr><td colSpan="6" className="text-center p-8">No orders found.</td></tr> : orders.map(o => (
                                    <tr key={o.id}>
                                        <td>{o.id}</td>
                                        <td>PT-{o.patientId}</td>
                                        <td style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                                            <Pill size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                            {o.medicineName || (o.items && o.items.length > 0 ? o.items.map(i => i.medicineName).join(', ') : '—')}
                                        </td>
                                        <td>{o.quantity || (o.items && o.items.length > 0 ? o.items.reduce((s, i) => s + (i.quantity || 0), 0) : '—')}</td>
                                        <td><span className={`badge ${o.status === 'PENDING' ? 'badge-warning' : o.status === 'COMPLETED' ? 'badge-success' : o.status === 'CANCELLED' ? 'badge-danger' : 'badge-info'}`}>{o.status}</span></td>
                                        <td>
                                            <select
                                                className="form-select"
                                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto', minWidth: '110px' }}
                                                value={o.status}
                                                onChange={e => handleStatusChange(o.id, e.target.value)}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                                <option value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Place Order Modal */}
            {showAdd && (
                <div className="modal-overlay" onClick={() => setShowAdd(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 style={{ margin: 0 }}>Place Medicine Order</h2>
                            <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setShowAdd(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Patient ID *</label>
                                    <input className="form-input" type="number" required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Prescription URL</label>
                                    <input className="form-input" value={form.prescriptionUrl} onChange={e => setForm({ ...form, prescriptionUrl: e.target.value })} placeholder="Optional" />
                                </div>
                                <div className="form-group full-width">
                                    <label className="form-label">Delivery Address *</label>
                                    <input className="form-input" required value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} />
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="form-label" style={{ margin: 0 }}>Order Items</label>
                                    <button type="button" className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={addItem}><Plus size={12} /> Add Item</button>
                                </div>
                                {form.items.map((item, idx) => (
                                    <div key={idx} style={{ background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '0.75rem' }}>
                                        <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                                            <span className="text-xs text-muted">Item #{idx + 1}</span>
                                            {form.items.length > 1 && (
                                                <button type="button" className="btn" style={{ padding: '0.2rem', background: 'transparent', border: 'none' }} onClick={() => removeItem(idx)}><Trash2 size={13} className="text-danger" /></button>
                                            )}
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Medicine Name *</label>
                                                <input className="form-input" required value={item.medicineName} onChange={e => updateItem(idx, 'medicineName', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Quantity *</label>
                                                <input className="form-input" type="number" min="1" required value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Price *</label>
                                                <input className="form-input" type="number" step="0.01" min="0" required value={item.price} onChange={e => updateItem(idx, 'price', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Requires Rx?</label>
                                                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                                                    <input type="checkbox" checked={item.requiresPrescription} onChange={e => updateItem(idx, 'requiresPrescription', e.target.checked)} />
                                                    <span className="text-sm">{item.requiresPrescription ? 'Yes' : 'No'}</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="btn-group">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Placing...' : 'Place Order'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
