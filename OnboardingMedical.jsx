import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartPulse, Pill, AlertTriangle, Scissors,
  Accessibility, ArrowRight, ArrowLeft,
  Plus, X, ClipboardList, CheckCircle2
} from 'lucide-react';
import './Onboarding.css';
import './OnboardingMedical.css';

/* ── Static data ── */
const CHRONIC_DISEASES = [
  { label: 'Diabetes' },
  { label: 'Hypertension' },
  { label: 'Asthma' },
  { label: 'Heart Disease' },
  { label: 'Thyroid' },
  { label: 'None' },
];

const ALLERGY_CATEGORIES = ['Medicine', 'Food', 'Environmental', 'Other'];

const OnboardingMedical = () => {
  const navigate = useNavigate();

  /* ── State ── */
  const [diseases,       setDiseases]       = useState([]);   // multi-select
  const [medications,    setMedications]     = useState('');
  const [allergies,      setAllergies]       = useState([]);   // [{name, category}]
  const [allergyInput,   setAllergyInput]    = useState('');
  const [allergyCategory, setAllergyCategory] = useState('Medicine');
  const [surgeries,      setSurgeries]       = useState('');
  const [disability,     setDisability]      = useState('');
  const [errors,         setErrors]          = useState({});

  /* ── Disease chip toggle ── */
  const toggleDisease = (label) => {
    if (label === 'None') {
      setDiseases(prev => prev.includes('None') ? [] : ['None']);
      return;
    }
    setDiseases(prev => {
      const withoutNone = prev.filter(d => d !== 'None');
      return withoutNone.includes(label)
        ? withoutNone.filter(d => d !== label)
        : [...withoutNone, label];
    });
    setErrors(e => ({ ...e, diseases: '' }));
  };

  /* ── Allergy tag add / remove ── */
  const addAllergy = () => {
    const trimmed = allergyInput.trim();
    if (!trimmed) return;
    if (allergies.find(a => a.name.toLowerCase() === trimmed.toLowerCase())) {
      setErrors(e => ({ ...e, allergy: 'Already added.' }));
      return;
    }
    setAllergies(prev => [...prev, { name: trimmed, category: allergyCategory }]);
    setAllergyInput('');
    setErrors(e => ({ ...e, allergy: '' }));
  };

  const removeAllergy = (idx) =>
    setAllergies(prev => prev.filter((_, i) => i !== idx));

  const handleAllergyKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addAllergy(); }
  };

  /* ── validation ── */
  const validate = () => {
    const errs = {};
    if (diseases.length === 0)
      errs.diseases = 'Please select at least one option (or "None").';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ── submit ── */
  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = { diseases, medications, allergies, surgeries, disability };
    localStorage.setItem('svastha_medical', JSON.stringify(data));
    navigate('/onboarding/lifestyle'); // Step 4
  };

  /* ── category badge colour ── */
  const categoryColor = (cat) => {
    const map = {
      Medicine:      { bg: '#fde8e8', color: '#c0392b' },
      Food:          { bg: '#fef3cd', color: '#856404' },
      Environmental: { bg: '#e8f5e9', color: '#2e7d32' },
      Other:         { bg: '#ede8fd', color: '#6c3fc8' },
    };
    return map[cat] || { bg: '#eee', color: '#333' };
  };

  /* ── render ── */
  return (
    <div className="onboarding-page">
      {/* Progress */}
      <div className="onboarding-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '60%' }} />
        </div>
        <span className="progress-label">Step 3 of 5 — Medical History</span>
      </div>

      <div className="onboarding-card animate-fade-in">
        {/* Header */}
        <div className="oboard-header">
          <ClipboardList size={28} className="oboard-step-icon" />
          <div>
            <h2>Medical History</h2>
            <p className="text-muted text-sm">
              Helps Svastha AI give you safer, more personalised health guidance.
              All medical data is kept strictly confidential.
            </p>
          </div>
        </div>

        <form onSubmit={handleNext} className="oboard-form" noValidate>

          {/* ── 1. Chronic Diseases ── */}
          <div className="med-section">
            <div className="med-section-label">
              <HeartPulse size={15} /> Chronic Diseases
            </div>
            <p className="field-hint">Select all that apply</p>
            <div className="disease-grid">
              {CHRONIC_DISEASES.map(({ label }) => (
                <button
                  key={label}
                  type="button"
                  className={`disease-chip ${diseases.includes(label) ? 'active' : ''} ${label === 'None' ? 'none-chip' : ''}`}
                  onClick={() => toggleDisease(label)}
                >
                  {label}
                  {diseases.includes(label) && (
                    <CheckCircle2 size={14} className="chip-check" />
                  )}
                </button>
              ))}
            </div>
            {errors.diseases && <span className="field-error">{errors.diseases}</span>}
          </div>

          {/* ── 2. Current Medications ── */}
          <div className="med-section">
            <div className="med-section-label">
              <Pill size={15} /> Current Medications
            </div>
            <p className="field-hint">List any medicines you take regularly (name & dose if known)</p>
            <textarea
              className="med-textarea"
              placeholder="e.g. Metformin 500mg (twice daily), Atorvastatin 10mg (night)&#10;Leave blank if none."
              rows={4}
              value={medications}
              onChange={e => setMedications(e.target.value)}
            />
          </div>

          {/* ── 3. Known Allergies ── */}
          <div className="med-section">
            <div className="med-section-label">
              <AlertTriangle size={15} /> Known Allergies
            </div>
            <p className="field-hint">Add medicines, foods, or environmental triggers one at a time</p>

            {/* Tag input row */}
            <div className="allergy-input-row">
              <select
                className="allergy-cat-select"
                value={allergyCategory}
                onChange={e => setAllergyCategory(e.target.value)}
              >
                {ALLERGY_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <input
                type="text"
                className="allergy-text-input"
                placeholder="e.g. Penicillin, Peanuts, Pollen…"
                value={allergyInput}
                onChange={e => { setAllergyInput(e.target.value); setErrors(ex => ({ ...ex, allergy: '' })); }}
                onKeyDown={handleAllergyKey}
              />
              <button type="button" className="btn-add-allergy" onClick={addAllergy}>
                <Plus size={18} />
              </button>
            </div>
            {errors.allergy && <span className="field-error">{errors.allergy}</span>}

            {/* Tag list */}
            {allergies.length > 0 && (
              <div className="allergy-tags">
                {allergies.map((a, i) => {
                  const style = categoryColor(a.category);
                  return (
                    <span
                      key={i}
                      className="allergy-tag"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      <span className="tag-cat">{a.category}</span>
                      {a.name}
                      <button
                        type="button"
                        className="tag-remove"
                        style={{ color: style.color }}
                        onClick={() => removeAllergy(i)}
                      >
                        <X size={13} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── 4. Past Surgeries / Hospitalisations ── */}
          <div className="med-section">
            <div className="med-section-label">
              <Scissors size={15} /> Past Surgeries or Hospitalisations
            </div>
            <p className="field-hint">Include condition, year, and hospital if you remember</p>
            <textarea
              className="med-textarea"
              placeholder="e.g. Appendectomy (2018, City Hospital)&#10;Hospitalized for dengue (2021)&#10;Leave blank if none."
              rows={4}
              value={surgeries}
              onChange={e => setSurgeries(e.target.value)}
            />
          </div>

          {/* ── 5. Disability / Special Needs ── */}
          <div className="med-section">
            <div className="med-section-label">
              <Accessibility size={15} /> Disability or Special Needs
            </div>
            <p className="field-hint">Optional — helps us tailor emergency response and appointment support</p>
            <textarea
              className="med-textarea"
              placeholder="e.g. Wheelchair user, visual impairment, hearing aid required…&#10;Leave blank if not applicable."
              rows={3}
              value={disability}
              onChange={e => setDisability(e.target.value)}
            />
          </div>

          {/* Disclaimer banner */}
          <div className="med-notice">
            <HeartPulse size={16} className="med-notice-icon" />
            <div>
              <strong>Confidential medical data</strong>
              <p>This information is stored encrypted and shared only with doctors you choose to consult. Svastha AI uses it to provide safer, more relevant health guidance.</p>
            </div>
          </div>

          {/* Nav */}
          <div className="oboard-nav-row">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/onboarding/contact')}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button type="submit" className="btn-next">
              Continue <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>

      <p className="onboarding-disclaimer">
        Your medical information is protected under strict data privacy policies and is never sold to third parties.
      </p>
    </div>
  );
};

export default OnboardingMedical;
