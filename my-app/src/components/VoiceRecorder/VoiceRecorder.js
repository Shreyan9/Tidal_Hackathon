import React, { useState, useRef } from 'react';
import './VoiceRecorder.css'; // Import the matching CSS

const VoiceRecorder = ({ onAnalysisComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileInputRef = useRef(null);

  // ─────────────────────────────────────────────────────────────
  // 1. START RECORDING
  // ─────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setFileName(`Recording_${new Date().toISOString().slice(0, 10)}.wav`);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. STOP RECORDING
  // ─────────────────────────────────────────────────────────────
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      setIsRecording(false);

      // Clear timer
      clearInterval(timerRef.current);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3. HANDLE FILE UPLOAD
  // ─────────────────────────────────────────────────────────────
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setFileName(file.name);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 4. ANALYZE AUDIO
  // ─────────────────────────────────────────────────────────────
  const handleAnalyze = () => {
    if (!audioURL) return;

    setIsAnalyzing(true);

    // Simulate analysis with a timeout
    setTimeout(() => {
      // Mock analysis result
      const mockAnalysis = {
        id: Date.now().toString(),
        fileName: fileName,
        timestamp: new Date().toISOString(),
        threatLevel: Math.random() > 0.5 ? 'High' : 'Low',
        scamProbability: Math.floor(Math.random() * 100),
        transcript: "Hello, this is your bank calling about suspicious activity...",
        indicators: [
          'Urgency tactics',
          'Requesting personal information',
          'Impersonating a financial institution'
        ],
        audioURL: audioURL
      };

      // Pass the result back up
      if (onAnalysisComplete) {
        onAnalysisComplete(mockAnalysis);
      }

      setIsAnalyzing(false);
    }, 2000);
  };

  // ─────────────────────────────────────────────────────────────
  // 5. FORMAT RECORDING TIME
  // ─────────────────────────────────────────────────────────────
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ─────────────────────────────────────────────────────────────
  // 6. RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="voice-recorder">
      {/* 6A. DEFAULT: SHOW BOTH UPLOAD + RECORD BUTTONS */}
      {!audioURL && !isRecording && (
        <div className="recorder-actions">
          {/* Hidden file input for 'Upload Audio' */}
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />

          <button
            className="action-button upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            <span className="button-icon">📁</span>
            Upload Audio
          </button>

          <button
            className="action-button record-button"
            onClick={startRecording}
          >
            <span className="button-icon">🎙️</span>
            Record Audio
          </button>
        </div>
      )}

      {/* 6B. IF RECORDING, SHOW 'STOP' BUTTON */}
      {isRecording && (
        <div className="recording-container">
          <button className="action-button recording" onClick={stopRecording}>
            <span className="button-icon">■</span>
            Stop Recording ({formatTime(recordingTime)})
          </button>
        </div>
      )}

      {/* 6C. IF AUDIO IS SET, SHOW PREVIEW & ANALYSIS */}
      {audioURL && (
        <div className="audio-preview">
          <p>{fileName}</p>
          <audio src={audioURL} controls />
          <div className="preview-actions">
            <button
              className="action-button analyze-button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
            </button>

            <button
              className="action-button cancel-button"
              onClick={() => {
                setAudioURL(null);
                setFileName('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
