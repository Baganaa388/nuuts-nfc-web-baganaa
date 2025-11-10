import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [lastScan, setLastScan] = useState(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [messageOk, setMessageOk] = useState(false);

  // Form states
  const [txForm, setTxForm] = useState({ uid: '', amount: '', user_label: '' });
  const [regForm, setRegForm] = useState({ uid: '', name: '', nickname: '', profession: '' });

  useEffect(() => {
    loadDashboard();
    loadLastScan();
    const scanInterval = setInterval(loadLastScan, 1000);
    return () => clearInterval(scanInterval);
  }, [query]);

  async function loadDashboard() {
    try {
      const data = await api.getAdminDashboard(query);
      setUsers(data.users || []);
      setLoading(false);
    } catch (error) {
      if (error.message.includes('Unauthorized')) {
        navigate('/admin/login');
      }
      console.error('Failed to load dashboard:', error);
    }
  }

  async function loadLastScan() {
    try {
      const data = await api.getLastScan();
      setLastScan(data);
      
      if (data.uid) {
        if (data.user) {
          // User exists - show transaction form
          setTxForm({
            uid: data.uid,
            user_label: `ID ${data.user.id} · ${data.user.name}`,
            amount: ''
          });
          setRegForm({ uid: '', name: '', nickname: '', profession: '' });
        } else {
          // No user - show registration form
          setRegForm({
            uid: data.uid,
            name: '',
            nickname: '',
            profession: ''
          });
          setTxForm({ uid: '', user_label: '', amount: '' });
        }
      }
    } catch (error) {
      console.error('Failed to load last scan:', error);
    }
  }

  async function handleQuickAddTx(e) {
    e.preventDefault();
    try {
      const result = await api.adminQuickAddTx(txForm);
      setMessage(result.message);
      setMessageOk(true);
      setTxForm(prev => ({ ...prev, amount: '' }));
      loadDashboard();
    } catch (error) {
      setMessage(error.message);
      setMessageOk(false);
    }
  }

  async function handleQuickRegister(e) {
    e.preventDefault();
    try {
      const result = await api.adminQuickRegister(regForm);
      setMessage(result.message);
      setMessageOk(true);
      setRegForm({ uid: regForm.uid, name: '', nickname: '', profession: '' });
      loadDashboard();
      loadLastScan();
    } catch (error) {
      setMessage(error.message);
      setMessageOk(false);
    }
  }

  async function handleDeleteUser(userId) {
    if (!confirm('Устгах уу?')) return;
    try {
      const result = await api.adminDeleteUser(userId);
      setMessage(result.message);
      setMessageOk(true);
      loadDashboard();
    } catch (error) {
      setMessage(error.message);
      setMessageOk(false);
    }
  }

  async function handleLogout() {
    await api.adminLogout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <div><strong>Admin · Mazaalai Conservation</strong></div>
        <div className="nav">
          <a href="/admin">Dashboard</a>
          <button onClick={handleLogout} className="btn-link">Logout</button>
        </div>
      </header>

      <div className="grid">
        <div className="admin-card">
          <h3>Live scan</h3>
          <p>Сүүлд ирсэн UID: <b>{lastScan?.uid || '—'}</b>
            <span className="muted">
              {lastScan?.user ? ' (бүртгэлтэй)' : lastScan?.uid ? ' (бүртгэлгүй)' : ''}
            </span>
          </p>
          {lastScan?.user && (
            <p className="muted">
              ID {lastScan.user.id} · {lastScan.user.name}{lastScan.user.nickname ? ` (${lastScan.user.nickname})` : ''}
            </p>
          )}
          <p className="muted">Сүүлд уншсан UID-аар доорх Action хэсэг автоматаар солигдоно.</p>
        </div>

        <div className="admin-card">
          <h3>Action</h3>
          {txForm.uid && (
            <form id="formAddTx" onSubmit={handleQuickAddTx}>
              <input type="hidden" name="uid" value={txForm.uid} />
              <div className="row">
                <input
                  name="user_label"
                  value={txForm.user_label}
                  readOnly
                  style={{ flex: 1 }}
                />
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Дүн (₮)"
                  value={txForm.amount}
                  onChange={(e) => setTxForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  style={{ width: '120px' }}
                />
              </div>
              <button type="submit">Дүн нэмэх</button>
            </form>
          )}

          {regForm.uid && (
            <form id="formQuickReg" onSubmit={handleQuickRegister}>
              <input type="hidden" name="uid" value={regForm.uid} />
              <div className="row">
                <input
                  name="name"
                  placeholder="Нэр"
                  value={regForm.name}
                  onChange={(e) => setRegForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{ flex: 1 }}
                />
                <input
                  name="nickname"
                  placeholder="Хоч"
                  value={regForm.nickname}
                  onChange={(e) => setRegForm(prev => ({ ...prev, nickname: e.target.value }))}
                />
                <input
                  name="profession"
                  placeholder="Мэргэжил"
                  value={regForm.profession}
                  onChange={(e) => setRegForm(prev => ({ ...prev, profession: e.target.value }))}
                />
              </div>
              <button type="submit">Бүртгээд холбох</button>
            </form>
          )}

          {message && (
            <p className={messageOk ? "ok" : "err"}>{message}</p>
          )}
        </div>

        <div className="admin-card">
          <h3>Хэрэглэгчид</h3>
          <form onSubmit={(e) => { e.preventDefault(); loadDashboard(); }}>
            <div className="row">
              <input
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Нэр/хоч/UID/мэргэжил"
                style={{ flex: 1 }}
              />
              <button type="submit">Хайх</button>
            </div>
          </form>
          <table>
            <thead>
              <tr><th>ID</th><th>Нэр</th><th>Хоч</th><th>UID</th><th>Нийт</th><th></th></tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.nickname || ''}</td>
                    <td>{u.uid || '-'}</td>
                    <td>{u.total ? u.total.toLocaleString("en-US") : '0'}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">Одоогоор хэрэглэгч алга.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;

