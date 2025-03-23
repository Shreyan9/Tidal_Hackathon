from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import whisper
import time
import json
import os
import shutil

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Whisper ONCE (use 'tiny' for fast)
model = whisper.load_model("tiny")

# Scam patterns
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

# Analysis route
@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        # Save uploaded audio temporarily
        temp_path = f"uploads/{int(time.time())}_{file.filename}"
        os.makedirs("uploads", exist_ok=True)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Transcribe
        result = model.transcribe(temp_path)
        transcript = result['text'].strip().lower()

        # Match scam signals
        matched_keywords = [kw for kw in SCAM_KEYWORDS if kw in transcript]
        matched_urgency = [up for up in URGENCY_PHRASES if up in transcript]
        matched_commands = [cp for cp in COMMAND_PHRASES if cp in transcript]

        indicators = []
        if matched_keywords:
            indicators.append("Scam keywords: " + ", ".join(matched_keywords))
        if matched_urgency:
            indicators.append("Urgency phrases: " + ", ".join(matched_urgency))
        if matched_commands:
            indicators.append("Suspicious commands: " + ", ".join(matched_commands))

        score = len(matched_keywords) * 10 + len(matched_urgency) * 15 + len(matched_commands) * 10
        scam_score = max(0, min(100, score))

        if scam_score >= 75:
            threat_level = "High"
        elif scam_score >= 40:
            threat_level = "Medium"
        else:
            threat_level = "Low"

        report = {
            "id": str(int(time.time())),
            "fileName": file.filename,
            "timestamp": time.strftime('%Y-%m-%d %H:%M:%S'),
            "threatLevel": threat_level,
            "scamScore": scam_score,
            "transcript": transcript,
            "indicators": indicators or ["No major scam indicators detected."],
            "matchedPatterns": list(set(matched_keywords + matched_urgency + matched_commands)),
            "audioUrl": ""  # Frontend sets this
        }

        os.remove(temp_path)
        return report

    except Exception as e:
        return {"error": str(e)}
