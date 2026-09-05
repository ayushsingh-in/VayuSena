import React from 'react';
import { Wind, RefreshCw, Radio } from 'lucide-react';

export default function Header({ lastUpdated, isRefreshing, onRefresh }) {
  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-icon-box" title="VayuSena Early Warning Core">
          <Wind size={20} strokeWidth={2.4} />
        </div>
        <div className="brand-title-group">
          <h1>
            VAYUSENA
            <span className="region-tag">
              <Radio size={12} strokeWidth={2.2} /> Delhi-NCR · Punjab · Haryana
            </span>
          </h1>
          <p className="brand-subtitle">
            Satellite Farm Fire Early Warning & Atmospheric Plume Dispersion Dashboard
          </p>
        </div>
      </div>

      <div className="header-right">
        <div className="live-indicator" title="Connected to VIIRS & CPCB Telemetry Stream">
          <span className="pulse-dot"></span>
          <span>Live Stream</span>
        </div>

        <span className="timestamp-text">
          Updated: {lastUpdated || 'Just now'}
        </span>

        <button 
          className="refresh-btn" 
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Fetch latest satellite & sensor feed"
        >
          <RefreshCw size={12} className={isRefreshing ? 'spin-icon' : ''} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
        </button>
      </div>
    </header>
  );
}
