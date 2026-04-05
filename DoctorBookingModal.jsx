import React, { useState } from 'react';
import { X, Calendar, MapPin, User, CheckCircle } from 'lucide-react';
import './DoctorBookingModal.css';

const DoctorBookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: 'Dermatologist',
    date: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate booking API call
    setTimeout(() => {
      setStep(2);
    }, 1000);
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content card">
        <button className="btn-icon modal-close" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        {step === 1 ? (
          <div>
            <h2 className="mb-4 flex items-center gap-2">
              <Calendar className="text-primary" /> Book Specialist
            </h2>
            <p className="text-sm text-muted mb-6">
              Our system analyzes your symptoms and recommends booking a certified doctor. Enter your details below.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} className="text-muted" />
                  <input 
                    type="text" 
                    required 
                    autoFocus
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Specialty Needed</label>
                <select 
                  value={formData.specialty}
                  onChange={e => setFormData({...formData, specialty: e.target.value})}
                >
                  <option>Dermatologist</option>
                  <option>General Physician</option>
                  <option>Cardiologist</option>
                  <option>Neurologist</option>
                </select>
              </div>
              <div className="input-group">
                <label>Preferred Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="input-group">
                <label>Location Update</label>
                <p className="text-sm text-muted flex items-center gap-1">
                  <MapPin size={14}/> Using your current location to find nearby doctors.
                </p>
              </div>
              <button type="submit" className="btn btn-primary mt-4 w-full justify-center">
                Confirm Booking
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h2 className="mb-2">Booking Confirmed!</h2>
            <p className="text-muted text-sm mb-6">
              Dr. Smith ({formData.specialty}) has been notified. 
              An SMS with clinic directions and time will be sent to you shortly.
            </p>
            <button className="btn btn-outline w-full justify-center" onClick={onClose}>
              Return to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorBookingModal;
