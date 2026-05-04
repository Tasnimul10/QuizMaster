import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalQuizzes: 0, totalAttempts: 0, platformEarnings: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [quizzesRes, resultsRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5001/api/quizzes', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('http://localhost:5001/api/results/all', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get('http://localhost:5001/api/auth/users', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        ]);
        
        const quizzes = quizzesRes.data;
        const results = resultsRes.data;
        const fetchedUsers = usersRes.data;

        setUsers(fetchedUsers);

        let estimatedEarnings = 0;
        
        setStats({
          totalUsers: fetchedUsers.length,
          totalQuizzes: quizzes.length,
          totalAttempts: results.length,
          platformEarnings: estimatedEarnings
        });
      } catch (err) {
        console.error("Error fetching admin data. (Did you restart the backend?):", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="container text-center mt-2">Loading...</div>;

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">QuizMaster Admin</div>
        <div className="nav-links">
          <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container mt-2">
        <h2 className="mb-2 text-center">Platform Overview</h2>

        <div className="grid mb-2">
          <div className="glass-card text-center">
            <h3 style={{ color: 'var(--text-muted)' }}>Total Users</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalUsers}</div>
          </div>
          <div className="glass-card text-center">
            <h3 style={{ color: 'var(--text-muted)' }}>Total Quizzes</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.totalQuizzes}</div>
          </div>
          <div className="glass-card text-center">
            <h3 style={{ color: 'var(--text-muted)' }}>Total Attempts</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{stats.totalAttempts}</div>
          </div>
        </div>

        <h2 className="mt-2 mb-1">Teachers Directory</h2>
        <div className="grid mb-2">
          {teachers.map(t => (
            <div key={t._id} className="glass-card">
              <h3 style={{ color: 'var(--success)' }}>{t.name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t.email}</p>
              <div className="flex justify-between items-center">
                <span>Wallet Balance:</span>
                <strong style={{ color: 'var(--success)' }}>${t.walletBalance || 0}</strong>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Joined: {new Date(t.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {teachers.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No teachers registered yet.</p>}
        </div>

        <h2 className="mt-2 mb-1">Students Directory</h2>
        <div className="grid">
          {students.map(s => (
            <div key={s._id} className="glass-card">
              <h3 style={{ color: 'var(--primary-color)' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-muted)' }}>{s.email}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Joined: {new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
          {students.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No students registered yet.</p>}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
