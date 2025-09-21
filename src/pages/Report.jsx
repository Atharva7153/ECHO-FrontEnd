import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_URL } from '../cloudinaryConfig';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Report.css';
import { FaUpload, FaMapMarkerAlt, FaListAlt, FaExclamationTriangle, FaCamera, FaSearch, FaLocationArrow } from 'react-icons/fa';

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function Report(){
  const [title,setTitle]=useState(''), [desc,setDesc]=useState(''), [loc,setLoc]=useState('');
  const [category,setCategory]=useState('General');
  const [urgency,setUrgency]=useState('Low');
  const [loadingAI, setLoadingAI] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.07, 72.87]); // Mumbai default
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setLoc(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.log('Geolocation error:', error);
          alert('Unable to get your location. Please select manually on the map.');
        }
      );
    }
  }

  async function geocodeAddress(address) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const coords = [parseFloat(lat), parseFloat(lon)];
        setSelectedLocation(coords);
        setMapCenter(coords);
        setLoc(`${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Geocoding error:', error);
      return false;
    }
  }

  function handleLocationSelect(lat, lng) {
    setSelectedLocation([lat, lng]);
    setLoc(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  }

  async function handleLocationSearch(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (searchQuery.trim()) {
      const success = await geocodeAddress(searchQuery);
      if (!success) {
        alert('Location not found. Please try a different address or select on the map.');
      }
    }
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
      const issueData = {
        title,
        description: desc,
        media: mediaURLs,
        locationText: loc,
        category,
        urgency
      };
      
      // Add coordinates if location was selected
      if (selectedLocation) {
        issueData.latitude = selectedLocation[0];
        issueData.longitude = selectedLocation[1];
      }
      
      await api.post('/issues', issueData);
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
          <label className="report-label">
            <FaMapMarkerAlt style={{marginRight:6}} /> Location
          </label>
          <div className="location-input-container">
            <input
              className="report-input"
              placeholder="Enter address or click on map"
              value={loc}
              onChange={e=>setLoc(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowMap(!showMap)}
              className="map-toggle-btn"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
          
          {showMap && (
            <div className="map-container">
              <div className="map-controls">
                <div className="location-search-form">
                  <input
                    type="text"
                    placeholder="Search for a location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch(e)}
                    className="location-search-input"
                  />
                  <button 
                    type="button" 
                    onClick={handleLocationSearch}
                    className="location-search-btn"
                  >
                    <FaSearch />
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={getUserLocation}
                  className="location-btn"
                  title="Use my location"
                >
                  <FaLocationArrow />
                </button>
              </div>
              
              <div className="map-wrapper">
                <MapContainer 
                  center={mapCenter} 
                  zoom={13} 
                  className="report-map"
                  key={`${mapCenter[0]}-${mapCenter[1]}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {selectedLocation && (
                    <Marker position={selectedLocation}>
                      <Popup>
                        <b>Selected Location</b><br />
                        Click anywhere on the map to change
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
              
              <div className="map-instructions">
                <p>💡 <strong>Tip:</strong> Click anywhere on the map to select the exact location of your issue</p>
              </div>
            </div>
          )}
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
