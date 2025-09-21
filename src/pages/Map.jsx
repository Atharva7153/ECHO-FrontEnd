import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { api } from '../api';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { FaMapMarkerAlt, FaSearch, FaLocationArrow } from 'react-icons/fa';

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.07, 72.87]); // Mumbai default
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => { 
    load();
    getUserLocation();
  }, []);

  async function load() {
    try {
      const res = await api.get('/issues');
      setIssues(res.data);
    } catch (error) {
      console.error('Error loading issues:', error);
    }
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          setMapZoom(15);
        },
        (error) => {
          console.log('Geolocation error:', error);
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
        return [parseFloat(lat), parseFloat(lon)];
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  function getIssueCoords(issue) {
    // If issue has coordinates, use them
    if (issue.latitude && issue.longitude) {
      return [issue.latitude, issue.longitude];
    }
    
    // If issue has locationText, try to geocode it
    if (issue.locationText) {
      // For demo purposes, return random coordinates near Mumbai
      // In production, you'd geocode the locationText
      const baseLat = 19.07;
      const baseLng = 72.87;
      const randomOffset = (Math.random() - 0.5) * 0.1; // ±0.05 degrees
      return [baseLat + randomOffset, baseLng + randomOffset];
    }
    
    // Fallback to random location near Mumbai
    const baseLat = 19.07;
    const baseLng = 72.87;
    const randomOffset = (Math.random() - 0.5) * 0.1;
    return [baseLat + randomOffset, baseLng + randomOffset];
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      const coords = await geocodeAddress(searchQuery);
      if (coords) {
        setMapCenter(coords);
        setMapZoom(15);
      } else {
        alert('Location not found. Please try a different address.');
      }
    }
  }

  function getMarkerColor(urgency) {
    switch (urgency?.toLowerCase()) {
      case 'high': return '#e53935';
      case 'medium': return '#fbc02d';
      case 'low': return '#43a047';
      default: return '#1976d2';
    }
  }

  function createCustomIcon(color) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  }

  return (
    <div className="map-bg">
      <div className="map-glass-card">
        <h2 className="map-title">
          <FaMapMarkerAlt style={{marginRight:8}} /> Issues Map
        </h2>
        
        {/* Legend - Moved to top */}
        <div className="map-legend">
          <h4>Priority Legend</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#e53935'}}></div>
              <span>High Priority</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#fbc02d'}}></div>
              <span>Medium Priority</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{backgroundColor: '#43a047'}}></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="map-search-form">
          <div className="map-search-container">
            <input
              type="text"
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="map-search-input"
            />
            <button type="submit" className="map-search-btn">
              <FaSearch />
            </button>
            <button 
              type="button" 
              onClick={getUserLocation}
              className="map-location-btn"
              title="Use my location"
            >
              <FaLocationArrow />
            </button>
          </div>
        </form>

        <MapContainer 
          center={mapCenter} 
          zoom={mapZoom} 
          className="map-leaflet"
          key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <b>Your Location</b><br />
                You are here
              </Popup>
            </Marker>
          )}
          
          {/* Issue Markers */}
          {issues.map((issue) => {
            const coords = getIssueCoords(issue);
            const markerColor = getMarkerColor(issue.urgency);
            const customIcon = createCustomIcon(markerColor);
            
            return (
              <Marker key={issue._id} position={coords} icon={customIcon}>
                <Popup>
                  <div className="map-popup-content">
                    <h3 className="map-popup-title">{issue.title}</h3>
                    <p className="map-popup-desc">{issue.description}</p>
                    <div className="map-popup-meta">
                      <span className="map-popup-chip">{issue.category}</span>
                      <span 
                        className={`map-popup-chip urgency-${(issue.urgency||'').toLowerCase()}`}
                        style={{ backgroundColor: markerColor + '20', color: markerColor }}
                      >
                        {issue.urgency}
                      </span>
                    </div>
                    <div className="map-popup-status">
                      <strong>Status:</strong> {issue.status}
                    </div>
                    {issue.locationText && (
                      <div className="map-popup-location">
                        <strong>Location:</strong> {issue.locationText}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
