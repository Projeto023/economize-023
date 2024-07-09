import { useEffect, useState } from "react";
import {
  Paper,
  Avatar,
  Typography,
  Container,
  Button,
  Modal,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useUserContext } from "../../context/UserContext";
import { inviteToGroup } from "../../store/InviteStore";
import axios from "axios";
import { NotificationUserGroup } from "../../interfaces/UserGroupInterfaces";

const UserAvatar = () => {
  const { user, logout } = useUserContext();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(
    [] as NotificationUserGroup[]
  );

  const handleInviteModalOpen = () => setInviteModalOpen(true);
  const handleInviteModalClose = () => setInviteModalOpen(false);

  const handleNotificationModalOpen = () => setNotificationModalOpen(true);
  const handleNotificationModalClose = () => setNotificationModalOpen(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/group?user.id=${user.id}`)
      .then((response) => {
        setNotifications(response.data.records);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/group?user.id=${user.id}`)
      .then((response) => {
        setNotifications(response.data.records);
      });
  }, [notificationModalOpen]);

  const handleInvite = async () => {
    try {
      await inviteToGroup({ email, groupId: 1, userId: user.id });
      handleInviteModalClose();
    } catch (error) {
      console.error("Failed to invite user", error);
    }
  };

  const handleAcceptInvite = async (notification: any) => {
    try {
      await axios.post(
        `http://localhost:8080/api/v1/group/respond?user.id=${notification.userId}`,
        {
          email: user.email,
          accepted: true,
          groupId: notification.groupId,
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.userId === notification.userId &&
          notif.groupId === notification.groupId
            ? { ...notif, accepted: true }
            : notif
        )
      );
    } catch (error) {
      console.error("Failed to accept invite", error);
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
          <Button
            onClick={handleInviteModalOpen}
            variant="contained"
            color="primary"
          >
            Convidar
          </Button>
          <Button onClick={logout} variant="contained" color="secondary">
            Sair
          </Button>
          <IconButton color="inherit" onClick={handleNotificationModalOpen}>
            <NotificationsIcon />
          </IconButton>
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

      <Modal open={inviteModalOpen} onClose={handleInviteModalClose}>
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

      <Modal
        open={notificationModalOpen}
        onClose={handleNotificationModalClose}
      >
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
            Notifications
          </Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.userId}>
                <ListItemText
                  primary={`Group: ${notification.groupName}`}
                  secondary={`Created at: ${new Date(
                    notification.createdAt
                  ).toLocaleString()}`}
                />
                {!notification.accepted && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptInvite(notification)}
                  >
                    Accept
                  </Button>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserAvatar;
