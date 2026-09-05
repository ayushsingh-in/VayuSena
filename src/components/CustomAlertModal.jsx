import React, { useState } from 'react';
import { ShieldAlert, X, Send } from 'lucide-react';
import { broadcastCustomAlert } from '../services/api';

export default function CustomAlertModal({ isOpen, onClose, onSuccess }) {
  const [district, setDistrict] = useState('');
  const [severity, setSeverity] = useState('Severe');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!district || !message) return;
    
    setLoading(true);
    try {
      await broadcastCustomAlert({
        district,
        severity,
        message
      });
      onSuccess();
      onClose();
      setDistrict('');
      setMessage('');
      setSeverity('Severe');
    } catch (err) {
      alert("Failed to broadcast alert. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={overlayStyle}>
      <div className="modal-content" style={contentStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            <ShieldAlert size={18} color="#e11d48" /> Broadcast Custom Alert
          </h3>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Target District / Area</label>
            <input 
              type="text" 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Delhi-NCR, Amritsar, Karnal Highway"
              style={inputStyle}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Severity Band</label>
            <select 
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              style={inputStyle}
            >
              <option value="Severe">Severe (AQI 400+ or Critical Fire)</option>
              <option value="Very Poor">Very Poor (AQI 301-400)</option>
              <option value="Poor">Poor (AQI 201-300)</option>
              <option value="Moderate">Moderate (AQI 101-200)</option>
            </select>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Custom Message / Action Advisory</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Dispatch water sprinklers and halt construction immediately."
              style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
              required
            />
          </div>

          <div style={footerStyle}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? 'Broadcasting...' : <><Send size={14} /> Broadcast Alert</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Inline styles for speed/simplicity
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(4px)'
};

const contentStyle = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '12px',
  width: '100%', maxWidth: '450px',
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  border: '1px solid var(--border-color)',
  overflow: 'hidden'
};

const headerStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid var(--border-color)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  backgroundColor: 'var(--bg-main)'
};

const titleStyle = {
  margin: 0, fontSize: '16px', fontWeight: 600,
  display: 'flex', alignItems: 'center', gap: '8px',
  color: 'var(--text-primary)'
};

const closeBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0
};

const formStyle = { padding: '20px' };

const fieldGroupStyle = { marginBottom: '16px' };

const labelStyle = {
  display: 'block', marginBottom: '6px', fontSize: '13px',
  fontWeight: 600, color: 'var(--text-secondary)'
};

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)',
  fontSize: '14px', boxSizing: 'border-box'
};

const footerStyle = {
  marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px'
};

const cancelBtnStyle = {
  padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border-color)',
  backgroundColor: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
  fontSize: '13px', fontWeight: 500
};

const submitBtnStyle = {
  padding: '8px 16px', borderRadius: '6px', border: 'none',
  backgroundColor: '#0ea5e9', color: 'white', cursor: 'pointer',
  fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
};
