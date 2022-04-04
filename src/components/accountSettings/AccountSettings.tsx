import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Divider, List, ListItem, ListItemIcon, Typography, ListItemText } from '@mui/material';
import Header from '../layout/Header';
import NotificationsButton from '../layout/NotificationsButton';
import MainContent from '../layout/MainContent';

const style = {
};

function AccountSettings(props: { setOption:any}) {
  const [status, setStatus] = useState('0');
  const date = new Date();

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title="Account Settings" subtitle="Change your account settings">
        <NotificationsButton />
      </Header>
      <MainContent>
        <List aria-label="mailbox folders">
          <ListItem button key="ContactInfo">
            <ListItemText data-testid="ContactInformation" onClick={() => props.setOption(1)}>
              <Typography component="h1" variant="h5">
                Contact Information
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />
          <ListItem button key="ChangePassword">
            <ListItemText data-testid="ChangePassword" onClick={() => props.setOption(2)}>
              <h4>Change Password</h4>
            </ListItemText>
          </ListItem>
          <Divider />
          <ListItem button key="HealthInfo">
            <ListItemText data-testid="HealthInformation" onClick={() => props.setOption(3)}>
              <h4>Health Information</h4>
            </ListItemText>
          </ListItem>
        </List>
      </MainContent>
    </Box>
  );
}

export default AccountSettings;
