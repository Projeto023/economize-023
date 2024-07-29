import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemButton,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { NotificationUserGroup } from "../../../interfaces/UserGroupInterfaces";
import { inviteToGroup } from "../../../store/InviteStore";
import { useUserContext } from "../../../context/UserContext";
import axiosInstance from "../../../config/axiosConfig";

interface Notification {
  userId: number;
  groupId: number;
  groupName: string;
  createdAt: string;
  accepted: boolean;
}

interface InviteModalProps {
  inviteModalOpen: boolean;
  handleInviteModalClose: () => void;
  notifications: Notification[];
  inviteGroupId: number;
  setInviteGroupId: (id: number) => void;
  email: string;
  setEmail: (email: string) => void;
  handleInvite: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  inviteModalOpen,
  handleInviteModalClose,
  notifications,
  inviteGroupId,
  setInviteGroupId,
  email,
  setEmail,
  handleInvite,
}) => (
  <Modal
    key={"Convidar para grupo"}
    open={inviteModalOpen}
    onClose={handleInviteModalClose}
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
);

interface GroupModalProps {
  notificationModalOpen: boolean;
  handleNotificationModalClose: () => void;
  notifications: Notification[];
  handleAcceptInvite: (notification: Notification) => void;
  handleCreateGroupModalOpen: () => void;

  isMobile: boolean;
  handleRecordClick: (groupId: number) => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  notificationModalOpen,
  handleNotificationModalClose,
  notifications,
  handleAcceptInvite,
  handleCreateGroupModalOpen,
  isMobile,
  handleRecordClick,
}) => (
  <Modal
    key={"Grupos"}
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
            <ListItemButton
              onClick={() => handleRecordClick(notification.groupId)}
            >
              <ListItemText
                primary={`Grupo: ${notification.groupName}`}
                secondary={`Entrou em: ${new Date(
                  notification.createdAt
                ).toLocaleString()}`}
              />
            </ListItemButton>
            {!notification.accepted && (
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptInvite(notification);
                }}
              >
                Aceitar
              </Button>
            )}
          </ListItem>
        ))}
      </List>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        <Button
          onClick={handleCreateGroupModalOpen}
          variant="contained"
          color="primary"
        >
          Criar
        </Button>
      </Box>
    </Box>
  </Modal>
);

interface CreateGroupModalProps {
  createGroupModalOpen: boolean;
  handleCreateGroupModalModalClose: () => void;
  handleCreateGroup: (name: string) => Promise<void>;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  createGroupModalOpen,
  handleCreateGroupModalModalClose,
  handleCreateGroup,
}) => {
  const [groupName, setGroupName] = useState("");

  const handleCreateAndClose = async () => {
    await handleCreateGroup(groupName);
    handleCreateGroupModalModalClose();
    setGroupName("");
  };

  return (
    <Modal
      key={"Criar grupo"}
      open={createGroupModalOpen}
      onClose={handleCreateGroupModalModalClose}
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
          Criar grupo
        </Typography>
        <TextField
          fullWidth
          label="Nome do Grupo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          margin="normal"
        />
        <Button
          onClick={handleCreateAndClose}
          variant="contained"
          color="primary"
        >
          Criar grupo
        </Button>
      </Box>
    </Modal>
  );
};

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  groupDetails: any;
  loading: boolean;
  handleRemoveUserFromGroup: (userId: number) => void;
}

export const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  groupDetails,
  loading,
  handleRemoveUserFromGroup,
}) => {
  const { user } = useUserContext();

  const [email, setEmail] = useState("");

  const [inviteGroupId, setInviteGroupId] = useState(1);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const handleInviteModalOpen = () => setInviteModalOpen(true);
  const handleInviteModalClose = () => setInviteModalOpen(false);

  const [notifications, setNotifications] = useState(
    [] as NotificationUserGroup[]
  );

  useEffect(() => {
    axiosInstance.get(`/api/v1/group?user.id=${user.id}`).then((response) => {
      setNotifications(response.data.records);
    });
  }, []);

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

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Detalhes do Grupo
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {groupDetails.map((user: any) => (
                <ListItem
                  key={user.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <ListItemText primary={user.name} />
                    <ListItemText secondary={user.role} />
                  </Box>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveUserFromGroup(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          )}
          <Button
            onClick={handleInviteModalOpen}
            variant="contained"
            color="primary"
          >
            Convidar
          </Button>
        </Box>
      </Modal>
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
    </>
  );
};
