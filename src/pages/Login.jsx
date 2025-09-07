import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }){
  const [email,setEmail]=useState(''), [pw,setPw]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password: pw });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin && onLogin(res.data.user);
      nav('/');
    } catch(err){ alert(err.response?.data?.error || err.message); }
  }

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input placeholder="password" type="password" value={pw} onChange={e=>setPw(e.target.value)} /><br/>
      <button>Login</button>
    </form>
  );
}
