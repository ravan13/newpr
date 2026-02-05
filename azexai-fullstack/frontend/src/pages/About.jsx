import React from 'react';
import { Shield, Server, Globe, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="content-wrapper" style={{ padding: '80px 40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Revolutionizing Index Intelligence</h1>
        <p style={{ fontSize: '20px', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
          AzexAI combines proprietary algorithms with real-time market data to provide institutional-grade analytics for the next generation of investors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', marginBottom: '100px' }}>
        <div>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Our Mission</h2>
          <p style={{ color: '#ccc', lineHeight: '1.8', marginBottom: '20px' }}>
            We believe that high-quality market intelligence should not be the exclusive domain of large institutions. Our mission is to democratize access to advanced financial modeling and risk assessment tools.
          </p>
          <p style={{ color: '#ccc', lineHeight: '1.8' }}>
            By leveraging cutting-edge machine learning and vast datasets, we create indices that reveal hidden market dynamics and opportunities.
          </p>
        </div>
        <div className="card" style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>500TB+</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Data Processed</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>50ms</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Latency</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>99.9%</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Uptime</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00ff88' }}>24/7</div>
              <div style={{ fontSize: '14px', color: '#888' }}>Monitoring</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '80px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center' }}>Core Technology</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Shield size={40} color="#00ff88" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>Secure Infrastructure</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Enterprise-grade encryption and security protocols protecting all data streams.</p>
          </div>
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Server size={40} color="#00ff88" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>Distributed Computing</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Scalable cloud architecture handling millions of calculations per second.</p>
          </div>
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Globe size={40} color="#00ff88" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>Global Coverage</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Data ingestion from 50+ global exchanges and alternate data sources.</p>
          </div>
          <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
            <Users size={40} color="#00ff88" style={{ marginBottom: '20px' }} />
            <h3 style={{ marginBottom: '10px' }}>Community Driven</h3>
            <p style={{ color: '#888', fontSize: '14px' }}>Feedback loops from top analysts integration into our weighting algorithms.</p>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ marginBottom: '20px' }}>Ready to explore?</h2>
        <p style={{ color: '#888', marginBottom: '30px' }}>Join thousands of analysts using AzexAI today.</p>
        <button style={{ padding: '12px 30px', background: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default About;