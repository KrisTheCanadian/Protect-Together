import React from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
} from '@mui/material';

export default function HeaderSymptoms() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar sx={{ position: 'fixed' }}>
        <Toolbar sx={{ minHeight: 250 }}>
          <Container
            sx={{ paddingLeft: '7%', marginTop: '5%', marginBottom: '5%' }}
          >
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
            <Typography variant="h5" sx={{ marginRight: '3rem', marginTop: 1 }}>
              Covid-19 Assessment Test
              <Typography sx={{ fontSize: '1rem' }}>
                Answer a few quick questions to get a recommendation on what to
                do next!
              </Typography>
            </Typography>
          </Container>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: 'auto' }}
          >
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
