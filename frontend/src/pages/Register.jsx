import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  
  const selectedRole = location.state?.selectedRole || 'student';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData.name, formData.email, formData.password, selectedRole);
      navigate('/login');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="container flex items-center justify-between" style={{ minHeight: '80vh', justifyContent: 'center' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-2">Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account</h2>
        {error && <div className="badge badge-paid text-center mb-1" style={{ display: 'block' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input"
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input"
              required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input"
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>
        <p className="text-center mt-1" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <span style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;