import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './profile.css'; // Import CSS for styling
import LoginButton from './LoginButton';

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      <div className="profile-container">
        <img
          className="profile-picture"
          src={user && user.picture ? user.picture : ''}
          alt={user && user.name ? user.name : 'Profile Picture'}
        />
        <div className="profile-info">
          <h2>{user && user.name ? user.name : 'No Name'}</h2>
          <p>{user && user.email ? user.email : 'No Email'}</p>
        </div>
        <LoginButton/>
      </div>
    )
  );
};

export default Profile;
