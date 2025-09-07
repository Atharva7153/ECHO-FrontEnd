import React, { useEffect, useState } from 'react';
import { api } from '../api';
import './Leaderboard.css';
import { FaTrophy, FaUser, FaUserTie, FaBuilding } from 'react-icons/fa';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => { load(); }, []);
  async function load() {
    const [u, v, d] = await Promise.all([
      api.get('/leaderboard/users'),
      api.get('/leaderboard/volunteers'),
      api.get('/leaderboard/departments')
    ]);
    setUsers(u.data);
    setVolunteers(v.data);
    setDepartments(d.data);
  }

  return (
    <div className="leaderboard-bg">
      <div className="leaderboard-glass-card">
        <h2 className="leaderboard-title">
          <FaTrophy style={{marginRight:8, color:'#FFD700'}} /> Leaderboard
        </h2>
        <div className="leaderboard-flex">
          <div className="leaderboard-card">
            <div className="leaderboard-card-header">
              <FaUser className="leaderboard-icon" /> Top Citizens
            </div>
            <div className="leaderboard-table-scroll">
              <table className="leaderboard-table-modern">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id} className={idx < 3 ? 'leaderboard-row-highlight' : ''}>
                      <td>
                        {idx === 0 && <FaTrophy color="#FFD700" title="Gold" />}
                        {idx === 1 && <FaTrophy color="#C0C0C0" title="Silver" />}
                        {idx === 2 && <FaTrophy color="#CD7F32" title="Bronze" />}
                        {idx > 2 && idx+1}
                      </td>
                      <td>{u.name}</td>
                      <td style={{textTransform:'capitalize'}}>{u.role}</td>
                      <td>{u.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="leaderboard-card">
            <div className="leaderboard-card-header">
              <FaUserTie className="leaderboard-icon" /> Top Volunteers
            </div>
            <div className="leaderboard-table-scroll">
              <table className="leaderboard-table-modern">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((u, idx) => (
                    <tr key={u._id} className={idx < 3 ? 'leaderboard-row-highlight' : ''}>
                      <td>
                        {idx === 0 && <FaTrophy color="#FFD700" title="Gold" />}
                        {idx === 1 && <FaTrophy color="#C0C0C0" title="Silver" />}
                        {idx === 2 && <FaTrophy color="#CD7F32" title="Bronze" />}
                        {idx > 2 && idx+1}
                      </td>
                      <td>{u.name}</td>
                      <td>{u.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="leaderboard-card">
            <div className="leaderboard-card-header">
              <FaBuilding className="leaderboard-icon" /> Departments by Issues
            </div>
            <div className="leaderboard-table-scroll">
              <table className="leaderboard-table-modern">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department</th>
                    <th>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d, idx) => (
                    <tr key={d._id}>
                      <td>{idx+1}</td>
                      <td>{d._id || 'General'}</td>
                      <td>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
