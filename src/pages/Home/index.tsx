import React, { useState } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

function Home() {
  const [user, setUser] = useState<any | null>(null);
  GoogleAuth.initialize({
    clientId: '1060980321728-sk75uec3bca29iiigfau6doohgnc9bum.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });

  const handleGoogleSignIn = async () => {
    try {
      const googleUser = await GoogleAuth.signIn();
      setUser(googleUser);
//       alert(googleUser.givenName)
    } catch (error) {
      console.error("Deu ruim")
      console.error(error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.givenName}!</h2>
          {/* Display user information */}
        </div>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      )}
    </div>
  );
}

export default Home;