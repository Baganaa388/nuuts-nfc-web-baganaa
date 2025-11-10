import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './AdminLoginPage.css';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.adminLogin(formData.username, formData.password);
      navigate('/admin');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="admin-wrap">
      <div className="admin-card" style={{ maxWidth: '360px', margin: '80px auto' }}>
        <h3>Admin Login</h3>
        {error && <p className="err">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div className="row">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;

