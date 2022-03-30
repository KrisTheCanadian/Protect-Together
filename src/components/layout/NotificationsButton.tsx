import {
  Badge,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  IconButton,
  Popover,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { UserContext } from '../../context/UserContext';
import { firestore } from '../../config/firebase_config';

interface UserNotification {
  title: string;
  message: string;
  date: Timestamp;
  read: boolean;
}

const notificationsListStyle = {
  width: '100%',
  maxWidth: { lg: '25vw', md: '35vw', sm: '50vw', xs: '75vw' },
  bgcolor: 'background.paper',
  maxHeight: '80vh',
};

function NotificationsButton() {
  const { state, update } = React.useContext(UserContext);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<Element|null>(null);

  const open = Boolean(anchorEl);
  const id = open ? 'notifications-popover' : undefined;

  const handleClickOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    const user = firestore.collection('users').doc(state.id);
    const markedRead = notifications.map((notification) => ({ ...notification, read: true }));
    user.update({ notifications: markedRead });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IconButton
        aria-label="notifications"
        onClick={(event) => handleClickOpen(event)}
        size="small"
      >
        <Badge
          badgeContent={notifications.filter((notification) => !notification.read).length}
          color="primary"
        >
          <NotificationsNoneOutlinedIcon fontSize="large" color="primary" />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List sx={notificationsListStyle}>
          {notifications?.length === 0 && (
            <ListItem alignItems="flex-start">
              <ListItemText
                primary="No notifications"
              />
            </ListItem>
          )}

          {Array.from(notifications)?.reverse().map((notification) => (
            <ListItem
              alignItems="flex-start"
              key={notification.date.toString()}
              secondaryAction={!notification.read && <FiberManualRecordIcon fontSize="small" color="primary" />}
            >
              <ListItemText
                sx={{ marginRight: 2 }}
                primary={(
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    color="text.primary"
                    fontWeight={500}
                  >
                    {notification?.title}
                  </Typography>
                )}
                secondary={(
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      color="text.primary"
                    >
                      {notification?.message}
                      <br />
                    </Typography>
                    {format(notification.date?.toDate(), 'yyyy-LL-dd KK:mm:ss a')}
                  </>
                  )}
              />
            </ListItem>
          ))}

        </List>
      </Popover>
    </>
  );
}

export default NotificationsButton;
