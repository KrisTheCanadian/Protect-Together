import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid, Link, TextField, Typography, ButtonGroup,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { auth, firestore } from '../../config/firebase_config';

function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

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
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Box
        p={3}
        sx={{
          bgcolor: 'secondary.main',
          borderRadius: 2,
          boxShadow: 6,
          marginTop: 8,
          paddingTop: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" mt={3}>
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
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
};

export default LoginPage;
