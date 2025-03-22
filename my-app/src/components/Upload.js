import { useState } from "react";
import axios from "axios";
import styles from "./Upload.module.css"; // Import CSS module

export default function Upload() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [safetyScore, setSafetyScore] = useState(null);

  const handleFileChange = (event) => setFile(event.target.files[0]);

  const handleAnalyze = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("transcript", transcript);

    const response = await axios.post("http://127.0.0.1:5000/analyze", formData);
    setSafetyScore(response.data.safetyScore);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Voicemail</h2>
      <input type="file" accept="audio/*" onChange={handleFileChange} className={styles.input} />
      <textarea
        className={styles.textarea}
        placeholder="Or enter transcript"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />
      <button className={styles.button} onClick={handleAnalyze}>
        Analyze Voicemail
      </button>
      {safetyScore !== null && (
        <div className={styles.result}>
          <p>Safety Score: {safetyScore}/100</p>
        </div>
      )}
    </div>
  );
}
