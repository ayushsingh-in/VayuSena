import React, { useState } from 'react';
import { Bell, Zap, CheckCircle, Clock, Send, ShieldAlert } from 'lucide-react';
import { getSeverityBand } from '../services/api';
import CustomAlertModal from './CustomAlertModal';

export default function AlertsFeed({ alerts, onSimulateAlert, onRefresh }) {
  const [isCustomModalOpen, setCustomModalOpen] = useState(false);
  const getBadgeClass = (severity) => {
    const s = (severity || '').toLowerCase().replace(/[^a-z]/g, '');
    if (s.includes('severe')) return 'badge-severe';
    if (s.includes('verypoor')) return 'badge-verypoor';
    if (s.includes('poor')) return 'badge-poor';
    if (s.includes('mod')) return 'badge-moderate';
    if (s.includes('satis')) return 'badge-satisfactory';
    return 'badge-good';
  };

  const getStatusBadge = (status) => {
    const st = (status || '').toLowerCase();
    if (st.includes('active')) {
      return (
        <span className="status-badge-active">
          <ShieldAlert size={11} /> Active
        </span>
      );
    }
    if (st.includes('dispatch')) {
      return (
        <span className="status-badge-dispatched">
          <Send size={11} /> Dispatched
        </span>
      );
    }
    if (st.includes('resolve')) {
      return (
        <span className="status-badge-resolved">
          <CheckCircle size={11} /> Resolved
        </span>
      );
    }
    return (
      <span className="status-badge-ack">
        <Clock size={11} /> {status}
      </span>
    );
  };

  return (
    <section className="alerts-section">
      <div className="alerts-header">
        <div className="alerts-title-group">
          <span className="alerts-title">
            <Bell size={16} color="#0f172a" />
            Active Stubble Plume & Inter-State Alerts Feed
          </span>
          <span className="count-pill">{alerts.length} Records</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn-simulate"
            style={{ backgroundColor: '#0ea5e9' }}
            onClick={() => setCustomModalOpen(true)}
            title="Broadcast a custom alert to a specific area"
          >
            <Send size={13} fill="#ffffff" />
            <span>Broadcast Alert</span>
          </button>
          <button 
            className="btn-simulate"
            onClick={onSimulateAlert}
            title="Simulate incoming satellite fire trigger & downwind alert"
          >
            <Zap size={13} fill="#ffffff" />
            <span>Simulate Alert</span>
          </button>
        </div>
      </div>

      <CustomAlertModal 
        isOpen={isCustomModalOpen} 
        onClose={() => setCustomModalOpen(false)} 
        onSuccess={onRefresh}
      />

      <div className="table-responsive">
        <table className="alerts-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Timestamp</th>
              <th>Impact District / Receptor Corridor</th>
              <th style={{ width: '130px' }}>Predicted AQI</th>
              <th style={{ width: '130px' }}>Severity Band</th>
              <th style={{ width: '120px' }}>Action Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((item) => {
              const bandClass = getBadgeClass(item.severity);
              return (
                <tr key={item.id} className={item.isNew ? 'alert-row-new' : ''}>
                  <td style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
                    {item.date}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.district}
                    </div>
                    {item.recommendation && (
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Advisory: {item.recommendation}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '13.5px' }}>
                    {item.predictedAqi}
                  </td>
                  <td>
                    <span className={`aqi-badge ${bandClass}`}>
                      <span className="badge-dot"></span>
                      {item.severity}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(item.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
