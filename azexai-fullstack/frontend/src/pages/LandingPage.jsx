import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LandingPage = () => {
  const [indices, setIndices] = useState([]);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/indices');
        if (response.data.success) {
          setIndices(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching indices:', error);
        // Fallback data
        setIndices([
          { name: 'IIT-S', value: 9.37 },
          { name: 'Zenith', value: 124.50 },
          { name: 'Nexus', value: 89.20 },
          { name: 'Synergy', value: 45.30 },
          { name: 'Genesis', value: 78.90 }
        ]);
      }
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content-wrapper">
      <section className="hero">
        <h1>AzexAI Index Intelligence</h1>
        <p className="hero-subtitle">Analytical index platform for scenario modeling and risk intelligence. Powered by proprietary computational frameworks.</p>
        <div className="tickers">
          {indices.map((index, i) => (
            <div key={i} className="ticker">
              {index.name || index.indexName}
              <span className="ticker-value">
                {typeof index.value === 'number' ? index.value.toFixed(2) : index.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="products">
        <h2>Products</h2>
        <div className="cards">
          <div className="card">
            <h3>Basic Index</h3>
            <p>Public analytical index access for fundamental market intelligence and risk assessment. Real-time data aggregation and synthesis.</p>
            <Link to="/dashboard">View Indices →</Link>
          </div>
          <div className="card">
            <h3>Index Plus</h3>
            <p>Deep analytics, benchmarking, scenario modeling, and advanced computational intelligence for institutional-grade decision-making.</p>
            <Link to="/register">Get Plus Access →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
