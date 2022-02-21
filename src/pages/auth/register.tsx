import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton,
  InputAdornment, InputLabel, Link, MenuItem, MobileStepper, Select, TextField, Typography,
} from '@mui/material';
import {
  KeyboardArrowLeft, KeyboardArrowRight, Visibility, VisibilityOff,
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase_config';
import NotFound from '../NotFound';
import Login from './login';

function RegisterPage() {
  const [registering, setRegistering] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState<boolean>(false);
  const [dob, setDob] = useState<Date | null>(null);
  const [healthCardNumber, setHealthCardNumber] = useState<string>('');
  const [medicalConditions, setMedicalConditions] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [sex, setSex] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const addUserDataToSignUp = async (userCreds: any) => {
    const uid = userCreds?.user?.uid;
    const users = firestore.collection('users');
    if (uid === undefined) {
      setError('An error has occured. Please try again later.');
    }
    await users.doc(uid).set({
      UID: uid,
      firstName,
      lastName,
      phone: phoneNumber,
      role: 'patient',
      dateOfBirth: dob,
      healthCardNumber,
      height,
      medicalConditions,
      notes: additionalNotes,
      sex,
      weight,
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const signUpWithEmailAndPassword = () => {
    if (password !== confirm) setError('Please make sure your passwords match.');

    if (error !== '') setError('');

    setRegistering(true);
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCreds) => {
        addUserDataToSignUp(userCreds);
        setStep(step + 1);
      }).catch((err: { code: string | string[]; }) => {
        if (err.code.includes('auth/weak-password')) {
          setError('Please enter a stronger password.');
        } else if (err.code.includes('auth/email-already-in-use')) {
          setError('Email already in use.');
        } else {
          setError('Unable to register. Please try again later.');
        }
        setRegistering(false);
      });
  };

  switch (step) {
    case 1:
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '50%',
            }}
          >
            <Avatar sx={{
              m: 1, bgcolor: 'primary.main', width: 48, height: 48,
            }}
            />
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
                  id="firstName"
                  label="First Name"
                  onChange={(event) => setFirstName(event.target.value)}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Phone Number"
                  name="phoneNumber"
                  autoComplete="phone-number"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
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
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirm password"
                  label="Confirm Password"
                  type={showConfirmedPassword ? 'text' : 'password'}
                  id="confirm password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}>
                          {showConfirmedPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </Grid>
            </Grid>
            <MobileStepper
              variant="progress"
              steps={3}
              position="static"
              activeStep={step}
              sx={{ width: 300, mt: 3 }}
              backButton={(
                <Button size="small" onClick={handleBack} disabled>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              )}
              nextButton={(
                <Button size="small" onClick={handleNext}>
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
      );
    case 2:
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '50%',
            }}
          >
            <Typography component="h1" variant="h4">
              Health Information
            </Typography>
            <Typography component="h1" variant="subtitle1">
              Please provide the following information.
            </Typography>
            <Grid container spacing={3} mt={2}>
              <Grid item xs={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={(newValue) => {
                      setDob(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="weight"
                  label="Weight"
                  name="weight"
                  autoComplete="weight"
                  value={weight}
                  sx={{ mr: 2 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">lbs</InputAdornment>,
                  }}
                  onChange={(event) => setWeight(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="height"
                  label="Height"
                  name="height"
                  autoComplete="height"
                  value={height}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                  }}
                  onChange={(event) => setHeight(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="sex">Sex</InputLabel>
                  <Select
                    labelId="sex"
                    label="sex"
                    id="sex"
                    value={sex}
                    required
                    onChange={(event) => setSex(event.target.value)}
                  >
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="healthCardNumber"
                  label="Health Card Number"
                  name="healthCardNumber"
                  autoComplete="healthCardNumber"
                  value={healthCardNumber}
                  onChange={(event) => setHealthCardNumber(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="medicalConditions"
                  label="Medical Conditions"
                  id="medicalConditions"
                  autoComplete="medicalConditions"
                  onChange={(event) => setMedicalConditions(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="additionalNotes"
                  label="Additional Notes"
                  id="additionalNotes"
                  autoComplete="additionalNotes"
                  onChange={(event) => setAdditionalNotes(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} pb={2}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      value="allowExtraEmails"
                      color="primary"
                    />
                  )}
                  label={
                    (
                      <div>
                        <span>I accept the </span>
                        <a href="/src/static/Terms.txt">terms of use and privacy policy</a>
                      </div>
                    )
                    }
                />
              </Grid>
            </Grid>
            <MobileStepper
              variant="progress"
              steps={3}
              position="static"
              activeStep={step}
              sx={{ width: 300 }}
              backButton={(
                <Button size="small" onClick={handleBack}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              )}
              nextButton={(
                <Button size="small" onClick={signUpWithEmailAndPassword}>
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
      );
    default:
      return <Login />;
  }
};
export default RegisterPage;
