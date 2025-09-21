import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';
import './Home.css';
import { FaUser, FaThumbsUp, FaCheckCircle, FaClock, FaCamera } from 'react-icons/fa';

export default function Home() {
  const [issues, setIssues] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    const res = await api.get('/issues');
    setIssues(res.data);
  }

  async function upvote(id) {
    try {
      const res = await api.put(`/issues/${id}/upvote`);
      alert('Upvote toggled. Your points: ' + res.data.userPoints);
      load();
    } catch (err) {
      alert('Login to upvote');
    }
  }

  async function markResolved(id) {
    try {
      await api.put(`/issues/${id}/resolve`);
      load();
    } catch (err) {
      alert('Failed to mark as resolved');
    }
  }

  return (
    <div className="modern-bg">
      <div className="home-container">
        <h2 className="home-title">
          <span>Open Civic Issues</span>
        </h2>
        <div className="issues-list">
          {issues.length === 0 && (
            <div className="glass-card" style={{ textAlign: 'center' }}>
              ! Initializing backend… please wait !
            </div>
          )}

          {issues.filter(i => i.status !== 'Resolved').map(i => (
            <div
              key={i._id}
              className="glass-card issue-card-modern"
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = `/issue/${i._id}`}
            >
              <div className="issue-card-header">
                {i.media && Array.isArray(i.media) && i.media.length > 0 && i.media.find(url => url.match(/\.(jpe?g|png|gif|webp)$/i)) ? (
                  <img
                    src={i.media.find(url => url.match(/\.(jpe?g|png|gif|webp)$/i))}
                    alt=""
                    className="issue-thumb"
                  />
                ) : (
                  <div className="issue-thumb issue-thumb-placeholder">
                    <FaCamera size={32} color="#b0b0b0" />
                  </div>
                )}
                <div className="issue-card-main">
                  <h3 className="issue-title-link">{i.title}</h3>
                  <div className="issue-meta-modern">
                    <span><FaUser size={13} /> {i.createdBy?.name || 'Unknown'} ({i.createdBy?.role || 'citizen'})</span>
                    <span><FaClock size={13} /> {new Date(i.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="issue-meta-modern">
                    <span className="issue-chip">{i.category}</span>
                    <span className={`issue-chip urgency-${(i.urgency || '').toLowerCase()}`}>{i.urgency}</span>
                  </div>
                  <p className="issue-desc">{i.description}</p>
                </div>
              </div>
              <div className="issue-card-footer">
                <span>
                  <FaCheckCircle color={i.status === 'Pending' ? '#fbc02d' : i.status === 'In Progress' ? '#1976d2' : '#43a047'} />
                  <b style={{ marginLeft: 4 }}> {i.status}</b>
                </span>
                <span>
                  <FaThumbsUp color="#1976d2" style={{ marginRight: 3 }} />
                  <b>{'upvotes' in i && Array.isArray(i.upvotes) ? i.upvotes.length : (i.upvotesCount || 0)}</b>
                </span>
              </div>
              <div className="issue-actions-modern" onClick={e => e.stopPropagation()}>
                <button className="btn-modern" onClick={() => upvote(i._id)}>
                  <FaThumbsUp style={{ marginRight: 4 }} /> Upvote
                </button>
                <button className="btn-modern btn-resolved" onClick={() => markResolved(i._id)}>
                  <FaCheckCircle style={{ marginRight: 4 }} /> Mark Resolved
                </button>
                <Link to={`/issue/${i._id}`} className="btn-modern btn-details">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
