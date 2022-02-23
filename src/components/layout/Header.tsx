import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar, IconButton, Toolbar, Typography,
} from '@mui/material';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useLayoutContext } from '../../context/LayoutContext';

const drawerWidth = 240;
type Props = {
  title: string;
  children: JSX.Element[] | JSX.Element;
};
export default function Header({ title, children }: Props) {
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
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {title}
        </Typography>
        <div style={{ marginLeft: 'auto' }}>{children}</div>
      </Toolbar>
    </AppBar>
  );
}
