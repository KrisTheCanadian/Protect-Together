import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  useTheme,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../config/firebase_config';

import PanelSwapper from './PanelSwapper';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const theme = useTheme();

  const navigate = useNavigate();

  const LoginWithEmailAndPassword = () => {
    if (error !== '') setError('');

    auth.signInWithEmailAndPassword(email, password)
      .then(async (data) => {
        const user = (await firestore.collection('users').doc(data.user?.uid).get()).data();
        navigate('/dashboard');
      }).catch(() => {
        setError('Login Failed: Your email or password is incorrect');
      });
  };

  auth.onAuthStateChanged((user: any) => {
    if (user) {
      navigate('/dashboard');
    }
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={6}
        md={5}
        component={Paper}
        elevation={6}
        square
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4">
            Welcome
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              inputProps={{ 'data-testid': 'email' }}
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputProps={{ 'data-testid': 'password' }}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="button"
              onClick={() => LoginWithEmailAndPassword()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Dont have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <PanelSwapper panelVerySmallSize={550} panelSmallSize={6} panelMedSize={7} />
    </Grid>
  );
}
