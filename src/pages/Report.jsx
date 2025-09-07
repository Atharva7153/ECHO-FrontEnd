import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import './Report.css';
import { FaUpload, FaMapMarkerAlt, FaListAlt, FaExclamationTriangle, FaCamera } from 'react-icons/fa';

export default function Report(){
  const [title,setTitle]=useState(''), [desc,setDesc]=useState(''), [loc,setLoc]=useState('');
  const [category,setCategory]=useState('General');
  const [urgency,setUrgency]=useState('Low');
  const [loadingAI, setLoadingAI] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  async function analyzeDesc(descText) {
    setLoadingAI(true);
    try {
      const res = await api.post('/ai/gemini', { text: descText });
      setCategory(res.data.category || 'General');
      setUrgency(res.data.urgency || 'Low');
    } catch{}
    setLoadingAI(false);
  }

  function handleDescChange(e) {
    setDesc(e.target.value);
    if (e.target.value.length > 10) analyzeDesc(e.target.value);
  }

  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_API_URL, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url;
  }

  async function handleFilesChange(e) {
    setMediaFiles([...e.target.files]);
  }

  async function submit(e){
    e.preventDefault();
    setUploading(true);
    let mediaURLs = [];
    for (let file of mediaFiles) {
      const url = await uploadToCloudinary(file);
      mediaURLs.push(url);
    }
    setUploading(false);
    try {
      await api.post('/issues', {
        title,
        description: desc,
        media: mediaURLs,
        locationText: loc,
        category,
        urgency
      });
      alert('Reported! +10 points');
      nav('/');
    } catch(err){ alert(err.response?.data?.error || err.message); }
  }

  return (
    <div className="report-bg">
      <form className="report-form-glass" onSubmit={submit}>
        <h2 className="report-title">
          <FaUpload style={{marginRight:8}} /> Report a Civic Issue
        </h2>
        <div className="report-field">
          <input
            className="report-input"
            placeholder="Title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            required
          />
        </div>
        <div className="report-field">
          <textarea
            className="report-input"
            placeholder="Describe the issue"
            value={desc}
            onChange={handleDescChange}
            rows={3}
            required
          />
          {loadingAI && <span className="ai-analyzing">Analyzing...</span>}
        </div>
        <div className="report-field">
          <label className="report-label">
            <FaCamera style={{marginRight:6}} /> Upload Images/Videos
          </label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFilesChange}
            className="report-input"
          />
          {uploading && <span className="ai-analyzing">Uploading media...</span>}
        </div>
        <div className="report-field">
          <input
            className="report-input"
            placeholder="Location (address or landmark)"
            value={loc}
            onChange={e=>setLoc(e.target.value)}
            required
          />
        </div>
        <div className="report-row">
          <div className="report-field">
            <label className="report-label"><FaListAlt style={{marginRight:4}} /> Department</label>
            <select className="report-input" value={category} onChange={e=>setCategory(e.target.value)}>
              <option>General</option>
              <option>Road/Pothole</option>
              <option>Sewage/Water</option>
              <option>Garbage</option>
            </select>
          </div>
          <div className="report-field">
            <label className="report-label"><FaExclamationTriangle style={{marginRight:4}} /> Urgency</label>
            <select className="report-input" value={urgency} onChange={e=>setUrgency(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <button className="btn-report-modern" disabled={uploading}>
          <FaUpload style={{marginRight:6}} /> Submit
        </button>
      </form>
    </div>
  );
}
