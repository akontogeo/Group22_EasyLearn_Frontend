import React, { useEffect, useState } from 'react';
import { getUserProfile, updateUser } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { Link, useParams } from 'react-router-dom';

/**
 * Profile Component
 * 
 * Displays and manages user profile information including account details,
 * points, and premium status. Allows users to view their profile data
 * and provides navigation to other parts of the application.
 * 
 * Features:
 * - Loads user profile data from API based on URL parameter
 * - Updates authentication context with current user data
 * - Displays user information in a formatted layout
 * - Provides navigation link to user's enrolled courses
 * - Shows account information including email and premium status
 * 
 * @returns {JSX.Element} The user profile page
 */
export default function Profile(){
  // Extract userId from URL parameters
  const { userId } = useParams();
  // Access authentication context to update current user
  const { setUser } = useAuth();
  // Local state for storing profile data
  const [profile, setProfile] = useState(null);

  /**
   * Effect to load user profile data when component mounts or userId changes
   * Also updates the authentication context with the loaded user data
   */
  useEffect(()=>{
    // Early return if no userId is provided
    if(!userId) return;
    
    /**
     * Async function to load user profile data from API
     * Updates both local state and global auth context
     */
    async function load(){
      try{
        // Fetch user profile from API
        const p = await getUserProfile(userId);
        setProfile(p);
        // Set this user as the logged-in user in context for app-wide access
        setUser({ ...p, userId: Number(userId) });
      }catch(e){
        // Log any errors that occur during profile loading
        console.error('Failed to load user profile:', e);
      }
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
