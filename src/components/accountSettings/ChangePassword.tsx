import {
  Alert,
  Box,
  Button,
  Grid, IconButton, InputAdornment, TextField, Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { auth } from '../../config/firebase_config';

type FormData = {
  step: number,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  old: string,
  password: string,
  confirm: string,
  dob: Date | null,
  weight: string,
  height: string,
  sex: string,
  healthCardNumber: string,
  medicalConditions: string,
  additionalNotes: string,
  policy: boolean,
};

type FormError = {
  errorEmail: string,
  errorPhoneNumber: string,
  errorConfirmPassword: string,
  errorWeight: string,
  errorHeight: string,
};
function ChangePassword() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState<boolean>(false);
  const [changing, setChanging] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [old, setOld] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const [formError, setFormError] = useState<FormError>({
    errorEmail: '',
    errorPhoneNumber: '',
    errorConfirmPassword: '',
    errorWeight: '',
    errorHeight: '',
  });

  useEffect(() => {
    if ((formError.errorConfirmPassword === ''
            && old !== ''
            && password !== '' && confirm !== '')) {
      setChanging(true);
    } else {
      setChanging(false);
    }
  }, [old, confirm, password, formError.errorConfirmPassword, formError.errorEmail, formError.errorHeight,
    formError.errorPhoneNumber, formError.errorWeight, changing]);

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
          my: 1,
          mx: 10,
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
            onChange={(event) => setOld(event.target.value)}
            autoFocus
          />
          <TextField
            required
            fullWidth
            margin="normal"
            id="newPassword"
            inputProps={{ 'data-testid': 'new-password' }}
            label="New Password"
            name="password"
            value={password}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={Boolean(formError.errorConfirmPassword)}
            helperText={formError.errorConfirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(event) => {
              if (confirm !== event.target.value) {
                setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
              } else {
                setFormError({ ...formError, errorConfirmPassword: '' });
              }
              setPassword(event.target.value);
            }}
          />
          <TextField
            required
            fullWidth
            margin="normal"
            label="Confirm Password"
            id="confirmPassword"
            inputProps={{ 'data-testid': 'confirm-password' }}
            value={confirm}
            name="confirm password"
            type={showConfirmedPassword ? 'text' : 'password'}
            autoComplete="new-password"
            error={Boolean(formError.errorConfirmPassword)}
            helperText={formError.errorConfirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                    {showConfirmedPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(event) => {
              if (password !== event.target.value) {
                setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
              } else {
                setFormError({ ...formError, errorConfirmPassword: '' });
              }
              setConfirm(event.target.value);
            }}
          />

          <Grid container justifyContent="flex-end">
            <Button variant="contained" sx={{ mt: 3, mb: 2 }} disabled={!changing} onClick={PasswordChangeRequest}>
              Submit
              <ArrowRightAltIcon />
            </Button>
          </Grid>

        </Box>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
};

export default ChangePassword;
