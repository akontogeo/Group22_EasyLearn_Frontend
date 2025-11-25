import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';

export default function Profile(){
  const { userId } = useParams();
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(()=>{
    if(!userId) return;
    async function load(){
      try{
        const p = await getUserProfile(userId);
        setProfile(p);
        // Set this user as the logged-in user in context
        setUser({ ...p, userId: Number(userId) });
      }catch(e){console.error(e)}
    }
    load();
  },[userId, setUser]);

  const makePremium = async ()=>{
    try{
      await updateUser(userId, { isPremium: true });
      alert('You are now premium!');
      // Refresh both local profile and global user context
      const p = await getUserProfile(userId);
      setProfile(p);
      setUser({ ...p, userId: Number(userId) });
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

        <h3>Enrolled Courses</h3>
        <div className="card">
          <p>View your enrolled courses in the <Link to={`/users/${userId}/courses`}>My Courses</Link> page.</p>
        </div>
      </div>

      <div>
        <div className="card">
          <h3 style={{marginTop:0}}>Account Information</h3>
          {profile && (
            <div style={{display:'grid',gap:8}}>
              <div style={{padding:8,background:'#f9f9f9',borderRadius:4}}>
                <strong>User ID:</strong> {profile.userId}
              </div>
              <div style={{padding:8,background:'#f9f9f9',borderRadius:4}}>
                <strong>Email:</strong> {profile.email}
              </div>
              <div style={{padding:8,background:'#f9f9f9',borderRadius:4}}>
                <strong>Premium:</strong> {profile.isPremium ? 'Yes' : 'No'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
