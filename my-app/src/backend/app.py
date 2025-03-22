from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
import requests

app = Flask(__name__)

# Set up directory for saving uploaded files
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg', 'flac'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Function to check if file extension is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to simulate scam analysis (this would be more complex in a real-world app)
def analyze_voicemail(file_path, transcript):
    # Simulate analyzing the file (this is where the scam detection logic will go)
    safety_score = 0
    if transcript and "bank" in transcript.lower():
        safety_score += 30  # Detecting keywords like "bank" may increase the risk of scam
    if file_path:
        # For real implementation, this would involve audio processing and machine learning
        safety_score += 50  # Placeholder for file analysis

    # Simulate checking a public database for scam reports
    # Here we assume the number in the voicemail or transcript is identified as a scam number
    scam_reports_url = "https://api.scam-report-database.com/check"
    response = requests.post(scam_reports_url, json={"number": "1234567890"})
    if response.json().get("scamReports") > 50:
        safety_score += 20  # Add points for known scam number

    return safety_score

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files and 'transcript' not in request.form:
        return jsonify({"error": "No file or transcript provided"}), 400

    file = request.files.get('file')
    transcript = request.form.get('transcript', "")

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Analyze the voicemail
        safety_score = analyze_voicemail(file_path, transcript)

        return jsonify({"safetyScore": safety_score})
    else:
        return jsonify({"error": "Invalid file format"}), 400

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True, host="0.0.0.0", port=5000)
CORS(app)