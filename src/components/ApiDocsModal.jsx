import React, { useState } from 'react';
import { X, Code2, ExternalLink, Copy, Check } from 'lucide-react';
import { 
  initialMockStats, 
  initialMockHotspots, 
  initialMockForecast, 
  initialMockAlerts 
} from '../services/api';

export default function ApiDocsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpoints = [
    {
      id: 'stats',
      path: 'GET /api/stats',
      description: 'Returns real-time AQI metrics, regional hotspot totals, and R² model confidence.',
      data: initialMockStats
    },
    {
      id: 'hotspots',
      path: 'GET /api/hotspots',
      description: 'Returns active VIIRS farm fire thermal hotspots, receptor cities, and meteorological wind vectors.',
      data: {
        hotspots: initialMockHotspots.hotspots.slice(0, 3),
        cities: initialMockHotspots.cities.slice(0, 2),
        wind: initialMockHotspots.wind
      }
    },
    {
      id: 'forecast',
      path: 'GET /api/forecast',
      description: 'Returns 72-hour spatiotemporal AQI forecast trajectory, 95% confidence intervals, and model metadata.',
      data: {
        actual: initialMockForecast.actual.slice(-2),
        predicted: initialMockForecast.predicted.slice(0, 2),
        modelMeta: initialMockForecast.modelMeta
      }
    },
    {
      id: 'alerts',
      path: 'GET /api/alerts',
      description: 'Returns prioritized list of downstream stubble plume advisories and enforcement dispatch states.',
      data: {
        alerts: initialMockAlerts.slice(0, 2)
      }
    }
  ];

  const currentEndpoint = endpoints.find(e => e.id === activeTab);
  const jsonString = JSON.stringify(currentEndpoint.data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Code2 size={18} color="#0284c7" />
            VayuSena Open API Specification (FastAPI / OpenAPI 3.1)
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            VayuSena provides standardized, low-latency REST endpoints for inter-state pollution control boards (CPCB, DPCC, PPCB, HSPCB) to consume live forecasts and trigger automated early warnings.
          </p>

          <div className="endpoint-tabs">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                className={`endpoint-tab ${activeTab === ep.id ? 'active' : ''}`}
                onClick={() => setActiveTab(ep.id)}
              >
                {ep.path}
              </button>
            ))}
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {currentEndpoint.description}
              </span>
              <button 
                onClick={handleCopy}
                style={{ 
                  background: 'none', 
                  border: '1px solid var(--border-color)', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--text-secondary)'
                }}
              >
                {copied ? <Check size={12} color="#166534" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>

            <pre className="code-preview-box">
              <code>{jsonString}</code>
            </pre>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Base Route: <code>http://localhost:8000/api</code>
            </span>
            <a 
              href="http://localhost:8000/docs" 
              target="_blank" 
              rel="noreferrer"
              className="btn-simulate"
              style={{ textDecoration: 'none', padding: '6px 12px' }}
            >
              <span>Launch Swagger UI (/docs)</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
