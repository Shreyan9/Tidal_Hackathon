import React, { useState, useEffect } from 'react';
import './App.css';
import ScamReport from './components/ScamAnalysis/ScamReport';
import VoiceRecorder from './components/VoiceRecorder/VoiceRecorder';
import UploadHistory from './components/History/UploadHistory';
import ScamEducation from './components/Education/ScamEducation';
import ChatWidget from './components/chatwidget'; 
import LoginButton from './components/Auth/LoginButton';
import LogoutButton from './components/Auth/LogoutButton';
import Profile from './components/Auth/profile';
import ChatWidget from './components/chatwidget'; // ✅ Import Chatbot


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
    const newAnalysis = {
      ...analysis,
      id: Date.now(), // for unique tracking
      fileName: analysis.fileName || `Recording_${new Date().toISOString().slice(0, 10)}.wav`,
      timestamp: new Date().toISOString()
    };
    
    setCurrentAnalysis(newAnalysis);
    setUploadHistory(prev => [newAnalysis, ...prev.slice(0, 4)]);
  };
  const handleDeleteAnalysis = (id) => {
    setUploadHistory(prev => prev.filter(item => item.id !== id));
    // Optional: clear currentAnalysis if it's the one deleted
    if (currentAnalysis && currentAnalysis.id === id) {
      setCurrentAnalysis(null);
    }
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
        <div className="auth-buttons">
        <LoginButton />
        <LogoutButton />
        <Profile />
        </div>


    
    <div className="App">
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <header className="App-header">
        <h1>VoiceLock AI</h1>
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

        <div className="centered-history-wrapper">
          <UploadHistory 
            history={uploadHistory} 
            onSelectItem={setCurrentAnalysis} 
            onDeleteItem={handleDeleteAnalysis}
          />
        </div>

        

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
          <a 
            className="cta-button" 
            href="https://www.fcc.gov/consumers/guides/stop-unwanted-robocalls-and-texts" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Learn More About Scam Prevention
          </a>
        </section>


        <section id="contact" className="contact-section">
          <h2>Contact Us</h2>
          <p>Have questions, suggestions, or feedback? We’d love to hear from you.</p>
          
          <form 
            action="https://formspree.io/f/xnnpdvrj" 
            method="POST"
            className="contact-form"
          >
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              rows="5" 
              required 
            ></textarea>
            <button type="submit" className="cta-button">Send Message</button>
          </form>
        </section>


        </section>


        <section id="contact" className="contact-section">
          <h2>Contact Us</h2>
          <p>Have questions, suggestions, or feedback? We’d love to hear from you.</p>
          
          <form 
            action="https://formspree.io/f/xnnpdvrj" 
            method="POST"
            className="contact-form"
          >
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
            />
            <textarea 
              name="message" 
              placeholder="Your Message" 
              rows="5" 
              required 
            ></textarea>
            <button type="submit" className="cta-button">Send Message</button>
          </form>
        </section>


      </main>

      <footer style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gray)' }}>
        <p>© 2025 VoiceLock AI | Protecting users from scams one call at a time</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          
        </div>
      </footer>

      {/* ✅ Add Chat Widget Here */}
      <ChatWidget />


    </div>

    </div>
  );
}

export default App;