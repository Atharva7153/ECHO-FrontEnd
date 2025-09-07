import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import './ResolvedIssues.css';

export default function ResolvedIssues() {
  const [issues, setIssues] = useState([]);
  useEffect(() => { load(); }, []);
  async function load() {
    const res = await api.get('/issues?status=Resolved');
    setIssues(res.data);
  }

  function firstImage(media = []){
    if(!Array.isArray(media)) return null;
    return media.find(url => /\.(jpe?g|png|gif|webp)$/i.test(url)) || null;
  }

  return (
    <div className="resolved-container">
      <h2 className="resolved-title">Resolved Issues</h2>
      {issues.length === 0 && (
        <div className="resolved-empty">No resolved issues.</div>
      )}

      <div className="resolved-list">
        {issues.map(i => (
          <div key={i._id} className="resolved-card" onClick={() => window.location.href = `/issue/${i._id}`}>
            <div className="resolved-card-header">
              {firstImage(i.media)
                ? <img src={firstImage(i.media)} alt="" className="resolved-thumb" />
                : <div className="resolved-thumb resolved-thumb-placeholder">No image</div>
              }
              <div className="resolved-card-main">
                <Link to={`/issue/${i._id}`} className="resolved-title-link" onClick={e=>e.stopPropagation()}>{i.title}</Link>
                <div className="resolved-meta">
                  <span>{new Date(i.createdAt).toLocaleDateString()}</span>
                  <span className="resolved-chip">{i.category}</span>
                  <span className="resolved-chip resolved-status">Resolved</span>
                </div>
                <p className="resolved-desc">{i.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
