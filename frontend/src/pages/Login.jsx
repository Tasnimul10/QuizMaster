import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin-dashboard');
      else if (user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container flex items-center justify-between" style={{ minHeight: '80vh', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-2">Welcome Back</h2>
        {error && <div className="badge badge-paid text-center mb-1" style={{ display: 'block' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p className="text-center mt-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => navigate('/')}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;