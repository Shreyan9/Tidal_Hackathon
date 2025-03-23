from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import time
import os
import shutil
import uuid
import librosa
import numpy as np
import soundfile as sf

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper model
model = whisper.load_model("tiny")

# Scam pattern lists
SCAM_KEYWORDS = [
    'bank', 'urgent', 'verify', 'account', 'suspicious', 'locked',
    'payment', 'fraud', 'claim', 'refund', 'expired', 'illegal activity',
    'investigation', 'security alert', 'unauthorized', 'call back', 'gift card'
]
URGENCY_PHRASES = [
    'act now', 'immediately', 'within 24 hours', 'as soon as possible',
    'this is your final notice', 'do not ignore', 'time sensitive'
]
COMMAND_PHRASES = [
    'press 1', 'provide your details', 'speak to an agent', 'enter your pin',
    'send payment', 'confirm your identity'
]

# Analyze tone (pitch + energy)
def analyze_tone(filepath):
    y, sr = librosa.load(filepath, sr=None)
    energy = np.mean(np.abs(y))
    pitch = librosa.yin(y, fmin=80, fmax=500, sr=sr)
    avg_pitch = np.mean(pitch)

    tone_score = 0
    tone_indicator = "Calm tone detected."

    if avg_pitch > 200 or energy > 0.1:
        tone_score = 5  # modifier
        tone_indicator = "High pitch or urgency detected in tone."

    return tone_score, tone_indicator

# Analyze transcript logic
def analyze_transcript(text: str):
    matched_keywords = [kw for kw in SCAM_KEYWORDS if kw in text]
    matched_urgency = [up for up in URGENCY_PHRASES if up in text]
    matched_commands = [cp for cp in COMMAND_PHRASES if cp in text]

    indicators = []
    if matched_keywords:
        indicators.append("Scam keywords: " + ", ".join(matched_keywords))
    if matched_urgency:
        indicators.append("Urgency phrases: " + ", ".join(matched_urgency))
    if matched_commands:
        indicators.append("Suspicious commands: " + ", ".join(matched_commands))

    score = len(matched_keywords) * 10 + len(matched_urgency) * 15 + len(matched_commands) * 10
    scam_score = max(0, min(100, score))

    return scam_score, indicators, matched_keywords + matched_urgency + matched_commands

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        filename = f"{uuid.uuid4()}_{file.filename}"
        filepath = os.path.join(upload_dir, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Transcribe audio
        result = model.transcribe(filepath)
        transcript = result['text'].strip().lower()

        # Analyze transcript
        scam_score, indicators, matched_patterns = analyze_transcript(transcript)

        # Analyze tone
        tone_modifier, tone_comment = analyze_tone(filepath)
        indicators.append(tone_comment)

        # Final scam score
        final_score = min(100, scam_score + tone_modifier)

        # Set threat level
        if final_score >= 75:
            threat_level = "High"
        elif final_score >= 40:
            threat_level = "Medium"
        else:
            threat_level = "Low"

        # Audio metadata
        try:
            y, sr = librosa.load(filepath, sr=None)
            duration = len(y) / sr
        except:
            duration = None
            sr = None

        file_size_kb = round(os.path.getsize(filepath) / 1024, 2)

        report = {
            "id": str(uuid.uuid4()),
            "fileName": file.filename,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "threatLevel": threat_level,
            "scamScore": final_score,
            "transcript": transcript,
            "indicators": indicators,
            "matchedPatterns": list(set(matched_patterns)),
            "audioMeta": {
                "duration_sec": round(duration, 2) if duration else None,
                "sample_rate": sr,
                "file_size_kb": file_size_kb
            },
            "audioUrl": ""  # Set by frontend
        }

        os.remove(filepath)
        return report

    except Exception as e:
        return {"error": str(e)}
