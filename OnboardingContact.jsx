import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, PhoneCall, Mail, MapPin, Hash,
  Building2, Map, ArrowRight, ArrowLeft,
  MapPinned, CheckCircle2, LocateFixed
} from 'lucide-react';
import './Onboarding.css';
import './OnboardingContact.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry'
];

const OnboardingContact = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile:     '',
    altMobile:  '',
    email:      '',
    address:    '',
    pincode:    '',
    city:       '',
    state:      '',
  });

  const [errors, setErrors]       = useState({});
  const [locating, setLocating]   = useState(false);
  const [locSuccess, setLocSuccess] = useState(false);

  /* ── helpers ── */
  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  /* Auto-fill city/state via browser geolocation + reverse-geocode */
  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const addr = data.address;
          setForm(f => ({
            ...f,
            city:    addr.city || addr.town || addr.village || '',
            state:   addr.state || '',
            pincode: addr.postcode || '',
          }));
          setLocSuccess(true);
          setTimeout(() => setLocSuccess(false), 3000);
        } catch {
          alert('Could not fetch location details. Please fill manually.');
        }
        setLocating(false);
      },
      () => {
        alert('Location access denied. Please fill in manually.');
        setLocating(false);
      }
    );
  };

  const validate = () => {
    const errs = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!form.mobile)               errs.mobile   = 'Mobile number is required.';
    else if (!phoneRegex.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number.';
    if (form.altMobile && !phoneRegex.test(form.altMobile))
      errs.altMobile = 'Enter a valid 10-digit number.';
    if (!form.email)                errs.email    = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.address.trim())       errs.address  = 'Current address is required for emergency dispatch.';
    if (!form.pincode)              errs.pincode  = 'Pincode is required.';
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode.';
    if (!form.city.trim())          errs.city     = 'City is required.';
    if (!form.state)                errs.state    = 'Please select your state.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Merge with existing onboarding data
    const prev = JSON.parse(localStorage.getItem('svastha_identity') || '{}');
    localStorage.setItem('svastha_contact', JSON.stringify(form));
    localStorage.setItem('svastha_onboarding', JSON.stringify({ ...prev, contact: form }));
    navigate('/onboarding/medical'); // Step 3
  };

  return (
    <div className="onboarding-page">
      {/* Progress bar */}
      <div className="onboarding-progress">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '50%' }} />
        </div>
        <span className="progress-label">Step 2 of 5 — Contact &amp; Location</span>
      </div>

      <div className="onboarding-card animate-fade-in">
        {/* Header */}
        <div className="oboard-header">
          <MapPinned size={28} className="oboard-step-icon" />
          <div>
            <h2>Contact &amp; Location</h2>
            <p className="text-muted text-sm">
              Required for emergency ambulance dispatch and appointment booking. Your data is encrypted and never shared.
            </p>
          </div>
        </div>

        <form onSubmit={handleNext} className="oboard-form" noValidate>

          {/* ── Section: Phone Numbers ── */}
          <div className="contact-section-label">
            <Phone size={15} /> Phone Numbers
          </div>

          {/* Primary mobile */}
          <div className="oboard-field">
            <label htmlFor="mobile">
              Mobile number (Primary) <span className="required">*</span>
            </label>
            <p className="field-hint">Used for OTP login and emergency notifications</p>
            <div className="oboard-input-wrap">
              <Phone size={18} className="oboard-icon" />
              <span className="phone-prefix">+91</span>
              <input
                id="mobile"
                type="tel"
                placeholder="98765 43210"
                maxLength={10}
                value={form.mobile}
                onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
                className={`with-prefix ${errors.mobile ? 'is-error' : ''}`}
              />
            </div>
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </div>

          {/* Alternate mobile */}
          <div className="oboard-field">
            <label htmlFor="altMobile">Alternate mobile number</label>
            <p className="field-hint">For emergency contact — friend, family member, or caregiver</p>
            <div className="oboard-input-wrap">
              <PhoneCall size={18} className="oboard-icon" />
              <span className="phone-prefix">+91</span>
              <input
                id="altMobile"
                type="tel"
                placeholder="Optional"
                maxLength={10}
                value={form.altMobile}
                onChange={e => set('altMobile', e.target.value.replace(/\D/g, ''))}
                className={`with-prefix ${errors.altMobile ? 'is-error' : ''}`}
              />
            </div>
            {errors.altMobile && <span className="field-error">{errors.altMobile}</span>}
          </div>

          {/* ── Section: Email ── */}
          <div className="contact-section-label">
            <Mail size={15} /> Email
          </div>

          <div className="oboard-field">
            <label htmlFor="c-email">
              Email address <span className="required">*</span>
            </label>
            <p className="field-hint">Appointment confirmations and health reports will be sent here</p>
            <div className="oboard-input-wrap">
              <Mail size={18} className="oboard-icon" />
              <input
                id="c-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className={errors.email ? 'is-error' : ''}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* ── Section: Address ── */}
          <div className="contact-section-label">
            <MapPin size={15} /> Address
          </div>

          <div className="oboard-field">
            <div className="address-label-row">
              <label htmlFor="address">
                Current address <span className="required">*</span>
              </label>
              <button
                type="button"
                className={`btn-locate ${locating ? 'locating' : ''} ${locSuccess ? 'success' : ''}`}
                onClick={handleAutoLocate}
                disabled={locating}
              >
                <LocateFixed size={14} />
                {locating ? 'Locating…' : locSuccess ? 'Location found!' : 'Auto-detect'}
              </button>
            </div>
            <p className="field-hint">Used to dispatch ambulance to your exact location during emergencies</p>
            <div className="oboard-input-wrap">
              <MapPin size={18} className="oboard-icon" style={{ top: '18px' }} />
              <textarea
                id="address"
                placeholder="Flat/House no., Street, Locality, Landmark"
                rows={3}
                value={form.address}
                onChange={e => set('address', e.target.value)}
                className={`address-textarea ${errors.address ? 'is-error' : ''}`}
              />
            </div>
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          {/* Pincode + City row */}
          <div className="two-col">
            <div className="oboard-field">
              <label htmlFor="pincode">
                Pincode <span className="required">*</span>
              </label>
              <div className="oboard-input-wrap">
                <Hash size={18} className="oboard-icon" />
                <input
                  id="pincode"
                  type="text"
                  placeholder="560 001"
                  maxLength={6}
                  value={form.pincode}
                  onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                  className={errors.pincode ? 'is-error' : ''}
                />
              </div>
              {errors.pincode && <span className="field-error">{errors.pincode}</span>}
            </div>

            <div className="oboard-field">
              <label htmlFor="city">
                City / Town <span className="required">*</span>
              </label>
              <div className="oboard-input-wrap">
                <Building2 size={18} className="oboard-icon" />
                <input
                  id="city"
                  type="text"
                  placeholder="Bengaluru"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  className={errors.city ? 'is-error' : ''}
                />
              </div>
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
          </div>

          {/* State */}
          <div className="oboard-field">
            <label htmlFor="state">
              State <span className="required">*</span>
            </label>
            <div className="oboard-input-wrap">
              <Map size={18} className="oboard-icon" />
              <select
                id="state"
                value={form.state}
                onChange={e => set('state', e.target.value)}
                className={errors.state ? 'is-error' : ''}
              >
                <option value="">Select your state</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span className="select-chevron">▾</span>
            </div>
            {errors.state && <span className="field-error">{errors.state}</span>}
          </div>

          {/* Emergency info banner */}
          <div className="emergency-notice">
            <MapPin size={16} className="emergency-icon" />
            <div>
              <strong>Why we need this</strong>
              <p>Your address and phone number are used <em>only</em> to dispatch emergency ambulances and share health appointment details. This data is encrypted end-to-end.</p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="oboard-nav-row">
            <button
              type="button"
              className="btn-back"
              onClick={() => navigate('/onboarding/identity')}
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
        Your contact and location data is stored securely. It is never sold or shared with third parties.
      </p>
    </div>
  );
};

export default OnboardingContact;
