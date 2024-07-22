import React, { useState } from "react";
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
} from "@mui/material";

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
  handleInviteModalOpen: () => void;
  isMobile: boolean;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  notificationModalOpen,
  handleNotificationModalClose,
  notifications,
  handleAcceptInvite,
  handleCreateGroupModalOpen,
  handleInviteModalOpen,
  isMobile,
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
        <Button
          onClick={handleInviteModalOpen}
          variant="contained"
          color="primary"
        >
          Convidar
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
