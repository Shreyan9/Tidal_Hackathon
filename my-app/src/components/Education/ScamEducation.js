import React, { useState } from 'react';
import './ScamEducation.css';

const ScamEducation = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Mock data for scam trends
  const scamTrends = [
    {
      id: 1,
      title: "Banking Verification Scams",
      description: "Scammers pose as bank representatives claiming suspicious activity on your account, asking you to verify personal information."
    },
    {
      id: 2,
      title: "Government Impersonation",
      description: "Callers claim to be from tax agencies or law enforcement, threatening legal action unless immediate payment is made."
    },
    {
      id: 3,
      title: "Tech Support Fraud",
      description: "Scammers claim your computer has a virus and offer to fix it remotely for a fee, often gaining access to your personal data."
    },
    {
      id: 4,
      title: "Package Delivery Scams",
      description: "Calls about a package delivery issue requiring payment or personal information to release a non-existent package."
    },
    {
      id: 5,
      title: "Utility Company Scams",
      description: "Threats to disconnect your electricity, water, or gas unless immediate payment is made via gift cards or wire transfer."
    }
  ];

  // Prevention tips
  const preventionTips = [
    "Never share personal information with unexpected callers, even if they seem legitimate.",
    "Hang up and call the official number of the organization to verify if the call was legitimate.",
    "Be suspicious of callers creating urgency or threatening consequences if you don't act immediately.",
    "Use call blocking features on your phone for known scam numbers.",
    "Register your number with the National Do Not Call Registry to reduce legitimate telemarketing calls."
  ];

  // External resources
  const externalResources = [
    {
      name: "Federal Trade Commission (FTC) Scam Alerts",
      url: "https://www.consumer.ftc.gov/features/scam-alerts",
      icon: "🔔"
    },
    {
      name: "FBI Internet Crime Complaint Center (IC3)",
      url: "https://www.ic3.gov",
      icon: "🚨"
    },
    {
      name: "AARP Fraud Resource Center",
      url: "https://www.aarp.org/money/scams-fraud/",
      icon: "🛡️"
    },
    {
      name: "Better Business Bureau Scam Tracker",
      url: "https://www.bbb.org/scamtracker",
      icon: "🔍"
    }
  ];

  return (
    <div className="scam-education">
      <h3 onClick={toggleExpand}>
        Scam Education Zone
        <span>{isExpanded ? '▼' : '▶'}</span>
      </h3>
      
      <div className={`education-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="scam-trends">
          <h4>Top Scam Trends This Month</h4>
          {scamTrends.map(trend => (
            <div key={trend.id} className="trend-item">
              <h4>{trend.title}</h4>
              <p>{trend.description}</p>
            </div>
          ))}
        </div>
        
        <div className="prevention-tips">
          <h4>Prevention Tips</h4>
          {preventionTips.map((tip, index) => (
            <div key={index} className="tip-item">
              <span className="tip-icon">✓</span>
              <div className="tip-text">{tip}</div>
            </div>
          ))}
        </div>
        
        <div className="external-resources">
          <h4>External Resources</h4>
          <ul className="resource-list">
            {externalResources.map((resource, index) => (
              <li key={index}>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  <span className="resource-icon">{resource.icon}</span>
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
          <a href="https://www.consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="learn-more-button">
            Learn More About Scam Prevention
          </a>
        </div>
      </div>
    </div>
  );
};

export default ScamEducation;
