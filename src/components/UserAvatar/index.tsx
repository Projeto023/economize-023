import { Paper, Avatar, Typography, Container, Button } from "@mui/material";
import { useUserContext } from "../../context/UserContext";

const UserAvatar = () => {
  const { user, logout } = useUserContext();

  return (
    <Container style={{ display: "flex", flexDirection: "row" }}>
      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          margin: "10px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <Avatar
          src={user?.avatarUrl}
          alt="User Avatar"
          sx={{ width: 50, height: 50, margin: "auto" }}
        />
        <Typography variant="h6" gutterBottom>
          {user?.name}
        </Typography>
        <Button onClick={logout}>Sair</Button>
      </Paper>

      <Paper
        elevation={3}
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          margin: "10px",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: "50%",
        }}
      >
        <Typography variant="h3" color="primary">
          Projeto 023
        </Typography>
      </Paper>
    </Container>
  );
};

export default UserAvatar;
