import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar, Box, IconButton, Toolbar, Typography,
} from '@mui/material';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useLayoutContext } from '../../context/LayoutContext';

const drawerWidth = 240;
type Props = {
  title: string;
  subtitle?: string;
  children?: JSX.Element[] | JSX.Element;
};

export default function Header({ title, subtitle, children }: Props) {
  const theme = useTheme();
  const { open, setOpen } = useLayoutContext();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        minHeight: '88px',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: 'none',
      }}
      style={{
        background: theme.palette.background.default,
        color: theme.palette.common.black,
      }}
    >
      <Toolbar sx={{ alignItems: 'flex-start', paddingTop: '26px' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box>
          <Box>
            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle1" noWrap component="div">
              {subtitle || ''}
            </Typography>
          </Box>
        </Box>
        <div style={{ marginLeft: 'auto' }}>{children}</div>
      </Toolbar>
    </AppBar>
  );
}
