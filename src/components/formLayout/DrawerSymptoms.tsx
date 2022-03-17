import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Drawer,
  Typography,
  CssBaseline,
  Container,
  Box,
} from '@mui/material';

const drawerWidth = 350;

export default function DrawerSymptoms({ id, content }: any) {
  const navigate = useNavigate();
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
            Step
            {' '}
            {id}
            {' '}
            of 2
          </Button>
        </Container>
        <Container>
          {content === 'symptomsForm' && (
          <Typography
            variant="h4"
            sx={{
              color: '#ffff',
              paddingTop: 1,
            }}
          >
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
          )}
          {content === 'updateForm' && (
          <Typography
            variant="h4"
            sx={{
              color: '#ffff',
              paddingTop: 1,
            }}
          >
            Update Your Symptoms
              {id === '1' && (
              <Typography sx={{ fontSize: '1rem', color: '#ffff' }}>
                Answer the following questions about your symptoms.
                This will allow your doctor to get a better understanding of your situation.
              </Typography>
              )}
            {id === '2' && (
            <Typography sx={{ fontSize: '1rem', color: '#ffff' }}>
              Your symptoms have been successfully updated.
            </Typography>
            )}
          </Typography>
          )}
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
            onClick={() => { navigate('/dashboard'); }}
          >
            Back to Home
          </Button>
        </Container>
      </Drawer>
    </Box>
  );
}
