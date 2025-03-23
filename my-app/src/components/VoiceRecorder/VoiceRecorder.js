import React, { useState, useRef } from 'react';
import './VoiceRecorder.css';

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
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setFileName(file.name);
    }
  };

  const handleAnalyze = async () => {
    if (!audioURL) return;

    setIsAnalyzing(true);

    try {
      const audioBlob = await fetch(audioURL).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', audioBlob, fileName); // Field name must be "file"

      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      result.audioUrl = audioURL;

      if (onAnalysisComplete) onAnalysisComplete(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      alert('Failed to analyze audio. Please try again.');
    }

    setIsAnalyzing(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      {!audioURL && !isRecording && (
        <div className="recorder-actions">
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

      {isRecording && (
        <div className="recording-container">
          <button className="action-button recording" onClick={stopRecording}>
            <span className="button-icon">■</span>
            Stop Recording ({formatTime(recordingTime)})
          </button>
        </div>
      )}

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
