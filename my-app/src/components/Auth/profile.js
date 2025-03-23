import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './profile.css'; // Import CSS for styling
import LoginButton from './LoginButton';
const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      <div className="profile-container">
        <img className="profile-picture" src={user?.picture} alt={user?.name} />
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
        <LoginButton/>
      </div>
    )
  );
};

export default Profile;
