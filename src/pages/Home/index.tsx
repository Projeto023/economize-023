import React from 'react';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import Container from "@mui/material/Container";
import DynamicTabs from "../../components/Tab";
import Header from "../../components/Header";
import { useUserContext } from "../../context/UserContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";

function Home() {
  const { user, login } = useUserContext();

  const handleGoogleSignIn = async () => {
    try {
      var Android = isFromAndroidApp();
      if (Android) {
        GoogleAuth.initialize();
      } else {
        GoogleAuth.initialize({
          clientId: '1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com',
          scopes: ['profile', 'email'],
          grantOfflineAccess: true,
        });
      }
      const port = window.location.port;
      const hostname = window.location.hostname;
      const googleUser = await GoogleAuth.signIn();
      login(googleUser.id!, googleUser.email!, googleUser.name!, googleUser.imageUrl!);
    } catch (error) {
      console.error(error);
    }
  };

  function isFromAndroidApp() {
    const userAgent = navigator.userAgent

    // Check for Android device
    const isAndroid = /Android/i.test(userAgent);

    // Check for WebView (usually lacks 'Chrome')
    const isWebView = /wv|Version\/[.0-9]+/.test(userAgent);

    return isAndroid && isWebView;
  }

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
      <GoogleSignInButton handleGoogleSignIn={handleGoogleSignIn} />
    </Container>
  );
}

export default Home;
