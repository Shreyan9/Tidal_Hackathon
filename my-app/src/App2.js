import React, { useState, useEffect } from 'react';
import './App.css';
import ScamReport from './components/ScamAnalysis/ScamReport';
import VoiceRecorder from './components/VoiceRecorder/VoiceRecorder';
import UploadHistory from './components/History/UploadHistory';
import ScamEducation from './components/Education/ScamEducation';

import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import Profile from './components/Auth/profile';
function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNewAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    setUploadHistory((prev) => [analysis, ...prev.slice(0, 4)]);
  };

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="auth-buttons">
        <LoginButton />
        <LogoutButton />
        <Profile />
      </div>

      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <header className="App-header">
        <h1>Post-Call Scam Forensics</h1>
        <p>Protect yourself from scam calls with AI-powered analysis and verification</p>
      </header>

      <main className="App-main">
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">Analyze Your Calls for Potential Scams</h2>
            <p className="hero-description">
              Our advanced AI technology can detect scam indicators in your voicemails and call recordings.
              Simply upload an audio file or record a call to get instant analysis and protection.
            </p>
            <div className="upload-section">
              <VoiceRecorder onAnalysisComplete={handleNewAnalysis} />
            </div>
          </div>
        </section>

        {currentAnalysis && (
          <section className="result-section">
            <ScamReport analysis={currentAnalysis} />
          </section>
        )}

        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">AI-Powered Analysis</h3>
            <p className="feature-description">
              Our advanced algorithms analyze call patterns, language, and known scam indicators to identify potential threats.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3 className="feature-title">Real-time Protection</h3>
            <p className="feature-description">
              Get instant feedback on whether a call is legitimate or potentially fraudulent with our threat scoring system.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3 className="feature-title">Call History</h3>
            <p className="feature-description">
              Keep track of your analyzed calls and access previous scam reports to stay informed about potential threats.
            </p>
          </div>
        </section>

        <div className="app-features">
          <div className="history-section">
            <UploadHistory history={uploadHistory} onSelectItem={setCurrentAnalysis} />
          </div>
          <div className="education-section">
            <ScamEducation />
          </div>
        </div>

        <section className="cta-section">
          <h2>Stay Protected from Scams</h2>
          <p>Our tool helps you identify and avoid potential scams before they can cause harm.</p>
          <button className="cta-button">Learn More About Scam Prevention</button>
        </section>
      </main>

      <footer>
        <p>© 2023 Post-Call Scam Forensics | Protecting users from scams one call at a time</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
