import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';

const drawerWidth = 240;
type Props = {
  children: JSX.Element[] | JSX.Element,
};

export default function MainContent({ children }: Props) {
  return (

    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
    >
      <Toolbar
        style={{
          minHeight: '88px',
          display: 'flex',

        }}
      />
      {children}
    </Box>

  );
}
