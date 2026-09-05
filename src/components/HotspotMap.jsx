import React, { useState } from 'react';
import { MapPin, Navigation, Layers, Flame, Info } from 'lucide-react';
import { CPCB_AQI_BANDS } from '../services/api';

export default function HotspotMap({ hotspotData }) {
  const [filter, setFilter] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showWindVector, setShowWindVector] = useState(true);

  const hotspots = hotspotData?.hotspots || [];
  const cities = hotspotData?.cities || [];

  // Coordinate projection bounds for Punjab-Haryana-Delhi Corridor
  const minLat = 28.2; // South Delhi / Mewat
  const maxLat = 32.2; // North Punjab
  const minLng = 74.2; // West Punjab
  const maxLng = 77.8; // East Delhi / UP Border

  const mapWidth = 560;
  const mapHeight = 290;
  const padX = 35;
  const padY = 25;

  const projectCoords = (lat, lng) => {
    const x = padX + ((lng - minLng) / (maxLng - minLng)) * (mapWidth - padX * 2);
    const y = padY + ((maxLat - lat) / (maxLat - minLat)) * (mapHeight - padY * 2);
    return { x, y };
  };

  const filteredHotspots = hotspots.filter(h => {
    if (filter === 'high') return h.intensity === 'high';
    if (filter === 'punjab') return h.state === 'Punjab';
    if (filter === 'haryana') return h.state === 'Haryana';
    return true;
  });

  const getIntensityColor = (intensity) => {
    if (intensity === 'high') return CPCB_AQI_BANDS.POOR.color; // #f33734
    if (intensity === 'medium') return CPCB_AQI_BANDS.MODERATE.color; // #f29c33
    return CPCB_AQI_BANDS.SATISFACTORY.color; // #fff833
  };

  const getIntensityRadius = (intensity) => {
    if (intensity === 'high') return 8;
    if (intensity === 'medium') return 6;
    return 4.5;
  };

  const handleMouseEnter = (item, type, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.closest('.map-container').getBoundingClientRect();
    setHoveredItem({ ...item, itemType: type });
    setTooltipPos({
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // State region boundary shapes (approximate schematic outlines)
  const punjabPoly = "M 50,40 L 220,35 L 290,90 L 260,165 L 170,180 L 70,160 Z";
  const haryanaPoly = "M 260,140 L 390,130 L 460,220 L 380,260 L 270,220 L 260,165 Z";
  const ncrPoly = "M 440,215 L 485,210 L 495,245 L 450,250 Z";

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-title">
            <Flame size={16} color="#f33734" />
            Agricultural Hotspot & Transport Corridor
          </span>
        </div>

        <div className="panel-controls">
          <button 
            className={`control-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({hotspots.length})
          </button>
          <button 
            className={`control-pill ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High FRP
          </button>
          <button 
            className={`control-pill ${filter === 'punjab' ? 'active' : ''}`}
            onClick={() => setFilter('punjab')}
          >
            Punjab
          </button>
          <button 
            className={`control-pill ${filter === 'haryana' ? 'active' : ''}`}
            onClick={() => setFilter('haryana')}
          >
            Haryana
          </button>
        </div>
      </div>

      <div className="panel-body">
        <div className="map-container">
          <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="map-svg">
            <defs>
              {/* Wind Vector Plume Gradient */}
              <linearGradient id="windPlumeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f33734" stopOpacity="0.25" />
                <stop offset="60%" stopColor="#a070b6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7e0424" stopOpacity="0.35" />
              </linearGradient>

              {/* Marker Filters */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
              </filter>
            </defs>

            {/* Schematic Provincial Regions */}
            <g className="map-regions" stroke="#e2e8f0" strokeWidth="1.2" fill="#f8fafc">
              <path d={punjabPoly} fill="#f1f5f9" opacity="0.6" strokeDasharray="3 2" />
              <path d={haryanaPoly} fill="#f8fafc" opacity="0.6" strokeDasharray="3 2" />
              <path d={ncrPoly} fill="#fef2f2" stroke="#fecaca" strokeWidth="1.5" />
            </g>

            {/* Region Labels */}
            <text x="140" y="85" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="0.08em">PUNJAB</text>
            <text x="320" y="195" fill="#94a3b8" fontSize="13" fontWeight="700" letterSpacing="0.08em">HARYANA</text>
            <text x="445" y="270" fill="#64748b" fontSize="11" fontWeight="700">DELHI-NCR</text>

            {/* Downwind Plume Transport Corridor Vector (NW -> SE) */}
            {showWindVector && (
              <g className="wind-corridor" opacity="0.9">
                {/* Broad smoke plume path */}
                <path 
                  d="M 160,80 Q 300,160 460,230" 
                  fill="none" 
                  stroke="url(#windPlumeGrad)" 
                  strokeWidth="48" 
                  strokeLinecap="round" 
                />
                
                {/* Transport vector dashed trajectory lines */}
                <path 
                  d="M 140,70 Q 280,150 450,225" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="2" 
                  strokeDasharray="6 4" 
                  opacity="0.8"
                />
                <path 
                  d="M 180,95 Q 310,175 460,235" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="2" 
                  strokeDasharray="6 4" 
                  opacity="0.8"
                />
                
                {/* Wind direction indicator arrow */}
                <g transform="translate(300, 160) rotate(28)">
                  <polygon points="0,-7 14,0 0,7 3,0" fill="#0284c7" />
                  <text x="-25" y="-12" fill="#0369a1" fontSize="10" fontWeight="600">NW Flow 18 km/h</text>
                </g>
              </g>
            )}

            {/* City Nodes & Risk Anchors */}
            {cities.map((city, idx) => {
              const { x, y } = projectCoords(city.lat, city.lng);
              const isDelhi = city.name.includes('Delhi');
              return (
                <g 
                  key={`city-${idx}`} 
                  transform={`translate(${x}, ${y})`}
                  onMouseEnter={(e) => handleMouseEnter(city, 'city', e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'pointer' }}
                >
                  {isDelhi ? (
                    // Delhi Target Zone
                    <g>
                      <circle r="16" fill="#7e0424" fillOpacity="0.15" />
                      <circle r="9" fill="#a070b6" stroke="#ffffff" strokeWidth="2" filter="url(#glow)" />
                      <circle r="3.5" fill="#ffffff" />
                      <rect x="12" y="-9" width="68" height="18" rx="3" fill="#0f172a" opacity="0.9" />
                      <text x="16" y="4" fill="#ffffff" fontSize="10" fontWeight="700">Delhi-NCR</text>
                    </g>
                  ) : (
                    // Regional Hub
                    <g>
                      <circle r="4.5" fill="#475569" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="7" y="3.5" fill="#475569" fontSize="9.5" fontWeight="500">{city.name}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Fire Hotspot Thermal Markers */}
            {filteredHotspots.map((spot) => {
              const { x, y } = projectCoords(spot.lat, spot.lng);
              const color = getIntensityColor(spot.intensity);
              const radius = getIntensityRadius(spot.intensity);

              return (
                <g 
                  key={spot.id} 
                  transform={`translate(${x}, ${y})`}
                  onMouseEnter={(e) => handleMouseEnter(spot, 'hotspot', e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Subtle outer pulse aura for high intensity */}
                  {spot.intensity === 'high' && (
                    <circle r={radius + 4} fill={color} fillOpacity="0.25" />
                  )}
                  <circle 
                    r={radius} 
                    fill={color} 
                    stroke="#ffffff" 
                    strokeWidth="1.5"
                    filter="url(#glow)"
                  />
                  {spot.intensity === 'high' && (
                    <circle r="2" fill="#ffffff" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip */}
          {hoveredItem && (
            <div 
              className="map-tooltip"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              {hoveredItem.itemType === 'hotspot' ? (
                <div>
                  <strong>{hoveredItem.district} ({hoveredItem.state})</strong>
                  <div style={{ color: '#cbd5e1', marginTop: '2px' }}>
                    Intensity: <span style={{ color: getIntensityColor(hoveredItem.intensity), fontWeight: 700 }}>{hoveredItem.intensity.toUpperCase()}</span> · FRP: {hoveredItem.frp} MW
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                    Coords: {hoveredItem.lat.toFixed(2)}°N, {hoveredItem.lng.toFixed(2)}°E
                  </div>
                </div>
              ) : (
                <div>
                  <strong>{hoveredItem.name}</strong>
                  <div style={{ color: '#cbd5e1', marginTop: '2px' }}>
                    Role: {hoveredItem.role}
                  </div>
                  <div style={{ color: '#fca5a5', fontWeight: 600 }}>
                    Station AQI: {hoveredItem.aqi}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend Strip */}
        <div className="map-legend-strip">
          <div className="legend-items">
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>VIIRS Thermal FRP:</span>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: CPCB_AQI_BANDS.POOR.color }}></span>
              <span>High (&gt;75 MW)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: CPCB_AQI_BANDS.MODERATE.color }}></span>
              <span>Medium (40-75 MW)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: CPCB_AQI_BANDS.SATISFACTORY.color, border: '1px solid #ca8a04' }}></span>
              <span>Low (&lt;40 MW)</span>
            </div>
          </div>

          <div className="wind-vector-badge">
            <Navigation size={12} style={{ transform: 'rotate(135deg)' }} />
            <span>Downwind Plume: NW → SE (18 km/h)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
