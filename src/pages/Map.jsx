import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { api } from '../api';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function MapPage() {
  const [issues, setIssues] = useState([]);
  useEffect(() => { load(); }, []);
  async function load() {
    const res = await api.get('/issues');
    setIssues(res.data);
  }
  function getCoords(issue, i) {
    // Replace with real geocoding later
    return [19.07 + (i * 0.01), 72.87 + (i * 0.01)];
  }
  return (
    <div className="map-bg">
      <div className="map-glass-card">
        <h2 className="map-title">
          <FaMapMarkerAlt style={{marginRight:8}} /> Issues Map
        </h2>
        <MapContainer center={[19.07, 72.87]} zoom={12} className="map-leaflet">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {issues.map((issue, i) => (
            <Marker key={issue._id} position={getCoords(issue, i)}>
              <Popup>
                <b>{issue.title}</b><br />
                {issue.description}<br />
                <span className="map-popup-chip">{issue.category}</span>
                <span className={`map-popup-chip urgency-${(issue.urgency||'').toLowerCase()}`}>{issue.urgency}</span>
                <br />
                <b>Status:</b> {issue.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
