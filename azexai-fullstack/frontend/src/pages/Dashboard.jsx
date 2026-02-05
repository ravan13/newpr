import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const generateChartData = () => {
  const data = [];
  let value = 100;
  const now = new Date();
  for (let i = 0; i < 20; i++) {
    value = value + (Math.random() - 0.5) * 5;
    data.push({
      time: new Date(now.getTime() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(value.toFixed(2)),
      prediction: parseFloat((value * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
    });
  }
  return data;
};

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfile(user);
    }
    
    // Initial data
    setData(generateChartData());

    // Update data every 3 seconds
    const interval = setInterval(() => {
      setData(prev => {
        const lastValue = prev[prev.length - 1].value;
        const newValue = lastValue + (Math.random() - 0.5) * 5;
        const newPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: parseFloat(newValue.toFixed(2)),
          prediction: parseFloat((newValue * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, user]);

  if (!isAuthenticated) return null;

  return (
    <div className="content-wrapper" style={{ padding: '40px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Dashboard</h1>
        <button 
          onClick={logout}
          style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>Welcome, {profile?.fullName || 'User'}</h3>
          <p>Role: <span style={{ textTransform: 'capitalize', color: '#00ff88' }}>{profile?.role || 'User'}</span></p>
          <p>Email: {profile?.email}</p>
        </div>

        <div className="card">
          <h3>Market Status</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ff88' }}>ACTIVE</p>
          <p>System operational. Data stream live.</p>
        </div>

        <div className="card">
          <h3>Your Subscriptions</h3>
          <p>Plan: Basic Access</p>
          <p>Status: Active</p>
        </div>
      </div>
      
      <div className="card" style={{ marginTop: '20px' }}>
        <h3>Real-time Analytics</h3>
        <div style={{ height: '300px', width: '100%', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="prediction" stroke="#ff0088" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
