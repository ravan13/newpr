import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="content-wrapper" style={{ padding: '80px', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h3>Login</h3>
        {error && <div style={{ color: '#ff4444', marginBottom: '15px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#222', border: '1px solid #333', color: '#fff' }} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '20px', background: '#222', border: '1px solid #333', color: '#fff' }} 
            required
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#00ff88', border: 'none', borderRadius: '4px', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
        <p style={{ marginTop: '15px', fontSize: '14px', color: '#888', textAlign: 'center' }}>
          Test Account: test@azexai.com / password123
        </p>
      </div>
    </div>
  );
};

export default Login;
