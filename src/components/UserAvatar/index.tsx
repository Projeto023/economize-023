import { useState } from "react";
import {
  Paper,
  Avatar,
  Typography,
  Container,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import { useUserContext } from "../../context/UserContext";
import { inviteToGroup } from "../../store/InviteStore";

const UserAvatar = () => {
  const { user, logout } = useUserContext();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInvite = async () => {
    try {
      await inviteToGroup({ email, groupId: 1, userId: user.id });
      handleClose();
    } catch (error) {
      console.error("Failed to invite user", error);
    }
  };

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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={handleOpen} variant="contained" color="primary">
            Convidar
          </Button>
          <Button onClick={logout} variant="contained" color="secondary">
            Sair
          </Button>
        </Box>
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

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Invite User to Group
          </Typography>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button onClick={handleInvite} variant="contained" color="primary">
            Invite
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserAvatar;
