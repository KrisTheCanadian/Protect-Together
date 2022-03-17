import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid, Link, TextField, Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { auth } from '../../config/firebase_config';

function ForgotPassword() {
  const [sending, setSending] = useState<boolean>(false);
  const [sent, setSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const ResetPasswordRequest = () => {
    if (error !== '') setError('');

    setSending(true);
    auth.sendPasswordResetEmail(email)
      .then(() => {
        navigate('/');
        setSent(true);
        setSending(false);
      }).catch(() => {
        setSending(false);
        setError('Unable to send reset link. Please try again later.');
      });
  };

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
        boxShadow={6}
        p={3}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
        <Typography component="h1" variant="h5">
          Forgot Email
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
          <Button
            type="button"
            onClick={() => ResetPasswordRequest()}
            disabled={sending}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/" variant="body2">
                Sign in
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

export default ForgotPassword;
