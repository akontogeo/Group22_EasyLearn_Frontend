import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUser, getRecommendations, getLeaderboard } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile(){
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(()=>{
    if(!user) return;
    async function load(){
      try{
        const p = await getUserProfile(user.userId);
        setProfile(p);
        const rec = await getRecommendations(user.userId);
        setRecommendations(rec || []);
        const lb = await getLeaderboard();
        setLeaderboard(lb || []);
      }catch(e){console.error(e)}
    }
    load();
  },[user]);

  const makePremium = async ()=>{
    try{
      await updateUser(user.userId, { isPremium: true });
      alert('You are now premium!');
      // Refresh both local profile and global user context
      const p = await getUserProfile(user.userId);
      setProfile(p);
      if (refreshUser) refreshUser();
    }catch(e){alert('Failed to upgrade')}
  }

  return (
    <div className="grid">
      <div>
        <h2>Profile</h2>
        {!profile && <div className="card">Loading...</div>}
        {profile && (
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:16}}>
              <div style={{width:80,height:80,borderRadius:40,background:'var(--accent)',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontWeight:'bold'}}>
                {profile.username?.slice(0,1).toUpperCase()}
              </div>
              <div>
                <h3 style={{margin:'0 0 4px 0'}}>{profile.username}</h3>
                <p style={{margin:0,color:'#666'}}>{profile.email}</p>
              </div>
            </div>
            <div style={{padding:12,background:'#f9f9f9',borderRadius:6,marginBottom:12}}>
              <strong>Account Status:</strong> {profile.isPremium? '✨ Premium User':'Free User'}
            </div>
            {!profile.isPremium && (
              <button className="btn" onClick={makePremium}>Upgrade to Premium</button>
            )}
          </div>
        )}

        <h3>Recommended for You</h3>
        {recommendations.length === 0 && <div className="card">No recommendations yet. Enroll in courses to get personalized suggestions!</div>}
        <div style={{display:'grid',gap:8}}>
          {recommendations.map(c=> (
            <Link key={c.courseId} to={`/courses/${c.courseId}`} className="card" style={{textDecoration:'none',color:'inherit'}}>
              <strong>{c.title}</strong>
              <p style={{margin:'4px 0 0 0',fontSize:14,color:'#666'}}>{c.category} • {c.difficulty}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="card">
          <h3 style={{marginTop:0}}>Leaderboard</h3>
          {leaderboard.length === 0 && <p>No leaderboard data yet.</p>}
          <div style={{display:'grid',gap:8}}>
            {leaderboard.slice(0,10).map((e,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:8,background:i<3?'#fffbea':'#f9f9f9',borderRadius:4}}>
                <span><strong>#{e.rank || i+1}</strong> {e.username}</span>
                <span style={{color:'var(--accent)',fontWeight:'bold'}}>{e.totalPoints} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
