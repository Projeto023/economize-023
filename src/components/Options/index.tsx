import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { NotificationUserGroup } from "../../interfaces/UserGroupInterfaces";
import axiosInstance from "../../config/axiosConfig";
import { createGroup } from "../../store/GroupStore";
import {
  CreateGroupModal,
  GroupDetailsModal,
  GroupModal,
} from "./components/modals";

const Options: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { user, logout } = useUserContext();

  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const handleNotificationModalOpen = () => setNotificationModalOpen(true);
  const handleNotificationModalClose = () => setNotificationModalOpen(false);

  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const handleCreateGroupModalOpen = () => setCreateGroupModalOpen(true);
  const handleCreateGroupModalClose = () => setCreateGroupModalOpen(false);

  const [groupDetailsModalOpen, setGroupDetailsModalOpen] = useState(false);
  const [groupDetails, setGroupDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(0);
  const handleGroupDetailsModalClose = () => {
    setGroupDetailsModalOpen(false);
    setGroupDetails([]);
  };

  const handleRemoveUserFromGroup = async (userId: number) => {
    await axiosInstance.delete(
      `/api/v1/group/${selectedGroupId}/user/${userId}?currentUser.id=${user.id}`
    );
    handleRecordClick(selectedGroupId);
  };

  const handleRecordClick = async (groupId: number) => {
    setLoading(true);
    setGroupDetailsModalOpen(true);
    setSelectedGroupId(groupId);
    try {
      const response = await axiosInstance.get(
        `/api/v1/group/users?group.id=${groupId}`
      );
      setGroupDetails(response.data.records);
    } catch (error) {
      console.error("Failed to fetch group details", error);
    } finally {
      setLoading(false);
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

  const [notifications, setNotifications] = useState(
    [] as NotificationUserGroup[]
  );

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

      <GroupModal
        notificationModalOpen={notificationModalOpen}
        handleNotificationModalClose={handleNotificationModalClose}
        notifications={notifications}
        handleAcceptInvite={handleAcceptInvite}
        handleCreateGroupModalOpen={handleCreateGroupModalOpen}
        isMobile={isMobile}
        handleRecordClick={handleRecordClick}
      />
      <CreateGroupModal
        createGroupModalOpen={createGroupModalOpen}
        handleCreateGroup={handleCreateGroup}
        handleCreateGroupModalModalClose={handleCreateGroupModalClose}
      />
      <GroupDetailsModal
        open={groupDetailsModalOpen}
        onClose={handleGroupDetailsModalClose}
        groupDetails={groupDetails}
        loading={loading}
        handleRemoveUserFromGroup={handleRemoveUserFromGroup}
      />
    </>
  );
};

export default Options;
