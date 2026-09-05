import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatStrip from './components/StatStrip';
import HotspotMap from './components/HotspotMap';
import ForecastChart from './components/ForecastChart';
import AlertsFeed from './components/AlertsFeed';
import FooterCard from './components/FooterCard';
import ApiDocsModal from './components/ApiDocsModal';
import { 
  initialMockStats, 
  initialMockHotspots, 
  initialMockForecast, 
  initialMockAlerts,
  generateSimulatedAlert,
  fetchStats,
  fetchHotspots,
  fetchForecast,
  fetchAlerts
} from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [stats, setStats] = useState(initialMockStats);
  const [hotspotData, setHotspotData] = useState(initialMockHotspots);
  const [forecastData, setForecastData] = useState(initialMockForecast);
  const [alerts, setAlerts] = useState(initialMockAlerts);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize clock and data
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();

    // Auto-refresh interval every 30 seconds for live feel
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [s, h, f, a] = await Promise.all([
        fetchStats(),
        fetchHotspots(),
        fetchForecast(),
        fetchAlerts()
      ]);
      setStats(s);
      setHotspotData(h);
      setForecastData(f);
      if (a?.alerts) setAlerts(a.alerts);
      
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('Telemetry and VIIRS satellite feed synced');
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSimulateAlert = () => {
    const newAlert = generateSimulatedAlert();
    setAlerts(prev => [newAlert, ...prev]);

    // Also update stats slightly to demonstrate live reactive linkage
    setStats(prev => ({
      ...prev,
      activeHotspots: prev.activeHotspots + 3,
      punjabHotspots: prev.punjabHotspots + 2,
      haryanaHotspots: prev.haryanaHotspots + 1,
      currentAqi: Math.min(450, prev.currentAqi + 2)
    }));

    showToast(`⚡ Live Trigger: New alert dispatched to ${newAlert.district}`);
  };

  return (
    <div className="app-container">
      {/* Section A: Header Bar */}
      <Header 
        lastUpdated={lastUpdated} 
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Section B: Stat Strip (4 Cards) */}
      <StatStrip stats={stats} />

      {/* Section C: Two-Column Main View */}
      <div className="main-two-col">
        <HotspotMap hotspotData={hotspotData} />
        <ForecastChart forecastData={forecastData} />
      </div>

      {/* Section D: Alerts Feed with Live Simulation */}
      <AlertsFeed 
        alerts={alerts} 
        onSimulateAlert={handleSimulateAlert} 
        onRefresh={handleRefresh}
      />

      {/* Section E: Footer Card */}
      <FooterCard onOpenApiDocs={() => setIsApiModalOpen(true)} />

      {/* OpenAPI Explorer Modal */}
      <ApiDocsModal 
        isOpen={isApiModalOpen} 
        onClose={() => setIsApiModalOpen(false)} 
      />

      {/* Live Toast Feedback */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={15} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
