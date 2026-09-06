import React, { useState } from 'react';
import './Login.css';
import { loginAdmin, forgotPassword } from '../services/api';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import skyBg from '../assets/sky_bg.jpg';
import logo from '../assets/logo.jpg';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await loginAdmin(email, password);
      onLoginSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email) {
      setErrorMsg('Please enter your email to reset password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      setSuccessMsg(res.message || 'Password reset link sent to your email');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${skyBg})` }}>
      
      <div className="login-card-wrapper">
        <img src={logo} alt="VayuSena Logo" className="login-logo" />
        
        <div className="login-card">
          <h2 className="login-title">Admin Login</h2>

          <form onSubmit={handleLogin} className="login-form">
            
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="input-group password-group">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button 
                type="button" 
                className="eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <div className="forgot-password-container">
              <button 
                type="button" 
                className="forgot-btn"
                onClick={handleForgotPassword}
                disabled={isLoading}
              >
                Forgot Password?
              </button>
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? <Loader2 className="spinner" size={20} /> : 'Log In'}
            </button>
          </form>

          <div className="login-footer">
            <span className="status-label">Status:</span>
            <div className="status-secure">
              <Shield size={16} className="shield-icon" />
              <span>Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
