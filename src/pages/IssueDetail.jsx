import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import './IssueDetail.css';
import { FaUser, FaClock, FaCheckCircle, FaChevronLeft, FaChevronRight, FaCommentDots, FaCamera, FaRobot } from 'react-icons/fa';

export default function IssueDetail(){
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [text, setText] = useState('');
  const [mediaIdx, setMediaIdx] = useState(0);
  const [aiAdvice, setAiAdvice] = useState('');

  useEffect(()=>{ load(); },[]);
  async function load(){ const res = await api.get(`/issues/${id}`); setData(res.data); }
  async function addComment(e){
    e.preventDefault();
    try{
      await api.post(`/issues/${id}/comments`, { text });
      setText('');
      load();
    } catch(err){ alert('Login to comment') }
  }
  useEffect(()=>{
    load();
    // Dummy AI advice (simulate async)
    setTimeout(() => {
      setAiAdvice(
        "AI Suggestion: For this issue, contact your local municipal office or use the ECHO volunteer network. " +
        "If it's a pothole, mark the area and alert traffic. For garbage, request a pickup via the city app. " +
        "Share before/after photos for faster resolution. If urgent, call the helpline."
      );
    }, 600);
  },[]);
  if(!data) return <div className="issue-detail-bg">Loading...</div>;
  const { issue, comments } = data;
  const media = issue.media || [];

  return (
    <div className="issue-detail-bg">
      <div className="issue-detail-glass">
        <div className="issue-detail-header">
          <h2 className="issue-detail-title">{issue.title}</h2>
          <div className="issue-detail-meta">
            <span><FaUser /> {issue.createdBy?.name || 'Unknown'} ({issue.createdBy?.role || 'citizen'})</span>
            <span><FaClock /> {new Date(issue.createdAt).toLocaleString()}</span>
            <span>
              <FaCheckCircle color={issue.status==='Pending'?'#fbc02d':issue.status==='In Progress'?'#1976d2':'#43a047'} style={{marginRight:3}} />
              {issue.status}
            </span>
          </div>
        </div>
        <div className="issue-detail-chips">
          <span className="issue-detail-chip">{issue.category}</span>
          <span className={`issue-detail-chip urgency-${(issue.urgency||'').toLowerCase()}`}>{issue.urgency}</span>
        </div>
        <div className="issue-detail-desc">{issue.description}</div>
        {media.length > 0 && (
          <div className="issue-detail-carousel">
            <button
              className="carousel-btn"
              onClick={()=>setMediaIdx(mediaIdx-1)}
              disabled={mediaIdx === 0}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
            <div className="carousel-media">
              {media[mediaIdx].match(/\.(mp4|webm|ogg)$/i)
                ? <video src={media[mediaIdx]} controls className="carousel-img" />
                : <img src={media[mediaIdx]} alt="" className="carousel-img" />
              }
            </div>
            <button
              className="carousel-btn"
              onClick={()=>setMediaIdx(mediaIdx+1)}
              disabled={mediaIdx === media.length-1}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
            <div className="carousel-indicator">
              {mediaIdx+1} / {media.length}
            </div>
          </div>
        )}
        {media.length === 0 && (
          <div className="issue-detail-no-media">
            <FaCamera size={40} color="#b0b0b0" />
            <div>No media uploaded</div>
          </div>
        )}
        <hr className="issue-detail-divider"/>
        <div className="issue-detail-comments-section">
          <h3 className="issue-detail-comments-title"><FaCommentDots style={{marginRight:6}} /> Comments</h3>
          <div className="issue-detail-comments-list">
            {comments.map(c=> (
              <div key={c._id} className="issue-detail-comment">
                <b>{c.author?.name || 'Anonymous'}:</b> {c.text}
              </div>
            ))}
          </div>
          <form className="issue-detail-comment-form" onSubmit={addComment}>
            <input
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="Add comment"
              className="issue-detail-comment-input"
            />
            <button className="issue-detail-comment-btn">Add</button>
          </form>
        </div>
        <div className="ai-advice-section">
          <div className="ai-advice-header">
            <FaRobot style={{marginRight:8, color:'#26d0ce'}} />
            <span>AI Assistant</span>
          </div>
          <div className="ai-advice-body">
            {aiAdvice || "Thinking..."}
          </div>
        </div>
      </div>
    </div>
  );
}
