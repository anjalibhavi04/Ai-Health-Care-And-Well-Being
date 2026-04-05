import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'doctor' ? 'doctor' : 'patient';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(initialRole); // 'patient' or 'doctor'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate auth — replace with real API call
    setTimeout(() => {
      setLoading(false);
      login({ email: formData.email, name: role === 'doctor' ? 'Dr. ' + formData.email.split('@')[0] : 'User', role });
      navigate(role === 'doctor' ? '/doctor-dashboard' : '/');
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <Activity size={32} className="brand-icon" />
          <h1 className="brand-name">Svastha AI</h1>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your health assistant account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="flex gap-2 mb-6 p-1 bg-muted rounded-md" style={{ border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${role === 'patient' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:bg-white/50'}`}
              onClick={() => setRole('patient')}
            >
              Patient
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${role === 'doctor' ? 'bg-primary text-white shadow' : 'text-muted-foreground hover:bg-white/50'}`}
              onClick={() => setRole('doctor')}
            >
              Doctor
            </button>
          </div>

          <div className="field-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <span className="spinner" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-divider"><span>New to Svastha?</span></div>

        <Link to="/register" className="btn-auth-outline">
          <UserPlus size={18} />
          Create an account
        </Link>
      </div>

      <p className="auth-disclaimer">
        By signing in you agree to our Terms of Service. Svastha AI is for informational purposes only — not a substitute for professional medical advice.
      </p>
    </div>
  );
};

export default Login;
