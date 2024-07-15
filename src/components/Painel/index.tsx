import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { inviteToGroup } from "../../store/InviteStore";
import { useEffect, useState } from "react";

import { useUserContext } from "../../context/UserContext";

import NotificationsIcon from "@mui/icons-material/Notifications";
import { NotificationUserGroup } from "../../interfaces/UserGroupInterfaces";
import axios from "axios";
import axiosInstance from "../../config/axiosConfig";

const Painel = () => {
  const [email, setEmail] = useState("");
  const [inviteGroupId, setInviteGroupId] = useState(1);
  const { user, logout } = useUserContext();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const handleInviteModalOpen = () => setInviteModalOpen(true);
  const handleInviteModalClose = () => setInviteModalOpen(false);

  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const handleNotificationModalOpen = () => setNotificationModalOpen(true);
  const handleNotificationModalClose = () => setNotificationModalOpen(false);

  const [notifications, setNotifications] = useState(
    [] as NotificationUserGroup[]
  );

  const handleInvite = async () => {
    try {
      await inviteToGroup({
        email,
        groupId: Number(inviteGroupId),
        userId: user.id,
      });
      handleInviteModalClose();
    } catch (error) {
      console.error("Failed to invite user", error);
    }
  };

  useEffect(() => {
    axiosInstance.get(`/api/v1/group?user.id=${user.id}`).then((response) => {
      setNotifications(response.data.records);
    });
  }, []);

  useEffect(() => {
    axiosInstance.get(`/api/v1/group?user.id=${user.id}`).then((response) => {
      setNotifications(response.data.records);
    });
  }, [notificationModalOpen]);

  const handleAcceptInvite = async (notification: any) => {
    try {
      await axiosInstance.post(
        `/api/v1/group/respond?user.id=${notification.userId}`,
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
    <>
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
            Convide para o seu grupo
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="group-select-label">Selecione o Grupo</InputLabel>
            <Select
              labelId="group-select-label"
              value={inviteGroupId}
              onChange={(e) => setInviteGroupId(Number(e.target.value))}
            >
              {notifications.map((group) => (
                <MenuItem key={group.groupId} value={group.groupId}>
                  {group.groupName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button onClick={handleInvite} variant="contained" color="primary">
            Convidar
          </Button>
        </Box>
      </Modal>

      <Typography variant="h3" color="primary">
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleNotificationModalOpen}
            variant="contained"
            color="primary"
          >
            Grupos
          </Button>
          <Button onClick={logout} variant="contained" color="secondary">
            Sair
          </Button>
          {/* <IconButton color="inherit" onClick={handleNotificationModalOpen}>
            <NotificationsIcon />
          </IconButton> */}
        </Box>

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
              Grupos
            </Typography>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.userId}>
                  <ListItemText
                    primary={`Grupo: ${notification.groupName}`}
                    secondary={`Entrou em: ${new Date(
                      notification.createdAt
                    ).toLocaleString()}`}
                  />
                  {!notification.accepted && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAcceptInvite(notification)}
                    >
                      Aceitar
                    </Button>
                  )}
                </ListItem>
              ))}
            </List>
            <Button
              onClick={handleInviteModalOpen}
              variant="contained"
              color="primary"
            >
              Convidar
            </Button>
          </Box>
        </Modal>
      </Typography>
    </>
  );
};

export default Painel;
