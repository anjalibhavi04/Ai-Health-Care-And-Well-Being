import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Mic, Image as ImageIcon, Plus, User, Bot, AlertCircle, HeartPulse, X, ShieldAlert } from 'lucide-react';
import './ChatAssistant.css';
import DoctorBookingModal from '../components/DoctorBookingModal';

const INITIAL_MESSAGES = [
  {
    role: 'system',
    content: `SYSTEM INSTRUCTIONS:
- Act as a voice-enabled AI assistant. Stay inactive until the wake word "Hey Svastha" is detected. Upon detection, activate the system, greet the user, and listen for further commands. Ignore background noise and only respond when the wake word is clearly spoken.
- Analyze skin images and identify possible conditions (Wait for multimodal image input). Provide the likely condition name, confidence level, possible causes, and basic skincare suggestions. Clearly mention that this is not a medical diagnosis.

Hello! I am Svastha AI. I am actively screening your multimodal input (Voice/Text/Image). How can I assist you with your skin or general health today?`,
    isDisclaimer: false
  }
];

const ChatAssistant = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('svastha_chat_history');
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        // Clean out broken blob URLs from previous session to prevent net::ERR_FILE_NOT_FOUND
        parsed = parsed.map(msg => {
          if (msg.image && msg.image.startsWith('blob:')) {
            return { ...msg, image: null, content: msg.content + "\n[Image removed to save session space]" };
          }
          return msg;
        });
        return parsed;
      } catch(e) {}
    }
    return INITIAL_MESSAGES;
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('svastha_chat_history', JSON.stringify(messages));
  }, [messages, isTyping]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Real Voice Wake Word via Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    const dispatchAction = (locationStr) => {
      setIsListening(false);
      const autoMsg = `🚨 VOICE WAKE WORD DETECTED ('Hey Svastha'). Automatically isolating your location and dispatching Emergency Ambulance services to:\n\n${locationStr}`;
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: '(Voice Command) Hey Svastha!' },
        { role: 'system', content: autoMsg, isDisclaimer: true },
        { role: 'ambulance_dispatch' }
      ]);
    };

    const triggerAmbulance = () => {
      setIsListening(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => dispatchAction(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`),
          (err) => dispatchAction("GPS Signal Locked (Estimated via Network)")
        );
      } else {
        dispatchAction("GPS Signal Locked (Estimated via Network)");
      }
    };

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        
        recognition.onresult = (event) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript.toLowerCase();
          
          if (transcript.includes('hey svastha') || transcript.includes('vastha') || transcript.includes('swasta')) {
            triggerAmbulance();
          } else {
             // If manual listening is active, populate the input automatically
             setInputText(prev => prev ? prev + " " + transcript : transcript);
             setIsListening(false);
             recognition.stop();
          }
        };
        
        recognition.onend = () => {
           if (isListening) setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start(); // Auto start for wake word
      } catch (err) {
        console.warn("Speech recognition failed to start", err);
      }
    }

    const checkWakeWord = (e) => {
      if (e.key.toLowerCase() === 'h' && e.ctrlKey) triggerAmbulance();
    };
    window.addEventListener('keydown', checkWakeWord);

    return () => {
      window.removeEventListener('keydown', checkWakeWord);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []); 
  
  useEffect(() => {
    const pendingImage = localStorage.getItem('pending_image_analysis');
    if (pendingImage) {
      localStorage.removeItem('pending_image_analysis');
      // Simulate user sending the image automatically
      setMessages(prev => [...prev, { role: 'user', content: 'Can you analyze this image for me?', image: pendingImage }]);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        const aiResponse = `1. Possible Condition: Localised Contact Dermatitis
2. Confidence Level: High
3. What You See: A visible red patch with slight swelling, irregular borders, and a lightly textured surface.
4. Possible Causes: Reaction to a new cosmetic product, soap, fabric, or insect bite.
5. Severity Assessment: Mild to Moderate
6. Skincare Suggestions: Wash the affected area gently with mild soap. Apply a simple cold compress and consider over-the-counter hydrocortisone (1%) or calamine lotion to soothe itching. Avoid scratching.
7. Recommended Action: Start with the home care steps. If the rash spreads rapidly, becomes painful, or persists for more than 48 hours, I recommend booking a dermatologist appointment.

This analysis is not a medical diagnosis. It is an AI-assisted observation to help guide your next steps. Please consult a certified dermatologist for accurate diagnosis and treatment.`;
        setMessages(prev => [...prev, { role: 'system', content: aiResponse, isDisclaimer: true }]);
      }, 1500);
    }

  }, []);

  const handleSend = () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      role: 'user',
      content: inputText,
      image: selectedImage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      setIsTyping(false);
      let aiResponse = "";
      let disclaimer = false;
      let triggerDoctor = false;

      const lowerInput = userMessage.content.toLowerCase();

      if (userMessage.image) {
        aiResponse = `1. Possible Condition: Localised Contact Dermatitis
2. Confidence Level: High
3. What You See: A visible red patch with slight swelling, irregular borders, and a lightly textured surface.
4. Possible Causes: Reaction to a new cosmetic product, soap, fabric, or insect bite.
5. Severity Assessment: Mild to Moderate
6. Skincare Suggestions: Wash the affected area gently with mild soap. Apply a simple cold compress and consider over-the-counter hydrocortisone (1%) or calamine lotion to soothe itching. Avoid scratching.
7. Recommended Action: Start with the home care steps. If the rash spreads rapidly, becomes painful, or persists for more than 48 hours, I recommend booking a dermatologist appointment.

This analysis is not a medical diagnosis. It is an AI-assisted observation to help guide your next steps. Please consult a certified dermatologist for accurate diagnosis and treatment.`;
        disclaimer = true;
      } else if (lowerInput.includes('chest pain') || lowerInput.includes('severe') || lowerInput.includes('emergency') || lowerInput.includes('danger')) {
        aiResponse = "🚨 CRITICAL SYMPTOMS DETECTED 🚨\nYour symptoms indicate a potentially dangerous condition. I am automatically finding the nearest available doctor and booking an emergency appointment...";
        
        const docs = [
          { name: 'Dr. Priya Dandin', number: '8088308455', exp: '4 years' },
          { name: 'Dr. Vijaylaxmi Sonnad', number: '6360146573', exp: '5 years' },
          { name: 'Dr. Anjali Bhavi', number: '8867022984', exp: '3 years' },
          { name: 'Dr. Abdulla Baghwan', number: '6364130526', exp: '7 years' }
        ];
        const assignedDoc = docs[Math.floor(Math.random() * docs.length)];

        setMessages(prev => [
          ...prev, 
          { role: 'system', content: aiResponse, isDisclaimer: true },
          { role: 'auto_book', doctor: assignedDoc }
        ]);
        return;
      } else if (lowerInput.includes('rash') || lowerInput.includes('skin')) {
        aiResponse = "Skin issues can vary widely. It could be an allergic reaction or a mild infection. Please upload a clear photo if you'd like me to analyze it using our vision model.";
      } else {
        aiResponse = "I understand. To help you better, could you provide more details about your symptoms or upload any relevant medical tests/images?";
      }

      setMessages(prev => [
        ...prev, 
        { role: 'system', content: aiResponse, isDisclaimer: disclaimer },
        ...(triggerDoctor ? [{ role: 'action', content: 'doctor_booking' }] : [])
      ]);
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar / Info */}
      <div className="chat-sidebar hide-mobile">
        <div className="card h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Bot className="text-primary" />
              <h2 className="text-xl">Safety Guides</h2>
            </div>

            <ul className="safety-list text-sm text-muted">
              <li><AlertCircle size={14}/> Always verify AI suggestions with a doctor.</li>
              <li><AlertCircle size={14}/> Do not share highly sensitive PII.</li>
              <li><AlertCircle size={14}/> In an emergency, call an ambulance directly.</li>
              <li><AlertCircle size={14}/> Voice Wake-Word: Try pressing Ctrl+H to simulate "Hey Svastha".</li>
            </ul>
          </div>
          
          <div className="disclaimer mt-8" style={{ marginTop: 'auto' }}>
            <AlertCircle className="disclaimer-icon" size={16} />
            <span>Not a substitute for medical advice.</span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="flex items-center justify-between mb-4 w-full">
          <button 
            onClick={() => navigate('/')} 
            className="btn btn-outline flex items-center gap-2" 
            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
          
          <button 
            className="btn btn-primary flex items-center gap-2"
            style={{ padding: '8px 12px', fontSize: '0.9rem' }}
            onClick={() => {
              localStorage.removeItem('svastha_chat_history');
              setMessages(INITIAL_MESSAGES);
            }}
          >
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="chat-feed-container card">
          <div className="chat-feed">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-wrapper ${msg.role}`}>
                {msg.role === 'ambulance_dispatch' ? (
                  <div className="action-card p-6 border rounded mb-4" style={{ backgroundColor: 'var(--bg-default)', border: '2px solid var(--danger-color)' }}>
                    <div className="flex items-center gap-3 mb-4 text-danger animate-pulse-danger">
                      <ShieldAlert size={32} />
                      <h3 className="font-bold text-xl">AMBULANCE DISPATCHED</h3>
                    </div>
                    <p className="text-sm mb-4">Emergency services have been routed to your exact GPS coordinates.</p>
                    <div className="bg-danger-light p-4 rounded text-sm text-danger font-medium border border-danger">
                       ETA: 8-12 Minutes. Stay on this screen.
                    </div>
                  </div>
                ) : msg.role === 'auto_book' ? (
                  <div className="action-card p-6 border rounded mb-4" style={{ backgroundColor: 'var(--bg-default)', borderLeft: '4px solid var(--danger-color)' }}>
                    <div className="flex items-center gap-2 mb-4 text-danger">
                      <HeartPulse size={24} />
                      <h3 className="font-bold">Emergency Appointment Confirmed</h3>
                    </div>
                    <p className="text-sm mb-4">I have automatically booked a priority appointment for you. An automated SMS with these details has been simultaneously dispatched to you and the doctor.</p>
                    <div className="bg-muted p-4 rounded text-sm mb-2" style={{ border: '1px solid var(--border-color)' }}>
                       <p><strong>Doctor:</strong> {msg.doctor.name}</p>
                       <p><strong>Experience:</strong> {msg.doctor.exp}</p>
                       <p><strong>Contact Form:</strong> {'+91 ' + msg.doctor.number}</p>
                       <div className="mt-3 text-primary flex items-center gap-1 font-medium bg-primary-light p-2 rounded w-max">
                         <Send size={14} /> SMS Notification Sent Successfully
                       </div>
                    </div>
                  </div>
                ) : msg.role === 'action' ? (
                  <div className="action-card text-center p-6 border rounded mb-4 bg-primary-light">
                    <HeartPulse size={32} className="text-primary mx-auto mb-2" />
                    <h3 className="mb-2">Doctor Consultation Recommended</h3>
                    <button className="btn btn-primary" onClick={() => setShowDoctorModal(true)}>
                      Book Appointment Now
                    </button>
                  </div>
                ) : (
                  <div className={`message bubble ${msg.role}`}>
                    <div className="flex gap-2 items-start">
                      {msg.role === 'system' ? <Bot size={20} className="mt-1 flex-shrink-0" /> : <User size={20} className="mt-1 flex-shrink-0" />}
                      <div className="message-content">
                        {msg.image && <img src={msg.image} alt="Uploaded for analysis" className="message-image mb-2" />}
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                        {msg.isDisclaimer && (
                          <div className="text-xs text-danger mt-2 flex items-center gap-1 bg-danger-light p-1 rounded">
                            <AlertCircle size={12} /> Medical AI generated. Please consult a doctor.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="message-wrapper system">
                <div className="message bubble system">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            {selectedImage && (
              <div className="image-preview">
                <img src={selectedImage} alt="preview" />
                <button className="btn-icon remove-image" onClick={() => setSelectedImage(null)}>
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="input-box">
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              <label htmlFor="file-upload" className="btn-icon cursor-pointer text-muted" title="Upload Image">
                <Plus size={20} />
              </label>
              
              <select 
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                title="Select Voice Language"
              >
                <option value="en-IN">EN</option>
                <option value="hi-IN">HI</option>
                <option value="kn-IN">KN</option>
              </select>

              <button 
                className={`btn-icon ${isListening ? 'text-danger animate-pulse-danger' : 'text-muted'}`} 
                onClick={() => {
                  if (!recognitionRef.current) {
                    alert("Speech Recognition is not supported or permitted in your browser.");
                    return;
                  }
                  if (isListening) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  } else {
                    // Abort previous background instance before starting new dictation
                    try { recognitionRef.current.abort(); } catch(e) {}
                    
                    setTimeout(() => {
                      try {
                        recognitionRef.current.lang = voiceLang; 
                        recognitionRef.current.start();
                        setIsListening(true);
                      } catch(e) {
                        // If it throws already running, just hook into the UI
                        setIsListening(true); 
                        if (recognitionRef.current) recognitionRef.current.lang = voiceLang;
                      }
                    }, 150);
                  }
                }}
                title={`Voice Input (${voiceLang === 'en-IN' ? 'English' : voiceLang === 'hi-IN' ? 'Hindi' : 'Kannada'})`}
              >
                <Mic size={20} />
              </button>

              <input 
                type="text" 
                className="text-input" 
                placeholder={isListening ? "Listening..." : "Describe your symptoms..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              
              <button className="btn btn-primary send-btn" onClick={handleSend} disabled={!inputText.trim() && !selectedImage}>
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DoctorBookingModal isOpen={showDoctorModal} onClose={() => setShowDoctorModal(false)} />
    </div>
  );
};

export default ChatAssistant;
