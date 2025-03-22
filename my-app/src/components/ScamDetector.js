import React, { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ScamDetector.css';

const ScamDetector = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await analyzeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please ensure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeAudio = async (audioBlob) => {
    setLoading(true);
    try {
      // Convert audio to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        
        // Use Gemini AI to analyze the audio
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const prompt = "Analyze this audio and determine if it's likely an AI-generated voice or a human voice. Consider factors like natural pauses, intonation, and speech patterns. Provide a confidence score and explanation.";
        
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "audio/wav",
              data: base64Audio
            }
          }
        ]);

        const response = await result.response;
        setResult(response.text());
      };
    } catch (error) {
      console.error('Error analyzing audio:', error);
      setResult('Error analyzing audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scam-detector">
      <h1>AI Voice Scam Detector</h1>
      <div className="controls">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`record-button ${isRecording ? 'recording' : ''}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analyzing audio...</p>
        </div>
      )}
      
      {result && (
        <div className="result">
          <h2>Analysis Result:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ScamDetector; 