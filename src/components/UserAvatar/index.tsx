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
import { useUserContext } from "../../context/UserContext";
import { inviteToGroup } from "../../store/InviteStore";
import axios from "axios";
import { NotificationUserGroup } from "../../interfaces/UserGroupInterfaces";
import Painel from "../Painel";

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
        <Painel />
      </Paper>
    </Container>
  );
};

export default UserAvatar;
