import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Clock, Star, Send, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const doctorsList = [
  { id: 1, name: 'Dr. Priya Dandin', specialty: 'Dermatologist', number: '8088308455', exp: '4 years', rating: 4.8 },
  { id: 2, name: 'Dr. Vijaylaxmi Sonnad', specialty: 'General Physician', number: '6360146573', exp: '5 years', rating: 4.9 },
  { id: 3, name: 'Dr. Anjali Bhavi', specialty: 'Dermatologist', number: '8867022984', exp: '3 years', rating: 4.7 },
  { id: 4, name: 'Dr. Abdulla Baghwan', specialty: 'Skin Specialist', number: '6364130526', exp: '7 years', rating: 4.9 }
];

const DoctorDirectory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success
  const [smsStatus, setSmsStatus] = useState('pending'); // pending, sending, sent
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const handleBook = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingStatus('idle');
    setSmsStatus('pending');
  };

  const confirmBooking = () => {
    setBookingStatus('loading');
    
    // Simulate API call and checking availability
    setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const timeOptions = ['10:00 AM', '11:30 AM', '02:00 PM', '04:15 PM'];
      const randomTime = timeOptions[Math.floor(Math.random() * timeOptions.length)];

      setAppointmentDetails({
        date: tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        time: randomTime
      });
      setBookingStatus('success');
    }, 1500);
  };

  const getSmsHref = () => {
    if (!selectedDoctor || !appointmentDetails) return "#";
    const text = `Svastha AI Medical Alert:\nAppointment Confirmed with ${selectedDoctor.name}\nDate: ${appointmentDetails.date}\nTime: ${appointmentDetails.time}\nPatient: ${user?.name || 'Guest'}`;
    // The ?body= parameter ensures the SMS app is pre-filled.
    return `sms:+91${selectedDoctor.number}?body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="container animate-fade-in py-8">
      <div className="flex items-center gap-4 mb-8">
        <button className="btn-icon bg-muted rounded p-2" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Find a Specialist</h1>
      </div>

      {bookingStatus === 'success' && selectedDoctor ? (
        <div className="card text-center p-8 animate-fade-in" style={{ backgroundColor: 'var(--bg-default)', border: '2px solid var(--primary-color)' }}>
          <div className="flex justify-center mb-4">
            <ShieldCheck size={64} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Appointment Confirmed!</h2>
          <p className="text-muted mb-6">Your consultation has been successfully scheduled.</p>
          
          <div className="bg-muted p-6 rounded text-left max-w-md mx-auto mb-6" style={{ border: '1px solid var(--border-color)' }}>
            <h3 className="font-bold text-lg mb-4 text-primary line-clamp-1">{selectedDoctor.name}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-secondary" size={18} />
                <span><strong>Date:</strong> {appointmentDetails.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-secondary" size={18} />
                <span><strong>Time:</strong> {appointmentDetails.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="text-secondary" size={18} />
                <span><strong>Patient:</strong> {user?.name || 'Guest'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 items-center bg-primary-light p-4 rounded max-w-md mx-auto text-left mb-6 text-sm">
            <div className="flex items-start gap-3 w-full">
              <Send className="text-primary mt-1 flex-shrink-0" size={18} />
              <p>
                <strong>Send Native SMS Notification</strong><br/>
                Forward these details directly to {selectedDoctor.name} (+91 {selectedDoctor.number}) using your phone's standard messaging app.
              </p>
            </div>
            
            <a 
              href={getSmsHref()}
              className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2"
              onClick={() => setSmsStatus('sent')}
              style={{ textDecoration: 'none' }}
            >
              <Send size={16} /> Open Device SMS App
            </a>
            
            {smsStatus === 'sent' && (
              <div className="w-full text-center mt-2 text-primary font-bold bg-white p-2 border rounded">
                ✓ Native SMS app opened
              </div>
            )}
          </div>

          <button className="btn btn-outline px-8 py-3" onClick={() => navigate('/')}>
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-4">
            <div className="card h-full">
              <h2 className="text-lg font-bold mb-4">Search Filters</h2>
              <div className="flex items-center bg-muted p-2 rounded mb-6 border">
                <Search size={18} className="text-muted mx-2" />
                <input type="text" placeholder="Search doctors or specialty..." className="bg-transparent border-none outline-none w-full p-1" />
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-3">Specialty</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> Dermatologist</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked /> General Physician</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" /> Pediatrician</label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="flex flex-col gap-4">
              {doctorsList.map((doc) => (
                <div key={doc.id} className={`card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${selectedDoctor?.id === doc.id ? 'border-primary' : ''}`} style={{ border: selectedDoctor?.id === doc.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }}>
                  
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                      {doc.name.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-secondary">{doc.name}</h3>
                      <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                        <span className="flex items-center gap-1"><Star size={14} className="text-warning fill-current" /> {doc.rating}</span>
                        <span>{doc.exp} Experience</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-full md:w-auto mt-4 md:mt-0 gap-2">
                    {selectedDoctor?.id === doc.id ? (
                      <div className="bg-muted p-4 rounded flex flex-col gap-3">
                        <p className="text-sm font-medium">Available dynamically based on AI dispatch.</p>
                        <button 
                          className="btn btn-primary w-full"
                          onClick={confirmBooking}
                          disabled={bookingStatus === 'loading'}
                        >
                          {bookingStatus === 'loading' ? 'Checking Availability...' : 'Confirm Appointment'}
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="btn btn-outline"
                        onClick={() => handleBook(doc)}
                      >
                        Book Appointment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DoctorDirectory;
