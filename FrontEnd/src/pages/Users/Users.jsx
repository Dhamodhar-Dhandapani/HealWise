import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../api/users';
import { Trash2, User, RefreshCw } from 'lucide-react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            alert('Failed to delete user: ' + err.message);
        }
    };

    return (
        <div className="page-container animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem' }}>User Management</h1>
                    <p className="text-secondary">View and manage all registered system users.</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchUsers}>
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            {error ? (
                <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p className="text-danger mb-4">{error}</p>
                    <button className="btn btn-primary" onClick={fetchUsers}>Retry</button>
                </div>
            ) : loading ? (
                <div className="flex justify-center p-8">Loading users...</div>
            ) : (
                <div className="glass-panel">
                    <div className="glass-table-container">
                        <table className="glass-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center" style={{ padding: '2rem' }}>No users found</td></tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                                                        <User size={14} />
                                                    </div>
                                                    {u.username}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : 'badge-info'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td>{u.email || 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="btn"
                                                    style={{ padding: '0.4rem', background: 'transparent', border: 'none' }}
                                                    onClick={() => handleDelete(u.id)}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} className="text-danger" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
