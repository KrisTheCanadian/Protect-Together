import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid, Link, TextField, Typography, ButtonGroup,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { doc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase_config';

function LoginPage() {
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [patientTab, setPatientTab] = useState<boolean>(true);
  const [staffTab, setStaffTab] = useState<boolean>(false);

  const navigate = useNavigate();

  const LoginWithEmailAndPassword = () => {
    if (error !== '') setError('');

    setAuthenticating(true);

    auth.signInWithEmailAndPassword(email, password)
      .then(async (data) => {
        const user = (await firestore.collection('users').doc(data.user?.uid).get()).data();
        console.log('current user');
        console.log(user);

        navigate('/dashboard');
      }).catch(() => {
        setAuthenticating(false);
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
        <ButtonGroup
          orientation="horizontal"
          fullWidth
          size="large"
          sx={{ mb: 3 }}
        >
          <Button
            variant="text"
            color="primary"
            sx={{ borderTop: patientTab ? 1 : 0, bgcolor: patientTab ? 'secondary.main' : '#f5f7fa' }}
            onClick={() => { setStaffTab(false); setPatientTab(true); }}
          >
            Patient Login
          </Button>
          <Button
            variant="text"
            color="primary"
            sx={{ borderTop: staffTab ? 1 : 0, bgcolor: staffTab ? 'secondary.main' : '#f5f7fa' }}
            onClick={() => { setStaffTab(true); setPatientTab(false); }}
          >
            Staff Login
          </Button>
        </ButtonGroup>
        <Typography component="h1" variant="h5">
          Welcome
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
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
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            type="button"
            onClick={() => LoginWithEmailAndPassword()}
            disabled={authenticating}
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
