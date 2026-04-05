import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity, User, Mail, Lock, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = queryParams.get('role') === 'doctor' ? 'doctor' : 'patient';

  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', confirmPassword: '',
    specialization: '', experience: '', phone: '', location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState(initialRole); // 'patient' or 'doctor'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (role === 'doctor' && (!formData.phone || !formData.specialization)) {
      setError('Doctors must fill in specialization and phone number.'); return;
    }
    setLoading(true);
    // Simulate account creation — replace with real API
    setTimeout(() => {
      setLoading(false);
      const isDoc = role === 'doctor';
      const finalName = isDoc && !formData.name.toLowerCase().startsWith('dr') ? 'Dr. ' + formData.name : formData.name;
      login({ email: formData.email, name: finalName, role, isNew: true });
      
      if (isDoc) {
        navigate('/doctor-dashboard');
      } else {
        navigate('/onboarding/identity'); // Go to Personal Identity step
      }
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Activity size={32} className="brand-icon" />
          <h1 className="brand-name">Svastha AI</h1>
        </div>

        <h2 className="auth-title">Create account</h2>
        <p className="auth-subtitle">Join Svastha AI for personalised health guidance</p>

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
              Doctor Professional
            </button>
          </div>

          <div className="field-group">
            <label htmlFor="reg-name">Your name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="reg-email">Email address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {role === 'doctor' && (
            <>
              <div className="field-group">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Dermatologist"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: 'var(--border-color)', outline: 'none' }}
                />
              </div>
              <div className="flex gap-4">
                <div className="field-group flex-1">
                  <label>Experience</label>
                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 5 Years"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: 'var(--border-color)', outline: 'none' }}
                  />
                </div>
                <div className="field-group flex-1">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    style={{ borderColor: 'var(--border-color)', outline: 'none' }}
                  />
                </div>
              </div>
              <div className="field-group">
                <label>Clinic Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  style={{ borderColor: 'var(--border-color)', outline: 'none' }}
                />
              </div>
            </>
          )}

          <div className="field-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
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

          <div className="field-group">
            <label htmlFor="reg-confirm">Confirm password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="reg-confirm"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? <span className="spinner" /> : <>Create account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="auth-divider"><span>Already have an account?</span></div>
        <Link to="/login" className="btn-auth-outline">Sign in instead</Link>
      </div>

      <p className="auth-disclaimer">
        By creating an account you agree to our Terms of Service. Svastha AI is for informational purposes only.
      </p>
    </div>
  );
};

export default Register;
