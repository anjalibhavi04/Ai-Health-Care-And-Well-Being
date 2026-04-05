import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatAssistant from './pages/ChatAssistant';
import DoctorDirectory from './pages/DoctorDirectory';
import DoctorDashboard from './pages/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import OnboardingIdentity from './pages/OnboardingIdentity';
import OnboardingContact  from './pages/OnboardingContact';
import OnboardingMedical  from './pages/OnboardingMedical';
import OnboardingLifestyle from './pages/OnboardingLifestyle';
import OnboardingEmergency from './pages/OnboardingEmergency';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes — no Navbar */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Onboarding routes — no Navbar */}
          <Route path="/onboarding/identity" element={<OnboardingIdentity />} />
          <Route path="/onboarding/contact"  element={<OnboardingContact  />} />
          <Route path="/onboarding/medical"  element={<OnboardingMedical  />} />
          <Route path="/onboarding/lifestyle" element={<OnboardingLifestyle />} />
          <Route path="/onboarding/emergency" element={<OnboardingEmergency />} />

          <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />

          {/* Main app routes — with Navbar */}
          <Route path="/*" element={
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/"     element={<Home />} />
                  <Route path="/chat" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
                  <Route path="/doctors" element={<ProtectedRoute><DoctorDirectory /></ProtectedRoute>} />
                </Routes>
              </main>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
