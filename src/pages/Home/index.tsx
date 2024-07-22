import Container from "@mui/material/Container";

import DynamicTabs from "../../components/Tab";
import Header from "../../components/Header";
import { GoogleLogin } from "@react-oauth/google";
import { useUserContext } from "../../context/UserContext";

const Home = () => {
  const { user, login } = useUserContext();
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
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          login(credentialResponse.clientId!, credentialResponse.credential!);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </Container>
  );
};

export default Home;
