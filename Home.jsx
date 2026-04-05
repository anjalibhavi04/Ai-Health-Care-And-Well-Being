import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Image as ImageIcon, CalendarCheck, ShieldAlert, Clock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AmbulanceButton from '../components/AmbulanceButton';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageSubmit = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem('pending_image_analysis', reader.result);
        navigate('/chat');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    if (user && user.role === 'doctor') {
      navigate('/doctor-dashboard');
      return;
    }
    if (user) {
      const savedObj = localStorage.getItem('svastha_chat_history');
      if (savedObj) {
        const parsed = JSON.parse(savedObj);
        // Filter out initial message or just take the rest
        if (parsed.length > 1) {
          setHistory(parsed.filter(msg => msg.role !== 'action'));
        }
      }
    } else {
      setHistory([]);
    }
  }, [user, navigate]);

  return (
    <div className="home-page animate-fade-in">
      <section className="hero container text-center">
        <h1 className="hero-title">Your Personal Health Assistant</h1>
        <p className="hero-subtitle text-muted text-lg mt-4 mb-8">
          Svastha AI is a smart, safety-focused healthcare companion. Analyze skin issues, chat about symptoms, and get immediate help when you need it most.
        </p>
        <p className="text-sm text-muted mt-4">Just say "Hey Svastha" to begin hands-free mode</p>
      </section>

      <section className="features container mt-8 mb-8">
        <div className="feature-grid">
          <div className="card text-center flex flex-col justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <Bot size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">Smart Chatbot</h3>
              <p className="text-muted text-sm mb-4">Talk about symptoms. Get clear, safe advice with necessary medical disclaimers.</p>
            </div>
            <Link to="/chat" className="btn btn-outline w-full" style={{ display: 'inline-block' }}>Start Chat</Link>
          </div>
          
          <div className="card text-center flex flex-col justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <ImageIcon size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">Image Analysis</h3>
              <p className="text-muted text-sm mb-4">Upload medical or skin photos. Our advanced Gemini API integration analyzes possibilities instantly.</p>
            </div>
            <div>
              <label htmlFor="home-image-upload" className="btn btn-outline w-full cursor-pointer" style={{ display: 'inline-block' }}>
                {selectedFile ? 'Change Image' : 'Upload Image'}
              </label>
              <input 
                type="file" 
                id="home-image-upload" 
                className="hidden" 
                style={{ display: 'none' }}
                accept="image/*" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
              />
              {selectedFile && (
                <button 
                  onClick={handleImageSubmit} 
                  className="btn btn-primary w-full mt-2 animate-fade-in"
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          <div className="card text-center flex flex-col justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <CalendarCheck size={40} className="text-primary" />
              </div>
              <h3 className="mb-2">Doctor Booking</h3>
              <p className="text-muted text-sm mb-4">If symptoms are serious, we help you find and book an appointment with a nearby specialist.</p>
            </div>
            <Link to="/doctors" className="btn btn-outline w-full" style={{ display: 'inline-block' }}>Find a Doctor</Link>
          </div>

          <div className="card text-center flex flex-col justify-between">
            <div>
              <div className="flex justify-center mb-4">
                <ShieldAlert size={40} className="text-danger" />
              </div>
              <h3 className="mb-2">Emergency Hub</h3>
              <p className="text-muted text-sm mb-4">One-click ambulance booking using your precise location for critical emergencies.</p>
            </div>
            <div style={{ pointerEvents: 'auto' }}>
              <AmbulanceButton />
            </div>
          </div>
        </div>
      </section>

      {user && history.length > 1 && (
        <section className="container mt-8 mb-8 animate-fade-in">
          <div className="card" style={{ padding: '24px' }}>
            <div className="flex items-center gap-2 mb-4" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <Clock className="text-secondary" />
              <h2 className="text-xl">Recent Chat Highlights</h2>
            </div>
            
            <div className="history-preview" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Show the last two user messages as "sessions" preview */}
              {history
                .filter(m => m.role === 'user')
                .slice(-2)
                .reverse()
                .map((msg, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 bg-muted rounded" style={{ background: 'var(--bg-default)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <p className="font-medium text-sm text-secondary">You asked about:</p>
                      <p className="text-muted truncate mt-1" style={{ maxWidth: '60vw' }}>"{msg.content || 'Image analysis request'}"</p>
                    </div>
                    <button className="btn-icon text-primary" onClick={() => navigate('/chat')} title="Resume chat">
                      <ChevronRight />
                    </button>
                  </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/chat" className="btn btn-outline" style={{ display: 'inline-flex', padding: '8px 16px', fontSize: '0.9rem' }}>View Full History</Link>
            </div>
          </div>
        </section>
      )}
      
      <div className="container disclaimer mb-8 text-center" style={{ justifyContent: 'center' }}>
        <ShieldAlert className="disclaimer-icon" size={18} />
        <div>
          <strong>Medical Disclaimer:</strong> Svastha AI provides informational assistance only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding a medical condition.
        </div>
      </div>
    </div>
  );
};

export default Home;
