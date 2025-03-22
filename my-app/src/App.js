import React, { useState, useEffect } from 'react';
import './App.css';
import ScamReport from './components/ScamAnalysis/ScamReport';
import VoiceRecorder from './components/VoiceRecorder/VoiceRecorder';
import UploadHistory from './components/History/UploadHistory';
import ScamEducation from './components/Education/ScamEducation';

function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNewAnalysis = (analysis) => {
    setCurrentAnalysis(analysis);
    // Add to history
    setUploadHistory(prev => [analysis, ...prev.slice(0, 4)]);
  };

  if (isLoading) {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
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
            <UploadHistory 
              history={uploadHistory} 
              onSelectItem={setCurrentAnalysis} 
            />
          </div>
          
          <div className="education-section">
            <ScamEducation />
          </div>
        </div>
        
        <section className="cta-section" style={{ textAlign: 'center', marginTop: '40px' }}>
          <h2>Stay Protected from Scams</h2>
          <p>Our tool helps you identify and avoid potential scams before they can cause harm.</p>
          <button className="cta-button">
            Learn More About Scam Prevention
          </button>
        </section>
      </main>
      
      <footer style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gray)' }}>
        <p>© 2023 Post-Call Scam Forensics | Protecting users from scams one call at a time</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a>
          <a href="#" style={{ color: 'var(--primary)' }}>Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

export default App;