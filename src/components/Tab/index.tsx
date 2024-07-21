import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import axiosInstance from "../../config/axiosConfig";
import { useUserContext } from "../../context/UserContext";
import DynamicTable from "../DynamicTable";
import DynamicGroupTable from "../DynamicGroupTable";

interface GroupData {
  userId: number;
  groupId: number;
  createdAt: any;
  role: string;
  accepted: boolean;
  groupName: string;
}

const DynamicTabs = () => {
  const { user } = useUserContext();
  const [mainTabIndex, setMainTabIndex] = useState(0);
  const [groupTabIndex, setGroupTabIndex] = useState(0);
  const [groups, setGroups] = useState<GroupData[]>([]);

  useEffect(() => {
    axiosInstance
            .get(
              "/api/v1/group",
              { params: { "user.id": user.id } }
            )
            .then((response) => {
              setGroups(() => response.data.records);
            });
  }, []);

  const handleMainTabChange = (event: any, newValue: any) => {
    setMainTabIndex(newValue);
  };

  const handleGroupTabChange = (event: any, newValue: any) => {
    setGroupTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {/* Main Tabs */}
      <Tabs value={mainTabIndex} onChange={handleMainTabChange} aria-label="main groups" centered>
        <Tab label="Usuário" />
        <Tab label="Grupos" disabled={groups.length === 0}/>
      </Tabs>

      {/* Main Tab Panels */}
      <TabPanel value={mainTabIndex} index={0}>
        <DynamicTable/>
      </TabPanel>
      <TabPanel value={mainTabIndex} index={1}>
        {/* Nested Group Tabs */}
        <Tabs value={groupTabIndex} onChange={handleGroupTabChange} aria-label="group groups" centered>
          {groups.map((group, index) => (
            <Tab key={index} label={group.groupName} />
          ))}
        </Tabs>

        {/* Group Tab Panels */}
        {groups.map((group, index) => (
          <TabPanel key={index} value={groupTabIndex} index={index}>
            <DynamicGroupTable groupId={group.groupId}/>
          </TabPanel>
        ))}
      </TabPanel>
    </Box>
  );
};

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default DynamicTabs;