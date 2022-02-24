import * as React from 'react';
import {
  Button,
  Drawer,
  Typography,
  CssBaseline,
  Container,
  Box,
} from '@mui/material';

const drawerWidth = 350;

export default function DrawerSymptoms() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            justifyContent: 'center',
            backgroundColor: '#434ce7',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Container>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              borderRadius: 8,
              fontSize: '15px',
              paddingBottom: '3px',
              paddingTop: '3px',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            Step 1 of 2
          </Button>
        </Container>
        <Container>
          <Typography
            variant="h4"
            sx={{
              color: '#ffff',
              paddingTop: 1,
            }}
          >
            Covid-19 Assessment Test
            <Typography sx={{ fontSize: '1rem', color: '#ffff' }}>
              Answer a few quick questions to get a recommendation on what to do
              next!
            </Typography>
          </Typography>
        </Container>
        <Container>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              position: 'absolute',
              bottom: 10,
              textAlign: 'center',
            }}
          >
            Back to Home
          </Button>
        </Container>
      </Drawer>
    </Box>
  );
}
