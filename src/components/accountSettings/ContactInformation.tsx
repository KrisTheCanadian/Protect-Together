import React, { useState, useEffect } from 'react';
import {
  Alert, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton,
  InputAdornment, InputLabel, Link, MenuItem, MobileStepper, Select, TextField, Typography,
  Paper, useTheme, useMediaQuery,
} from '@mui/material';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import validator from 'validator';

import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../config/firebase_config';

type FormData = {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
};

type FormError = {
  errorEmail: string,
  errorPhoneNumber: string,
  errorConfirmPassword: string,
  errorWeight: string,
  errorHeight: string,
};

export default function ContactInformation() {
  const [error, setError] = useState<string>('');
  const theme = useTheme();
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [formError, setFormError] = useState<FormError>({
    errorEmail: '',
    errorPhoneNumber: '',
    errorConfirmPassword: '',
    errorWeight: '',
    errorHeight: '',
  });

  useEffect(() => {
    if ((formError.errorEmail === '' && formError.errorPhoneNumber === ''
            && formData.firstName !== '' && formData.lastName !== ''
            && formData.email !== '' && formData.phoneNumber !== '')) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [formData, formError.errorEmail,
    formError.errorPhoneNumber, disableSubmit]);

  const updateContactInfo = async () => {
    const users = firestore.collection('users').doc(auth.currentUser?.uid);
    await users.update({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber,
    }).then(() => { navigate('/'); });
  };

  const updateme = () => {
    if (error !== '') setError('');

    auth.createUserWithEmailAndPassword(formData.email, 'uuuuu')
      .then((userCreds) => {
        updateContactInfo();
      }).catch((err: { code: string | string[]; }) => {
        if (err.code.includes('auth/weak-password')) {
          setError('Please enter a stronger password.');
        } else if (err.code.includes('auth/email-already-in-use')) {
          setError('Email already in use.');
        } else {
          setError('Unable to register. Please try again later.');
        }
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
        sx={{ my: 1,
          mx: 10,
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center' }}
      >
        <Typography component="h1" variant="h4">
          Contact Information
        </Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              value={formData.firstName}
              id="firstName"
              inputProps={{ 'data-testid': 'first-name' }}
              label="First Name"
              onChange={(event) => {
                setFormData({ ...formData, firstName: event.target.value });
              }}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              value={formData.lastName}
              id="lastName"
              inputProps={{ 'data-testid': 'last-name' }}
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              onChange={(event) => {
                setFormData({ ...formData, lastName: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              value={formData.email}
              id="email"
              inputProps={{ 'data-testid': 'email' }}
              label="Email Address"
              name="email"
              autoComplete="email"
              error={Boolean(formError.errorEmail)}
              helperText={formError.errorEmail}
              onChange={(event) => {
                if (!validator.isEmail(event.target.value)) {
                  setFormError({ ...formError, errorEmail: 'Invalid email address.' });
                } else {
                  setFormError({ ...formError, errorEmail: '' });
                }
                setFormData({ ...formData, email: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              value={formData.phoneNumber}
              id="phoneNumber"
              inputProps={{ 'data-testid': 'phone-number' }}
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phone-number"
              error={Boolean(formError.errorPhoneNumber)}
              helperText={formError.errorPhoneNumber}
              onChange={(event) => {
                if (!validator.isMobilePhone(event.target.value, 'en-CA')) {
                  setFormError({ ...formError, errorPhoneNumber: 'Invalid phone number.' });
                } else {
                  setFormError({ ...formError, errorPhoneNumber: '' });
                }
                setFormData({ ...formData, phoneNumber: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container justifyContent="flex-end">
          <Button variant="contained" disabled={disableSubmit} onClick={updateContactInfo}>
            Submit
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
}
