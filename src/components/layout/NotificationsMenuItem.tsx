// eslint-disable-next-line max-len
import { Dialog, DialogContent, DialogTitle, Badge, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { doc, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../context/UserContext';
import { firestore } from '../../config/firebase_config';

interface UserNotification {
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

function NotificationsMenuItem() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { state, update } = React.useContext(UserContext);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ListItem button onClick={handleClickOpen}>
        <ListItemIcon>
          <Badge badgeContent={notifications.length} color="primary">
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </ListItemIcon>
        <ListItemText primary="Notifications" />

      </ListItem>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" />
        <DialogContent>
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {notifications?.length === 0 && (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary="No new notifications"
                />
              </ListItem>
            )}

            {notifications?.map((notification) => (
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={notification.title}
                  secondary={notification.message}
                />
              </ListItem>
            ))}

          </List>
        </DialogContent>

      </Dialog>
    </>
  );
}

export default NotificationsMenuItem;
