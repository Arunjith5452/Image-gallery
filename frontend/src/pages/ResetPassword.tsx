import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, phone, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card">
        <h2>Reset Password</h2>
        <p>Enter your details to create a new password</p>
        
        {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>Password reset successfully! Redirecting...</div>}
        
        {!success && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-control" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary">Reset Password</button>
          </form>
        )}
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <p>Remembered your password? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
