import React from 'react';
import StatCard from './StatCard';
import { Gauge, Flame, AlertTriangle, Binary } from 'lucide-react';
import { getSeverityBand } from '../services/api';

export default function StatStrip({ stats }) {
  const aqiCategory = stats?.aqiCategory || 'Very Poor';
  
  // Map category to CSS class
  const getBadgeClass = (category) => {
    const cat = (category || '').toLowerCase().replace(/[^a-z]/g, '');
    if (cat.includes('severe')) return 'badge-severe';
    if (cat.includes('verypoor')) return 'badge-verypoor';
    if (cat.includes('poor')) return 'badge-poor';
    if (cat.includes('mod')) return 'badge-moderate';
    if (cat.includes('satis')) return 'badge-satisfactory';
    return 'badge-good';
  };

  return (
    <div className="stat-strip">
      {/* 1. Current Delhi-NCR AQI */}
      <StatCard
        label="Delhi-NCR AQI"
        value={stats?.currentAqi || 301}
        badgeText={`${stats?.currentAqi || 301} · ${aqiCategory}`}
        badgeClass={getBadgeClass(aqiCategory)}
        subtext={`Primary: ${stats?.pollutant || 'PM2.5'} (${stats?.pollutantValue || '168 µg/m³'})`}
        icon={Gauge}
      />

      {/* 2. Active Fire Hotspots */}
      <StatCard
        label="Active Farm Hotspots"
        value={stats?.activeHotspots || 187}
        badgeText="+24% vs y'day"
        badgeClass="badge-poor"
        subtext={`Punjab (${stats?.punjabHotspots || 142}) · Haryana (${stats?.haryanaHotspots || 45})`}
        icon={Flame}
      />

      {/* 3. Forecast Alert */}
      <StatCard
        label="Forecast Alert"
        value={stats?.forecastAlert || '⚠️ Spike expected in 2 days'}
        badgeText="NW Winds 18 km/h"
        badgeClass="badge-verypoor"
        subtext={stats?.windVector ? `Transit: ${stats.windVector}` : 'High stubble plume transport downwind'}
        icon={AlertTriangle}
        isTextValue={true}
      />

      {/* 4. Model Confidence */}
      <StatCard
        label="Model Confidence"
        value={`R² ${stats?.modelR2 || 0.86}`}
        badgeText="High Precision"
        badgeClass="badge-confidence"
        subtext="Ensemble: Ridge + LightGBM + Met"
        icon={Binary}
      />
    </div>
  );
}
