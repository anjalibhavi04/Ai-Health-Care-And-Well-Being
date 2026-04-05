import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CigaretteOff, Wine, Activity, Utensils, Moon, Briefcase, 
  ArrowRight, ArrowLeft, Leaf, Baby
} from 'lucide-react';
import './Onboarding.css';

const FREQUENCY = ['Never', 'Occasionally', 'Regular'];
const ACTIVITY = ['Sedentary', 'Moderate', 'Active'];
const DIET = ['Vegetarian', 'Non-vegetarian', 'Vegan', 'Diabetic diet'];

const OnboardingLifestyle = () => {
  const navigate = useNavigate();
  
  // Read identity to check gender for conditional rendering
  const [isFemale, setIsFemale] = useState(false);
  
  useEffect(() => {
    const identityData = JSON.parse(localStorage.getItem('svastha_identity') || '{}');
    if (identityData.gender === 'Female') {
      setIsFemale(true);
    }
  }, []);

  const [form, setForm] = useState({
    smoking: 'Never',
    alcohol: 'Never',
    activity: 'Sedentary',
    diet: 'Vegetarian',
    sleep: '',
    occupation: '',
    pregnant: '',
    gynecology: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleNext = (e) => {
    e.preventDefault();
    localStorage.setItem('svastha_lifestyle', JSON.stringify(form));
    navigate('/onboarding/emergency'); // Proceed to final step 5
  };

  return (
    <div className="onboarding-page">
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '80%' }} />
        </div>
        <span className="progress-label">Step 4 of 5 — Lifestyle Information</span>
      </div>

      <div className="onboarding-card animate-fade-in">
        {/* Header */}
        <div className="oboard-header">
          <Leaf size={28} className="oboard-step-icon" />
          <div>
            <h2>Lifestyle Information</h2>
            <p className="text-muted text-sm">
              Helps Svastha AI provide better health recommendations and accurate treatment suggestions.
            </p>
          </div>
        </div>

        <form onSubmit={handleNext} className="oboard-form">
          
          {/* Smoking & Alcohol in a row */}
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="oboard-field">
              <label><CigaretteOff size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Smoking</label>
              <div className="gender-grid" style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FREQUENCY.map(opt => (
                  <button key={opt} type="button" className={`gender-chip ${form.smoking === opt ? 'active' : ''}`} onClick={() => set('smoking', opt)} style={{ flex: 1, padding: '8px' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="oboard-field">
              <label><Wine size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Alcohol consumption</label>
              <div className="gender-grid" style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {FREQUENCY.map(opt => (
                  <button key={opt} type="button" className={`gender-chip ${form.alcohol === opt ? 'active' : ''}`} onClick={() => set('alcohol', opt)} style={{ flex: 1, padding: '8px' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-color)', margin: '12px 0' }} />

          {/* Physical Activity */}
          <div className="oboard-field">
            <label><Activity size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Physical activity level</label>
            <div className="gender-grid" style={{ marginTop: '4px' }}>
              {ACTIVITY.map(opt => (
                <button key={opt} type="button" className={`gender-chip ${form.activity === opt ? 'active' : ''}`} onClick={() => set('activity', opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Type */}
          <div className="oboard-field">
            <label><Utensils size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Diet type</label>
            <div className="oboard-input-wrap" style={{ marginTop: '4px' }}>
              <select value={form.diet} onChange={e => set('diet', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: 'var(--bg-card)', outline: 'none' }}>
                {DIET.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* Sleep & Occupation in a row */}
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
             <div className="oboard-field">
              <label htmlFor="sleep"><Moon size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Sleep hours / night</label>
              <div className="oboard-input-wrap">
                <input id="sleep" type="number" placeholder="e.g. 7" min="1" max="24" value={form.sleep} onChange={e => set('sleep', e.target.value)} />
              </div>
            </div>

            <div className="oboard-field">
              <label htmlFor="occupation"><Briefcase size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Occupation</label>
              <div className="oboard-input-wrap">
                <input id="occupation" type="text" placeholder="e.g. Software Engineer" value={form.occupation} onChange={e => set('occupation', e.target.value)} />
              </div>
              <p className="field-hint" style={{ fontSize: '0.75rem', marginTop: '2px' }}>Helps detect occupational stress risks</p>
            </div>
          </div>

          {/* Women's Health (Conditional) */}
          {isFemale && (
            <>
              <div style={{ height: '1px', background: 'var(--border-color)', margin: '16px 0 12px 0' }} />
              
              <div className="oboard-field">
                <label style={{ color: '#d81b60', fontWeight: '600' }}><Baby size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Women's Health</label>
              </div>

              <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="oboard-field">
                  <label>Are you pregnant?</label>
                  <div className="oboard-input-wrap" style={{ marginTop: '4px' }}>
                    <select value={form.pregnant} onChange={e => set('pregnant', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: 'var(--bg-card)', outline: 'none' }}>
                      <option value="">Select option</option>
                      {['Yes', 'No', 'Prefer not to say'].map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div className="oboard-field">
                  <label>Gynaecological conditions</label>
                  <div className="oboard-input-wrap" style={{ marginTop: '4px' }}>
                    <select value={form.gynecology} onChange={e => set('gynecology', e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: 'var(--bg-card)', outline: 'none' }}>
                      <option value="">Select option</option>
                      {['PCOS', 'Endometriosis', 'None', 'Prefer not to say'].map(opt => <option key={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nav buttons */}
          <div className="oboard-nav-row" style={{ marginTop: '20px' }}>
            <button type="button" className="btn-back" onClick={() => navigate('/onboarding/medical')}>
              <ArrowLeft size={18} /> Back
            </button>
            <button type="submit" className="btn-next">
              Continue <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OnboardingLifestyle;
