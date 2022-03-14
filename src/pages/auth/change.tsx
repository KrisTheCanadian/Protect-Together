import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid, Link, TextField, Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase_config';

function ChangePassword() {
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [old, setOld] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const PasswordChangeRequest = () => {
    if (error !== '') setError('');

    setChanging(true);
    auth.currentUser?.updatePassword(password)
      .then(() => {
        navigate('/');
      }).catch(() => {
        setChanging(false);
        setError('Unable to change password. Please try again later.');
      });
  };

  useEffect(() => {
    if (auth.currentUser?.providerData[0]?.providerId !== 'password') {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          Change Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="newPassword"
            inputProps={{ 'data-testid': 'new-password' }}
            label="New Password"
            name="password"
            autoComplete="password"
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            inputProps={{ 'data-testid': 'confirm-password' }}
            autoComplete="password"
            onChange={(event) => setConfirm(event.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="oldPassword"
            label="Current Password"
            type="password"
            id="OldPassword"
            inputProps={{ 'data-testid': 'old-password' }}
            autoComplete=""
            onChange={(event) => setConfirm(event.target.value)}
          />
          <Button
            type="button"
            onClick={() => PasswordChangeRequest()}
            disabled={changing}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/" variant="body2">
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

export default ChangePassword;
