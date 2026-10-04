import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function BackendStatus() {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await api.get('/ping');
        if (response.data.message === 'pong') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    // Initial check
    checkStatus();
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      padding: '8px 12px',
      borderRadius: '20px',
      backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
      color: isConnected ? '#155724' : '#721c24',
      border: `1px solid ${isConnected ? '#c3e6cb' : '#f5c6cb'}`,
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: isConnected ? '#28a745' : '#dc3545'
      }}></div>
      Backend: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
