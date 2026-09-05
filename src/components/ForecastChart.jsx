import React, { useState } from 'react';
import { TrendingUp, Activity, HelpCircle } from 'lucide-react';
import { CPCB_AQI_BANDS, getAqiBand } from '../services/api';

export default function ForecastChart({ forecastData }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const actualData = forecastData?.actual || [];
  const predictedData = forecastData?.predicted || [];

  // Chart dimensions & scaling
  const width = 560;
  const height = 290;
  const margin = { top: 25, right: 30, bottom: 40, left: 45 };

  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  // Max AQI on Y axis
  const minY = 100;
  const maxY = 500;

  // Combine points for timeline
  // Actual has 7 points, Predicted extends from the last actual point + 3 future points
  const totalDays = actualData.length + predictedData.length - 1;

  const getY = (val) => {
    return margin.top + plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;
  };

  const getX = (index) => {
    return margin.left + (index / (totalDays - 1)) * plotWidth;
  };

  // Build Actual Line Path
  const actualPoints = actualData.map((d, i) => ({
    ...d,
    index: i,
    x: getX(i),
    y: getY(d.aqi),
    isPredicted: false
  }));

  const actualPath = actualPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`),
    ''
  );

  // Build Predicted Line Path (starts at last actual point)
  const actualLastIndex = actualData.length - 1;
  const predictedPoints = predictedData.map((d, i) => {
    const combinedIndex = actualLastIndex + i;
    const yVal = getY(d.aqi);
    const yLower = getY(d.ciLower || d.aqi - 20);
    const yUpper = getY(d.ciUpper || d.aqi + 20);
    return {
      ...d,
      index: combinedIndex,
      x: getX(combinedIndex),
      y: yVal,
      yLower,
      yUpper,
      isPredicted: true
    };
  });

  const predictedPath = predictedPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`),
    ''
  );

  // Confidence Interval Area Polygon
  const ciAreaPath = [
    ...predictedPoints.map((p, i) => (i === 0 ? `M ${p.x},${p.yLower}` : `L ${p.x},${p.yLower}`)),
    ...[...predictedPoints].reverse().map(p => `L ${p.x},${p.yUpper}`),
    'Z'
  ].join(' ');

  // All interactive points
  const allPoints = [
    ...actualPoints.slice(0, -1),
    ...predictedPoints
  ];

  const handleMouseEnter = (p, e) => {
    const parentRect = e.currentTarget.closest('.chart-container').getBoundingClientRect();
    setHoveredPoint(p);
    setTooltipPos({
      x: (p.x / width) * parentRect.width,
      y: (p.y / height) * parentRect.height
    });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  // CPCB Standard Threshold lines
  const thresholds = [
    { value: 200, label: 'Moderate / Poor (200)', color: CPCB_AQI_BANDS.MODERATE.color },
    { value: 300, label: 'Poor / Very Poor (300)', color: CPCB_AQI_BANDS.POOR.color },
    { value: 400, label: 'Very Poor / Severe (400)', color: CPCB_AQI_BANDS.VERY_POOR.color }
  ];

  return (
    <div className="dashboard-panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="panel-title">
            <TrendingUp size={16} color="#0f172a" />
            72h Delhi-NCR AQI Forecast Trajectory
          </span>
        </div>

        <div className="panel-controls">
          <span className="aqi-badge badge-confidence">
            R² 0.86 (High Fit)
          </span>
        </div>
      </div>

      <div className="panel-body">
        <div className="chart-container">
          <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
            <defs>
              <linearGradient id="actualAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a070b6" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#a070b6" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* CPCB Threshold Reference Lines */}
            {thresholds.map((th) => {
              const y = getY(th.value);
              return (
                <g key={`th-${th.value}`}>
                  <line 
                    x1={margin.left} 
                    y1={y} 
                    x2={width - margin.right} 
                    y2={y} 
                    stroke={th.color} 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                    opacity="0.65"
                  />
                  <text 
                    x={width - margin.right + 4} 
                    y={y + 3} 
                    fill={th.color} 
                    fontSize="9.5" 
                    fontWeight="600"
                  >
                    {th.value}
                  </text>
                </g>
              );
            })}

            {/* Y Axis Grid & Labels */}
            {[100, 200, 300, 400, 500].map((val) => {
              const y = getY(val);
              return (
                <g key={`y-${val}`}>
                  <line 
                    x1={margin.left} 
                    y1={y} 
                    x2={width - margin.right} 
                    y2={y} 
                    stroke="#f1f5f9" 
                    strokeWidth="1" 
                  />
                  <text 
                    x={margin.left - 8} 
                    y={y + 3.5} 
                    fill="#94a3b8" 
                    fontSize="10" 
                    textAnchor="end"
                    fontWeight="500"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Forecast Confidence Interval Area */}
            <path d={ciAreaPath} fill="rgba(160, 112, 182, 0.12)" />

            {/* Vertical Separator for Today */}
            <line 
              x1={getX(actualLastIndex)} 
              y1={margin.top} 
              x2={getX(actualLastIndex)} 
              y2={height - margin.bottom} 
              stroke="#94a3b8" 
              strokeWidth="1.2" 
              strokeDasharray="3 3"
            />
            <text 
              x={getX(actualLastIndex)} 
              y={margin.top - 6} 
              fill="#0f172a" 
              fontSize="9.5" 
              textAnchor="middle" 
              fontWeight="700"
            >
              Today
            </text>

            {/* Actual Observed Line */}
            <path 
              d={actualPath} 
              fill="none" 
              stroke="#0f172a" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />

            {/* Predicted Forecast Line (Dashed) */}
            <path 
              d={predictedPath} 
              fill="none" 
              stroke="#a070b6" 
              strokeWidth="2.5" 
              strokeDasharray="6 5" 
              strokeLinecap="round"
            />

            {/* Active Hover Crosshair Line */}
            {hoveredPoint && (
              <line 
                x1={hoveredPoint.x} 
                y1={margin.top} 
                x2={hoveredPoint.x} 
                y2={height - margin.bottom} 
                stroke="#64748b" 
                strokeWidth="1" 
                strokeDasharray="2 2"
              />
            )}

            {/* Data Points */}
            {allPoints.map((p, i) => {
              const band = getAqiBand(p.aqi);
              const isHovered = hoveredPoint && hoveredPoint.index === p.index;

              return (
                <g 
                  key={`point-${i}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => handleMouseEnter(p, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Outer circle ring */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={isHovered ? 7 : (p.isPredicted ? 5 : 4)} 
                    fill="#ffffff" 
                    stroke={p.isPredicted ? '#a070b6' : '#0f172a'} 
                    strokeWidth="2" 
                  />
                  {/* Inner color dot according to CPCB band */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={isHovered ? 4 : 2.5} 
                    fill={band.color} 
                  />
                </g>
              );
            })}

            {/* X-Axis Date Labels */}
            {allPoints.map((p, i) => {
              return (
                <text 
                  key={`label-${i}`} 
                  x={p.x} 
                  y={height - margin.bottom + 16} 
                  fill={p.isPredicted ? '#7e22ce' : '#64748b'} 
                  fontSize="9.5" 
                  textAnchor="middle"
                  fontWeight={p.displayDate === 'Today' ? '700' : '500'}
                >
                  {p.displayDate}
                </text>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredPoint && (
            <div 
              className="chart-tooltip-box"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
            >
              <div className="chart-tooltip-title">
                {hoveredPoint.displayDate} ({hoveredPoint.date})
              </div>
              <div className="chart-tooltip-row">
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ fontWeight: 600, color: hoveredPoint.isPredicted ? '#7e22ce' : '#0f172a' }}>
                  {hoveredPoint.isPredicted ? '72h ML Forecast' : 'CPCB Actual'}
                </span>
              </div>
              <div className="chart-tooltip-row">
                <span style={{ color: 'var(--text-muted)' }}>Predicted AQI:</span>
                <span className={`aqi-badge ${hoveredPoint.aqi >= 400 ? 'badge-severe' : hoveredPoint.aqi >= 300 ? 'badge-verypoor' : 'badge-poor'}`}>
                  {hoveredPoint.aqi} · {hoveredPoint.category}
                </span>
              </div>
              {hoveredPoint.isPredicted && hoveredPoint.ciLower && (
                <div className="chart-tooltip-row">
                  <span style={{ color: 'var(--text-muted)' }}>95% Range:</span>
                  <span style={{ fontWeight: 600 }}>{hoveredPoint.ciLower} - {hoveredPoint.ciUpper}</span>
                </div>
              )}
              {hoveredPoint.pm25 && (
                <div className="chart-tooltip-row">
                  <span style={{ color: 'var(--text-muted)' }}>Est. PM2.5:</span>
                  <span style={{ fontWeight: 600 }}>{hoveredPoint.pm25} µg/m³</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend Strip */}
        <div className="chart-legend-strip">
          <div className="chart-legend-group">
            <div className="chart-legend-item">
              <span className="legend-line-actual"></span>
              <span>Observed AQI (Past 7d)</span>
            </div>
            <div className="chart-legend-item">
              <span className="legend-line-pred"></span>
              <span>Predicted AQI (Next 3d)</span>
            </div>
            <div className="chart-legend-item">
              <span className="legend-band-swatch"></span>
              <span>95% Confidence Band</span>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Lead Time: <strong>72 Hours</strong> · Mean Error: <strong>±14 AQI</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
