import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(){
  const { user } = useAuth();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if(keyword.trim()){
      navigate(`/?keyword=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <header className="header">
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src="/Logo.png" alt="EasyLearn Logo" style={{width:48,height:48,objectFit:'contain'}} />
        <Link to="/" style={{textDecoration:'none',color:'inherit',fontSize:18,fontWeight:600}}>EasyLearn</Link>
      </div>
      <form onSubmit={handleSearch} style={{flex:1,maxWidth:500,margin:'0 16px'}}>
        <input 
          className="search" 
          placeholder="What do you want to learn today ?" 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <Link to="/my-courses" style={{textDecoration:'none',color:'inherit'}}>My Courses</Link>
        <Link to="/profile" style={{textDecoration:'none',color:'inherit'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:36,height:36,borderRadius:18,background:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>👤</div>
            <span>{user?`Hi, ${user.username}`:'User'}</span>
          </div>
        </Link>
      </div>
    </header>
  )
}
