import React, { useState, useEffect } from 'react';
import {
  Alert, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton,
  InputAdornment, InputLabel, Link, MenuItem, MobileStepper, Select, TextField, Typography,
  Paper, useTheme, useMediaQuery,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import {
  KeyboardArrowLeft, KeyboardArrowRight, Visibility, VisibilityOff,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import validator from 'validator';

import { auth, firestore } from '../../config/firebase_config';
import Login from './login';
import PanelSwapper from './PanelSwapper';

type FormData = {
  step: number,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [nextButtonStatus, setNextButtonStatus] = useState<boolean>(false);
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<FormData>({
    step: 1,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirm: '',
    dob: null,
    weight: '',
    height: '',
    sex: '',
    healthCardNumber: '',
    medicalConditions: '',
    additionalNotes: '',
    policy: false,
  });

  const [formError, setFormError] = useState<FormError>({
    errorEmail: '',
    errorPhoneNumber: '',
    errorConfirmPassword: '',
    errorWeight: '',
    errorHeight: '',
  });

  useEffect(() => {
    if ((formData.step === 1 && formError.errorEmail === ''
      && formError.errorPhoneNumber === '' && formError.errorConfirmPassword === ''
      && formData.firstName !== '' && formData.lastName !== '' && formData.email !== '' && formData.phoneNumber !== ''
      && formData.password !== '' && formData.confirm !== '')
      || (formData.step === 2 && formError.errorWeight === '' && formError.errorHeight === ''
        && formData.dob !== null && formData.height !== '' && formData.healthCardNumber !== '' && formData.policy)) {
      setNextButtonStatus(true);
    } else {
      setNextButtonStatus(false);
    }
  }, [formData, formError.errorConfirmPassword, formError.errorEmail, formError.errorHeight,
    formError.errorPhoneNumber, formError.errorWeight, nextButtonStatus]);

  const addUserDataToSignUp = async (userCreds: any) => {
    const uid = userCreds?.user?.uid;
    const users = firestore.collection('users');
    if (uid === undefined) {
      setError('An error has occured. Please try again later.');
    }
    await users.doc(uid).set({
      UID: uid,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phoneNumber,
      role: 'patient',
      dateOfBirth: formData.dob,
      healthCardNumber: formData.healthCardNumber,
      height: formData.height,
      medicalConditions: formData.medicalConditions,
      notes: formData.additionalNotes,
      sex: formData.sex,
      weight: formData.weight,
    });
  };

  const handleNext = () => {
    setFormData({ ...formData, step: formData.step + 1 });
  };

  const handleBack = () => {
    setFormData({ ...formData, step: formData.step - 1 });
  };

  const signUpWithEmailAndPassword = () => {
    if (error !== '') setError('');

    auth.createUserWithEmailAndPassword(formData.email, formData.password)
      .then((userCreds) => {
        addUserDataToSignUp(userCreds);
        setFormData({ ...formData, step: formData.step + 1 });
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

  switch (formData.step) {
    case 1:
      return (
        <Grid container component="main" sx={{ height: '100vh' }}>
          <PanelSwapper panelSmallSize={4} panelMedSize={5} />
          <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square display="flex" alignItems="center">
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
                Getting Started
              </Typography>
              <Grid container spacing={3} mt={2}>
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
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={formData.password}
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    inputProps={{ 'data-testid': 'password' }}
                    autoComplete="new-password"
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
                      if (formData.confirm !== event.target.value) {
                        setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
                      } else {
                        setFormError({ ...formError, errorConfirmPassword: '' });
                      }
                      setFormData({ ...formData, password: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    value={formData.confirm}
                    name="confirm password"
                    label="Confirm Password"
                    type={showConfirmedPassword ? 'text' : 'password'}
                    id="confirm password"
                    inputProps={{ 'data-testid': 'confirm-password' }}
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
                      if (formData.password !== event.target.value) {
                        setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
                      } else {
                        setFormError({ ...formError, errorConfirmPassword: '' });
                      }
                      setFormData({ ...formData, confirm: event.target.value });
                    }}
                  />
                </Grid>
              </Grid>
              <MobileStepper
                variant="progress"
                steps={3}
                position="static"
                activeStep={formData.step}
                sx={{ width: 300, mt: 3 }}
                backButton={(
                  <Button size="small" onClick={handleBack} disabled>
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                )}
                nextButton={(
                  <Button disabled={!nextButtonStatus} size="small" id="next-1" onClick={handleNext}>
                    Next
                    <KeyboardArrowRight />
                  </Button>
                )}
              />
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
        </Grid>
      );
    case 2:
      return (
        <Grid container component="main" sx={{ height: '100vh' }}>
          <PanelSwapper panelSmallSize={4} panelMedSize={5} />
          <Grid item xs={12} sm={8} md={7} component={Paper} elevation={6} square display="flex" alignItems="center">
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
                Health Information
              </Typography>
              <Typography component="h1" variant="subtitle1">
                Please provide the following information.
              </Typography>
              <Grid container spacing={3} mt={2}>
                <Grid item xs={12} sm={3}>
                  <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Date of Birth"
                      value={formData.dob}
                      onChange={(newValue) => {
                        setFormData({ ...formData, dob: newValue });
                      }}
                      renderInput={(params) => <TextField id="dob" fullWidth {...params} sx={{ mr: 0 }} required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    value={formData.weight}
                    inputProps={{ 'data-testid': 'weight' }}
                    id="weight"
                    label="Weight"
                    name="weight"
                    autoComplete="weight"
                    error={Boolean(formError.errorWeight)}
                    helperText={formError.errorWeight}
                    sx={{ mr: 0 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                    }}
                    onChange={(event) => {
                      if (!validator.isFloat(event.target.value, { gt: 0 }) && event.target.value !== '') {
                        setFormError({ ...formError, errorWeight: 'Invalid weight.' });
                      } else {
                        setFormError({ ...formError, errorWeight: '' });
                      }
                      setFormData({ ...formData, weight: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    value={formData.height}
                    inputProps={{ 'data-testid': 'height' }}
                    id="height"
                    label="Height"
                    name="height"
                    autoComplete="height"
                    error={Boolean(formError.errorHeight)}
                    helperText={formError.errorHeight}
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                    onChange={(event) => {
                      if (!validator.isFloat(event.target.value, { gt: 0 })) {
                        setFormError({ ...formError, errorHeight: 'Invalid height.' });
                      } else {
                        setFormError({ ...formError, errorHeight: '' });
                      }
                      setFormData({ ...formData, height: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id="sex">Sex</InputLabel>
                    <Select
                      value={formData.sex}
                      inputProps={{ 'data-testid': 'sex' }}
                      labelId="sex"
                      label="sex"
                      id="sex"
                      required
                      onChange={(event) => {
                        setFormData({ ...formData, sex: event.target.value });
                      }}
                    >
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={formData.healthCardNumber}
                    inputProps={{ 'data-testid': 'healthcare-number' }}
                    required
                    fullWidth
                    id="healthCardNumber"
                    label="Health Card Number"
                    name="healthCardNumber"
                    autoComplete="healthCardNumber"
                    onChange={(event) => {
                      setFormData({ ...formData, healthCardNumber: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={formData.medicalConditions}
                    inputProps={{ 'data-testid': 'medical-conditions' }}
                    fullWidth
                    multiline
                    rows={3}
                    name="medicalConditions"
                    label="Medical Conditions"
                    id="medicalConditions"
                    autoComplete="medicalConditions"
                    onChange={(event) => {
                      setFormData({ ...formData, medicalConditions: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    value={formData.additionalNotes}
                    inputProps={{ 'data-testid': 'additional-notes' }}
                    fullWidth
                    multiline
                    rows={2}
                    name="additionalNotes"
                    label="Additional Notes"
                    id="additionalNotes"
                    autoComplete="additionalNotes"
                    onChange={(event) => {
                      setFormData({ ...formData, additionalNotes: event.target.value });
                    }}
                  />
                </Grid>
                <Grid item xs={12} pb={2}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formData.policy}
                        data-testid="accept-policy"
                        value="allowExtraEmails"
                        color="primary"
                        onChange={(event) => {
                          setFormData({ ...formData, policy: event.target.checked });
                        }}
                      />
                    )}
                    label={
                      (
                        <Box>
                          <Link href="shorturl.at/nyCET" target="_blank">I accept the privacy policy</Link>
                        </Box>
                      )
                    }
                  />
                </Grid>
              </Grid>
              <MobileStepper
                variant="progress"
                steps={3}
                position="static"
                activeStep={formData.step}
                sx={{ width: 300 }}
                backButton={(
                  <Button size="small" onClick={handleBack}>
                    <KeyboardArrowLeft />
                    Back
                  </Button>
                )}
                nextButton={(
                  <Button
                    disabled={!nextButtonStatus}
                    data-testid="register-button"
                    size="small"
                    id="next-1"
                    onClick={signUpWithEmailAndPassword}
                  >
                    Register
                    <KeyboardArrowRight />
                  </Button>
                )}
              />
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
            {error && <Alert severity="error">{error}</Alert>}
          </Grid>
        </Grid>
      );
    default:
      return <Login />;
  }
}
