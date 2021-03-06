import { Box, Toolbar } from '@mui/material';
import * as React from 'react';

const drawerWidth = 240;

type Props = {
  children: JSX.Element[] | JSX.Element | any,
};

export default function MainContent({ children }: Props) {
  return (

    <Box
      component="main"
      sx={{ flexGrow: 1,
        p: 3,
        width: {
          sm: `calc(100% - ${drawerWidth}px)`,
          overflowX: 'auto',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column' } }}
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
