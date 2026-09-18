import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [activeTab, setActiveTab] = useState('hospitals');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/${tab}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${tab}. Backend might not be running or the DB is empty/failing.`);
      }
      const data = await response.json();
      if (tab === 'hospitals') {
        setHospitals(data);
      } else {
        setDoctors(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>HealWise System</h1>
        <nav>
          <button className={activeTab === 'hospitals' ? 'active' : ''} onClick={() => setActiveTab('hospitals')}>Hospitals</button>
          <button className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>Doctors</button>
        </nav>
      </header>

      <main className="main-content">
        {loading && <div className="loader">Loading {activeTab}...</div>}
        {error && <div className="error-box">Error: {error}</div>}

        {!loading && !error && activeTab === 'hospitals' && (
          <div className="grid">
            {hospitals.length === 0 ? <p>No hospitals found in the database.</p> : hospitals.map(h => (
              <div key={h.id} className="card">
                <h2>{h.name || 'Unnamed Hospital'}</h2>
                <p><strong>Location:</strong> {h.location}</p>
                <p><strong>Available Beds:</strong> {h.availableBeds}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && activeTab === 'doctors' && (
          <div className="grid">
            {doctors.length === 0 ? <p>No doctors found in the database.</p> : doctors.map(d => (
              <div key={d.id} className="card">
                <h2>{d.name || 'Unnamed Doctor'}</h2>
                <p><strong>Specialization:</strong> {d.specialization}</p>
                <p><strong>Hospital ID:</strong> {d.hospitalId}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
