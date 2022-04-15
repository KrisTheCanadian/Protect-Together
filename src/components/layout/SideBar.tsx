import {
  Button, Typography, Toolbar, Drawer, Box,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import { useLayoutContext } from '../../context/LayoutContext';
import { UserContext } from '../../context/UserContext';
import LogoImage from '../../static/style/images/logo.svg';

const drawerWidth = 240;
type Props = {
  children: JSX.Element[] | JSX.Element;
};
export default function SideBar({ children }: Props) {
  const { update } = React.useContext(UserContext);
  const { open, setOpen } = useLayoutContext();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <div>
      <Toolbar
        style={{
          minHeight: '88px',
          display: 'flex',
          paddingLeft: '10px',
        }}
      >
        <img
          alt="logo"
          src={LogoImage}
          style={{ marginRight: '5px', width: '40px' }}
        />
        <Typography variant="h6" noWrap component="div" color="primary.main">
          Protect Together
        </Typography>
      </Toolbar>
      {children}
    </div>
  );

  const logout = () => {
    update({
      firstName: '',
      lastName: '',
      role: '',
      id: '',
    });
    auth.signOut().then(() => navigate('/'));
  };

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
        <Button onClick={logout}>Logout</Button>
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
        <Button onClick={logout}>Logout</Button>
      </Drawer>
    </Box>
  );
}
