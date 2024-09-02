import React, { useState } from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import Container from "@mui/material/Container";

import DynamicTabs from "../../components/Tab";
import Header from "../../components/Header";
import { useUserContext } from "../../context/UserContext";


function Home() {
  const { user, login } = useUserContext();

  const handleGoogleSignIn = async () => {
    try {
      var userAgent = navigator.userAgent.toLowerCase();
      var Android = userAgent.indexOf("android") > -1;
      if(Android){
        GoogleAuth.initialize();
      } else {
        GoogleAuth.initialize({
          clientId: '1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      }
      const port = window.location.port; // Port number
      const hostname = window.location.hostname;
      console.log(`Running on IP: ${hostname}`);
      console.log(`Running on Port: ${port}`);
      const googleUser = await GoogleAuth.signIn();
      console.log(googleUser)
      login(googleUser.id!, googleUser.email!, googleUser.name!, googleUser.imageUrl!);
    } catch (error) {
      console.error(error);
    }
  };

  return user ? (
        <Container component="main" maxWidth="md" style={{ height: "100vh" }}>
          <div style={{ minHeight: "100%" }}>
            <Header />
            <DynamicTabs />
          </div>
        </Container>
      ) : (
        <Container
          component="main"
          maxWidth="md"
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <div>Port: `{window.location.port}`</div>
            <div>Hostname: `{window.location.hostname}`</div>
            <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          </div>
        </Container>
  );
}

export default Home;