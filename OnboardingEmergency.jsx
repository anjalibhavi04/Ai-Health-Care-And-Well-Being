import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, Phone, ArrowRight, ArrowLeft,
  ShieldAlert, UserSquare2
} from 'lucide-react';
import './Onboarding.css';

const RELATIONSHIPS = ['Parent', 'Spouse', 'Sibling', 'Friend', 'Other'];
const REGISTERING_FOR = ['Self', 'Child', 'Elderly parent', 'Other'];

const OnboardingEmergency = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    emergencyName: '',
    emergencyRelation: '',
    emergencyMobile: '',
    registeringFor: 'Self',
  });

  const [errors, setErrors] = useState({});

  /* ── helpers ── */
  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    
    if (!form.emergencyName.trim()) 
      errs.emergencyName = 'Emergency contact name is required.';
    
    if (!form.emergencyRelation) 
      errs.emergencyRelation = 'Please select a relationship.';
      
    if (!form.emergencyMobile) 
      errs.emergencyMobile = 'Mobile number is required.';
    else if (!phoneRegex.test(form.emergencyMobile)) 
      errs.emergencyMobile = 'Enter a valid 10-digit Indian mobile number.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Save to context / localStorage
    const prev = JSON.parse(localStorage.getItem('svastha_onboarding') || '{}');
    const finalData = { ...prev, emergency: form };
    localStorage.setItem('svastha_onboarding', JSON.stringify(finalData));
    
    // Onboarding complete! Navigate to home/dashboard
    alert("Onboarding Complete! Data saved locally.");
    navigate('/');
  };

  return (
    <div className="onboarding-page">
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '100%' }} />
        </div>
        <span className="progress-label">Step 5 of 5 — Family &amp; Emergency Contact</span>
      </div>

      <div className="onboarding-card animate-fade-in">
        {/* Header */}
        <div className="oboard-header">
          <ShieldAlert size={28} className="text-danger flex-shrink-0 mt-1" />
          <div>
            <h2>Emergency Contact</h2>
            <p className="text-muted text-sm">
              Essential for when the patient cannot speak for themselves. We'll only contact them in critical situations.
            </p>
          </div>
        </div>

        <form onSubmit={handleFinish} className="oboard-form" noValidate>

          {/* Registering For */}
          <div className="oboard-field">
            <label>Are you registering for yourself or a family member?</label>
            <div className="gender-grid" style={{ marginTop: '4px' }}>
              {REGISTERING_FOR.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`gender-chip ${form.registeringFor === option ? 'active' : ''}`}
                  onClick={() => set('registeringFor', option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />

          {/* Emergency Contact Name */}
          <div className="oboard-field">
            <label htmlFor="emergencyName">
              Emergency contact name <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <UserSquare2 size={18} className="oboard-icon" />
              <input
                id="emergencyName"
                type="text"
                placeholder="e.g. Anjali Sharma"
                value={form.emergencyName}
                onChange={e => set('emergencyName', e.target.value)}
                className={errors.emergencyName ? 'is-error' : ''}
              />
            </div>
            {errors.emergencyName && <span className="field-error">{errors.emergencyName}</span>}
          </div>

          {/* Emergency Contact Relationship */}
          <div className="oboard-field">
            <label htmlFor="emergencyRelation">
              Relationship to patient <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <Users size={18} className="oboard-icon" />
              <select
                id="emergencyRelation"
                value={form.emergencyRelation}
                onChange={e => set('emergencyRelation', e.target.value)}
                className={errors.emergencyRelation ? 'is-error' : ''}
              >
                <option value="">Select relationship</option>
                {RELATIONSHIPS.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
              <span className="select-chevron">▾</span>
            </div>
            {errors.emergencyRelation && <span className="field-error">{errors.emergencyRelation}</span>}
          </div>

          {/* Emergency Contact Mobile */}
          <div className="oboard-field">
            <label htmlFor="emergencyMobile">
              Emergency contact mobile <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <Phone size={18} className="oboard-icon" />
              <span className="phone-prefix" style={{ left: '42px', position: 'absolute', fontSize: '0.92rem', fontWeight: 600, pointerEvents: 'none' }}>+91</span>
              <input
                id="emergencyMobile"
                type="tel"
                placeholder="98765 43210"
                maxLength={10}
                value={form.emergencyMobile}
                onChange={e => set('emergencyMobile', e.target.value.replace(/\D/g, ''))}
                className={errors.emergencyMobile ? 'is-error' : ''}
                style={{ paddingLeft: '76px' }}
              />
            </div>
            {errors.emergencyMobile && <span className="field-error">{errors.emergencyMobile}</span>}
          </div>

          {/* Nav buttons */}
          <div className="oboard-nav-row" style={{ marginTop: '16px' }}>
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/onboarding/lifestyle')}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button type="submit" className="btn-next">
              Complete Setup <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>
      
      <p className="onboarding-disclaimer">
        Your emergency contact will only be used by authorized responders via Svastha AI in critical moments.
      </p>
    </div>
  );
};

export default OnboardingEmergency;
