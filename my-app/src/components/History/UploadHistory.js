import React from 'react';
import './UploadHistory.css';

const UploadHistory = ({ history, onSelectItem, onDeleteItem }) => {
  if (!history || history.length === 0) {
    return (
      <div className="upload-history">
        <h3>Recent Uploads</h3>
        <p className="no-history">No recent uploads found.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
  <div className="upload-history">
    <h3>Recent Uploads</h3>
    <ul className="history-list">
      {history.map((item) => (
        <li key={item.id} className="history-item">
          <div className="history-item-header">
            <span className={`status-indicator ${item.threatLevel.toLowerCase()}`}>
              {item.threatLevel === 'Low' ? '✅' : '⚠️'}
            </span>
            <span className="file-name">{item.fileName}</span>
            <span className="timestamp">{formatDate(item.timestamp)}</span>
          </div>
          <div className="history-item-actions">
          <button className="view-btn" onClick={() => onSelectItem(item)}>View Report</button>
            <button className="delete-btn" onClick={() => onDeleteItem(item.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);}
export default UploadHistory;
