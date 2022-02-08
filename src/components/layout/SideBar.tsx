import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useLayoutContext } from './LayoutContext';

const drawerWidth = 240;
type Props = {
  children: JSX.Element[] | JSX.Element,
};
export default function SideBar({ children }: Props) {
  const { open, setOpen } = useLayoutContext();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <div>
      <Toolbar
        style={{
          minHeight: '88px',
          display: 'flex',
        }}
      >
        <SentimentSatisfiedAltIcon color="primary" style={{ marginRight: '5px', fontSize: '30px' }} />
        <Typography variant="h6" noWrap component="div">
          Protect Together
        </Typography>

      </Toolbar>
      {children}
    </div>
  );

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
      </Drawer>
    </Box>

  );
}
