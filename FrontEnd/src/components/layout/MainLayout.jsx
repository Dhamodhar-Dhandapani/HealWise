import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
    return (
        <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navbar />
                <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
