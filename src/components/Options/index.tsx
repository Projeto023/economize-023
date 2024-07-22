import {
  Box,
  Button,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { inviteToGroup } from "../../store/InviteStore";
import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { NotificationUserGroup } from "../../interfaces/UserGroupInterfaces";
import axiosInstance from "../../config/axiosConfig";
import { createGroup } from "../../store/GroupStore";
import { CreateGroupModal, GroupModal, InviteModal } from "./components/modals";

const Options: React.FC = () => {
  const [email, setEmail] = useState("");
  const [inviteGroupId, setInviteGroupId] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user, logout } = useUserContext();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const handleInviteModalOpen = () => setInviteModalOpen(true);
  const handleInviteModalClose = () => setInviteModalOpen(false);

  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const handleNotificationModalOpen = () => setNotificationModalOpen(true);
  const handleNotificationModalClose = () => setNotificationModalOpen(false);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const handleCreateGroupModalOpen = () => setCreateGroupModalOpen(true);
  const handleCreateGroupModalClose = () => setCreateGroupModalOpen(false);

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

  const handleCreateGroup = async (name: string) => {
    try {
      await createGroup({
        userId: user.id,
        groupName: name,
      });
      handleCreateGroupModalClose();
    } catch (error) {
      console.error("Failed to create user", error);
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
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
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
      </Box>

      <InviteModal
        inviteModalOpen={inviteModalOpen}
        handleInviteModalClose={handleInviteModalClose}
        notifications={notifications}
        inviteGroupId={inviteGroupId}
        setInviteGroupId={setInviteGroupId}
        email={email}
        setEmail={setEmail}
        handleInvite={handleInvite}
      />
      <GroupModal
        notificationModalOpen={notificationModalOpen}
        handleNotificationModalClose={handleNotificationModalClose}
        notifications={notifications}
        handleAcceptInvite={handleAcceptInvite}
        handleCreateGroupModalOpen={handleCreateGroupModalOpen}
        handleInviteModalOpen={handleInviteModalOpen}
        isMobile={isMobile}
      />
      <CreateGroupModal
        createGroupModalOpen={createGroupModalOpen}
        handleCreateGroup={handleCreateGroup}
        handleCreateGroupModalModalClose={handleCreateGroupModalClose}
      />
    </>
  );
};

export default Options;
