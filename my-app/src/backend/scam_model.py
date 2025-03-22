# backend/scam_model.py
import sys
import json
import time
import whisper

# Load model once
model = whisper.load_model("base")

# 1. Load audio + transcribe
audio_path = sys.argv[1]
result = model.transcribe(audio_path)
transcript = result['text'].strip()

# 2. Basic scam keyword detection (can be replaced with LLM classifier)
scam_keywords = ['bank', 'urgent', 'verify', 'account', 'suspicious', 'locked', 'payment', 'fraud']
matches = [kw for kw in scam_keywords if kw.lower() in transcript.lower()]
indicators = []

if matches:
    indicators.append("Detected suspicious keywords: " + ', '.join(matches))
    threat_level = "High"
    scam_score = 36 + (len(matches) * 8)  # crude rule-based score
else:
    threat_level = "Low"
    scam_score = 10

scam_score = max(0, min(100, scam_score))

# 3. Output JSON to stdout
output = {
    "id": str(int(time.time())),
    "fileName": audio_path.split('/')[-1],
    "timestamp": str(time.strftime('%Y-%m-%d %H:%M:%S')),
    "threatLevel": threat_level,
    "scamScore": scam_score,
    "transcript": transcript,
    "indicators": indicators,
    "matchedPatterns": matches,
    "audioUrl": ""  # frontend sets this after upload
}

print(json.dumps(output))
