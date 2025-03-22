import React, { useState } from 'react';
import './VerificationTool.css';

const VerificationTool = ({ analysis }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const sources = [
    { id: 'bank', name: 'Banking Institution', icon: '🏦' },
    { id: 'telecom', name: 'Telecom Provider', icon: '📱' },
    { id: 'government', name: 'Government Agency', icon: '🏛️' },
    { id: 'social', name: 'Social Media', icon: '📱' }
  ];

  const handleVerify = () => {
    if (!selectedSource || !analysis) return;
    
    setIsVerifying(true);
    
    // Simulate API call to verify with official source
    setTimeout(() => {
      // For demo purposes, we'll randomly determine if it's verified or not
      // In a real app, this would be an actual API call to verify the content
      const isVerified = Math.random() > 0.5;
      
      setVerificationResult({
        verified: isVerified,
        source: sources.find(s => s.id === selectedSource),
        details: isVerified 
          ? "This communication has been verified as legitimate." 
          : "This communication could not be verified with the official source. It may be fraudulent."
      });
      
      setIsVerifying(false);
    }, 1500);
  };

  if (!analysis) {
    return (
      <div className="verification-tool">
        <h3>Verify with Official Sources</h3>
        <p>Upload or record a call to verify its authenticity with official sources.</p>
      </div>
    );
  }

  return (
    <div className="verification-tool">
      <h3>Verify with Official Sources</h3>
      
      <div className="verification-options">
        {sources.map(source => (
          <div 
            key={source.id}
            className={`verification-option ${selectedSource === source.id ? 'selected' : ''}`}
            onClick={() => setSelectedSource(source.id)}
          >
            <span>{source.icon}</span>
            <span>{source.name}</span>
          </div>
        ))}
      </div>
      
      <button 
        className="verify-button"
        onClick={handleVerify}
        disabled={!selectedSource || isVerifying}
      >
        {isVerifying ? 'Verifying...' : 'Verify with Selected Source'}
      </button>
      
      {verificationResult && (
        <div className="verification-result">
          <div className={`verification-status ${verificationResult.verified ? 'verified' : 'not-verified'}`}>
            <span>{verificationResult.verified ? '✅' : '❌'}</span>
            <span>
              {verificationResult.verified 
                ? 'Verified with official source' 
                : 'Not verified with official source'}
            </span>
          </div>
          
          <div className="verification-details">
            <p><strong>Source:</strong> {verificationResult.source.icon} {verificationResult.source.name}</p>
            <p>{verificationResult.details}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationTool;
