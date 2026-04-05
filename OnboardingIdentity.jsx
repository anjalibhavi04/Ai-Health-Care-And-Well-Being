import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Calendar, ChevronDown, Globe,
  ArrowRight, Camera, CheckCircle2
} from 'lucide-react';
import './Onboarding.css';

const LANGUAGES = [
  'English', 'Hindi', 'Kannada', 'Tamil', 'Telugu',
  'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi'
];

const GENDERS = [
  { label: 'Male',               value: 'male' },
  { label: 'Female',             value: 'female' },
  { label: 'Other',              value: 'other' },
  { label: 'Prefer not to say',  value: 'undisclosed' },
];

const OnboardingIdentity = () => {
  const navigate = useNavigate();
  const photoRef = useRef(null);

  const [form, setForm] = useState({
    fullName:    '',
    dob:         '',
    gender:      '',
    language:    'English',
    photoUrl:    null,
  });

  const [errors, setErrors] = useState({});

  /* ── helpers ── */
  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) set('photoUrl', URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim())  errs.fullName = 'Please enter your full name.';
    if (!form.dob)              errs.dob      = 'Date of birth is required.';
    if (!form.gender)           errs.gender   = 'Please select your gender.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Save to context / localStorage here before navigating
    localStorage.setItem('svastha_identity', JSON.stringify(form));
    navigate('/onboarding/contact'); // Step 2
  };

  /* ── rendered ── */
  return (
    <div className="onboarding-page">
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '25%' }} />
        </div>
        <span className="progress-label">Step 1 of 5 — Personal Identity</span>
      </div>

      <div className="onboarding-card animate-fade-in">
        {/* Header */}
        <div className="oboard-header">
          <CheckCircle2 size={28} className="oboard-step-icon" />
          <div>
            <h2>Personal Identity</h2>
            <p className="text-muted text-sm">Help us know you better so we can personalise your health experience.</p>
          </div>
        </div>

        <form onSubmit={handleNext} className="oboard-form" noValidate>

          {/* Profile photo */}
          <div className="photo-section">
            <div
              className="photo-avatar"
              onClick={() => photoRef.current.click()}
              title="Upload photo"
            >
              {form.photoUrl
                ? <img src={form.photoUrl} alt="Profile" />
                : <User size={40} className="photo-placeholder-icon" />
              }
              <div className="photo-badge"><Camera size={14} /></div>
            </div>
            <div>
              <p className="font-medium">Profile photo</p>
              <p className="text-sm text-muted">Optional — tap to upload</p>
            </div>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </div>

          {/* Full name */}
          <div className="oboard-field">
            <label htmlFor="fullName">
              Full name <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <User size={18} className="oboard-icon" />
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Ravi Kumar"
                value={form.fullName}
                onChange={e => set('fullName', e.target.value)}
                className={errors.fullName ? 'is-error' : ''}
              />
            </div>
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* Date of birth */}
          <div className="oboard-field">
            <label htmlFor="dob">
              Date of birth <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <Calendar size={18} className="oboard-icon" />
              <input
                id="dob"
                type="date"
                value={form.dob}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => set('dob', e.target.value)}
                className={errors.dob ? 'is-error' : ''}
              />
            </div>
            {errors.dob && <span className="field-error">{errors.dob}</span>}
          </div>

          {/* Gender */}
          <div className="oboard-field">
            <label>Gender <span className="required">*</span></label>
            <div className="gender-grid">
              {GENDERS.map(g => (
                <button
                  key={g.value}
                  type="button"
                  className={`gender-chip ${form.gender === g.value ? 'active' : ''}`}
                  onClick={() => set('gender', g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {errors.gender && <span className="field-error">{errors.gender}</span>}
          </div>

          {/* Preferred language */}
          <div className="oboard-field">
            <label htmlFor="language">Preferred language</label>
            <div className="oboard-input-wrap">
              <Globe size={18} className="oboard-icon" />
              <select
                id="language"
                value={form.language}
                onChange={e => set('language', e.target.value)}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <ChevronDown size={16} className="select-chevron" />
            </div>
          </div>

          {/* CTA */}
          <button type="submit" className="btn-next">
            Continue <ArrowRight size={18} />
          </button>

        </form>
      </div>

      <p className="onboarding-disclaimer">
        Your data is stored securely and used only to personalise your Svastha AI experience.
      </p>
    </div>
  );
};

export default OnboardingIdentity;
