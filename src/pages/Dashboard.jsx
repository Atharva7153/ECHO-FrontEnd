import React, { useEffect, useState } from 'react';
import { api } from '../api';
import './Dashboard.css';
import { FaChartBar, FaCheckCircle, FaClock, FaBuilding } from 'react-icons/fa';

function formatDuration(ms) {
  if (!ms || ms < 0) return '-';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [trend, setTrend] = useState({});
  const [resRate, setResRate] = useState({});
  const [respTime, setRespTime] = useState({});

  useEffect(() => { load(); }, []);
  async function load() {
    const res = await api.get('/issues');
    const issues = res.data;

    // By department
    const byDept = {};
    const byDeptResolved = {};
    const byDeptRespTime = {};
    const byWeek = {};

    issues.forEach(i => {
      const cat = i.category || 'General';
      byDept[cat] = (byDept[cat] || 0) + 1;

      // Resolution rate
      if (i.status === 'Resolved') {
        byDeptResolved[cat] = (byDeptResolved[cat] || 0) + 1;
      }

      // Response time (Pending -> Resolved)
      if (i.status === 'Resolved' && i.createdAt && i.updatedAt) {
        const created = new Date(i.createdAt).getTime();
        const updated = new Date(i.updatedAt).getTime();
        const diff = updated - created;
        byDeptRespTime[cat] = byDeptRespTime[cat] || [];
        byDeptRespTime[cat].push(diff);
      }

      // Trend: group by week
      if (i.createdAt) {
        const d = new Date(i.createdAt);
        const week = `${d.getFullYear()}-W${Math.ceil((d.getDate() + 6 - d.getDay()) / 7)}`;
        byWeek[week] = (byWeek[week] || 0) + 1;
      }
    });

    // Calculate averages
    const avgRespTime = {};
    Object.entries(byDeptRespTime).forEach(([cat, arr]) => {
      avgRespTime[cat] = arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
    });

    // Resolution rate
    const resRateObj = {};
    Object.keys(byDept).forEach(cat => {
      resRateObj[cat] = byDeptResolved[cat]
        ? ((byDeptResolved[cat] / byDept[cat]) * 100).toFixed(1)
        : '0.0';
    });

    setStats(byDept);
    setTrend(byWeek);
    setResRate(resRateObj);
    setRespTime(avgRespTime);
  }

  return (
    <div className="dashboard-bg">
      <div className="dashboard-glass-card">
        <h2 className="dashboard-title">
          <FaChartBar style={{marginRight:8}} /> Department Analytics Dashboard
        </h2>
        <h3 className="dashboard-section-title"><FaBuilding style={{marginRight:6}} /> Issues by Department</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Open Issues</th>
              <th>Resolution Rate (%)</th>
              <th><FaClock style={{marginRight:3}} />Avg. Response Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(stats).map(dept =>
              <tr key={dept}>
                <td>{dept}</td>
                <td>{stats[dept]}</td>
                <td>
                  <FaCheckCircle color="#43a047" style={{marginRight:3}} />
                  {resRate[dept]}
                </td>
                <td>{formatDuration(respTime[dept])}</td>
              </tr>
            )}
          </tbody>
        </table>
        <h3 className="dashboard-section-title">Reporting Trend (Issues per Week)</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Issues Reported</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(trend).sort().map(([week, count]) =>
              <tr key={week}><td>{week}</td><td>{count}</td></tr>
            )}
          </tbody>
        </table>
        <p className="dashboard-note">
          <b>Note:</b> These analytics help track reporting trends, departmental performance, and system effectiveness to drive civic engagement and accountability.
        </p>
      </div>
    </div>
  );
}
