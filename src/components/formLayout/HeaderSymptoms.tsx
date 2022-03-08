import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  Container,
  Box,
  CssBaseline,
} from '@mui/material';

export default function HeaderSymptoms({ id }: any) {
  const navigate = useNavigate();
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
              Step
              {' '}
              {id}
              {' '}
              of 2
            </Button>
            <Typography variant="h5" sx={{ marginRight: '3rem', marginTop: 1 }}>
              Covid-19 Assessment Test
              {id === '1' && (
                <Typography sx={{ fontSize: '1rem', color: '#ffff' }}>
                  Answer a few quick questions to get a recommendation on what to do
                  next!
                </Typography>
              )}
              {id === '2' && (
                <Typography sx={{ fontSize: '1rem', color: '#ffff' }}>
                  Follow our recommendation!
                </Typography>
              )}
            </Typography>
          </Container>
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginLeft: 'auto', marginRight: '0.5rem' }}
            onClick={() => {
              navigate('/dashboard');
            }}
          >
            Back to Home
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
