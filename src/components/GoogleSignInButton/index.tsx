import React from 'react';
import './index.css';

interface GoogleSignInButtonProps {
  handleGoogleSignIn: () => void;  // Define the function type
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ handleGoogleSignIn }) => {
  return (
    <div>
      <button className="google-signin-btn" onClick={handleGoogleSignIn}>
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google Logo"
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleSignInButton;