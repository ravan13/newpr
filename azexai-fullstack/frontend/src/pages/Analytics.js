import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend 
} from 'recharts';
import { Activity, TrendingUp, BarChart2, DollarSign } from 'lucide-react';

const generateRandomData = (points = 30) => {
  const data = [];
  let value = 100;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 10;
    value += change;
    data.push({
      name: `Day ${i + 1}`,
      value: parseFloat(value.toFixed(2)),
      volume: Math.floor(Math.random() * 1000) + 500,
      sentiment: Math.floor(Math.random() * 100)
    });
  }
  return data;
};

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setData(generateRandomData());
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ color: '#00ff88' }}>Loading Analytics Engine...</div>
      </div>
    );
  }

  return (
    <div className="content-wrapper" style={{ padding: '40px 80px' }}>
      <h1 style={{ marginBottom: '10px' }}>Market Analytics</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>Advanced proprietary metrics and predictive modeling.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Total Volume</span>
            <Activity size={20} color="#00ff88" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>$4.2B</div>
          <div style={{ color: '#00ff88', fontSize: '12px' }}>+12.5% vs last week</div>
        </div>
        
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Global Sentiment</span>
            <TrendingUp size={20} color="#00ff88" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Bullish</div>
          <div style={{ color: '#00ff88', fontSize: '12px' }}>78/100 Score</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Active Indices</span>
            <BarChart2 size={20} color="#00ff88" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5</div>
          <div style={{ color: '#888', fontSize: '12px' }}>All systems operational</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>Avg Return</span>
            <DollarSign size={20} color="#00ff88" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>+8.4%</div>
          <div style={{ color: '#00ff88', fontSize: '12px' }}>Year to Date</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginBottom: '40px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Performance Trend</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" hide />
                <YAxis stroke="#666" domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00ff88" fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Volume Analysis</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 10}} />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="volume" fill="#00ff88" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;