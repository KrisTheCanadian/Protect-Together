import React, { useState, useEffect, useContext } from 'react';
import { Alert, Box, Button, FormControl, Grid, IconButton, InputAdornment, InputLabel,
  MenuItem, Select, TextField, Typography } from '@mui/material';
import validator from 'validator';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail } from 'firebase/auth';
import { DocumentData } from 'firebase/firestore';
import Header from '../layout/Header';
import NotificationsButton from '../layout/NotificationsButton';
import { auth, firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

type FormData = {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string,
  dateOfBirth: Date | null,
  weight: string,
  height: string,
  sex: string,
  healthCardNumber: string,
  medicalConditions: string,
  notes: string,
};
type FormError = {
  errorEmail: string,
  errorPhoneNumber: string,
  errorCurrentPassword: string,
  errorIncorrectPassword: string,
  errorConfirmPassword: string,
  errorWeight: string,
  errorHeight: string,
};

export default function AccountSettings(props: { setOption:any}) {
  const [showConfirmedPassword, setShowConfirmedPassword] = useState<boolean>(false);
  const userDoc = firestore.collection('users').doc(auth.currentUser?.uid);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [user, setUser] = useState<DocumentData>();
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: null,
    weight: '',
    height: '',
    sex: '',
    healthCardNumber: '',
    medicalConditions: '',
    notes: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [formError, setFormError] = useState<FormError>({
    errorEmail: '',
    errorPhoneNumber: '',
    errorIncorrectPassword: '',
    errorCurrentPassword: '',
    errorConfirmPassword: '',
    errorWeight: '',
    errorHeight: '',
  });

  useEffect(() => {
    if (error === '' && formError.errorEmail === '' && formError.errorIncorrectPassword === ''
        && formError.errorPhoneNumber === '' && formError.errorConfirmPassword === ''
        && formError.errorWeight === '' && formError.errorHeight === '' && formError.errorCurrentPassword === ''
        && (formData.firstName !== '' || formData.lastName !== '' || formData.email !== ''
            || formData.phone !== '' || formData.dateOfBirth !== null || formData.height !== ''
            || formData.weight !== '' || formData.sex !== '' || formData.healthCardNumber !== ''
            || formData.notes !== '' || formData.medicalConditions !== ''
            || (formData.currentPassword !== '' && formData.newPassword !== '' && formData.confirmNewPassword !== '')
        )) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [error, formData, formError.errorConfirmPassword, formError.errorEmail, formError.errorHeight,
    formError.errorIncorrectPassword, formError.errorPhoneNumber, formError.errorWeight, disableSubmit]);

  const updateContactHealthtInfo = async () => {
    if (formData.firstName !== '') await userDoc.update({ firstName: formData.firstName });
    if (formData.lastName !== '') await userDoc.update({ lastName: formData.lastName });
    if (formData.phone !== '') await userDoc.update({ phone: formData.phone });
    if (formData.email !== '') if (formData.dateOfBirth !== null) await userDoc.update({ dateOfBirth: formData.dateOfBirth });
    if (formData.healthCardNumber !== '') await userDoc.update({ healthCardNumber: formData.healthCardNumber });
    if (formData.medicalConditions !== '') await userDoc.update({ medicalConditions: formData.medicalConditions });
    if (formData.notes !== '') await userDoc.update({ notes: formData.notes });
    if (formData.sex !== '') await userDoc.update({ sex: formData.sex });
    if (formData.weight !== '') await userDoc.update({ weight: formData.weight });
    if (formData.height !== '') await userDoc.update({ height: formData.height });
    if (formData.email !== '') {
      await updateEmail(auth.currentUser!, formData.email);
      await userDoc.update({ email: formData.email });
    }
  };

  const updatePassword = async () => {
    if (error !== '') setError('');

    if (auth.currentUser!.email != null) {
      const credential = EmailAuthProvider.credential(
          auth.currentUser!.email,
          formData.currentPassword,
      );
      try {
        await reauthenticateWithCredential(
        auth.currentUser!,
        credential,
        );
        await auth.currentUser?.updatePassword(formData.newPassword);
        if (error === '') navigate('/');
      } catch (error) {
        // setError('Unable to change password. Please try again later.');
        setFormError({ ...formError, errorIncorrectPassword: 'Incorrect Password' });
      }
    }
  };

  const handleSubmit = async () => {
    await updateContactHealthtInfo().then(() => {
      if (formData.currentPassword !== '' && formData.newPassword !== '') updatePassword();
      else if (error === '') navigate('/');
    });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title="Account Settings" subtitle="Change your account settings">
        <NotificationsButton />
      </Header>

      <Grid
        spacing={5}
        boxShadow={6}
        p={12}
        sx={{ my: 0,
          mx: 0,
          flexDirection: 'column',
          alignItems: 'center',
          top: '-15%' }}
      >
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h6">
              Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              fullWidth
              value={formData.firstName}
              id="firstName"
              data-testid="first-name"
              label="First Name"
              onChange={(event) => {
                setFormData({ ...formData, firstName: event.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={formData.lastName}
              id="lastName"
              ata-testid="last-name"
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
              fullWidth
              value={formData.email}
              id="email"
              ata-testid="email"
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
              fullWidth
              value={formData.phone}
              id="phoneNumber"
              data-testid="phone-number"
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
                setFormData({ ...formData, phone: event.target.value });
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} mt={1}>
          <Grid item spacing={1} xs={12} sm={12}>
            <Typography variant="h6">
              Health Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={formData.height}
              data-testid="height"
              id="height"
              label="Height"
              name="height"
              autoComplete="height"
              error={Boolean(formError.errorHeight)}
              helperText={formError.errorHeight}
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              value={formData.weight}
              data-testid="weight"
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
          <Grid item xs={12} sm={6}>
            <LocalizationProvider fullWidth dateAdapter={AdapterDateFns}>
              <DatePicker
                data-testid="dob"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={(newValue) => {
                  setFormData({ ...formData, dateOfBirth: newValue });
                }}
                renderInput={(params) => <TextField id="dob" fullWidth {...params} sx={{ mr: 0 }} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="sex">Sex</InputLabel>
              <Select
                value={formData.sex}
                data-testid="sex"
                labelId="sex"
                label="sex"
                id="sex"
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
              data-testid="healthcare-number"
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
              data-testid="medical-conditions"
              fullWidth
              multiline
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
              value={formData.notes}
              data-testid="additional-notes"
              fullWidth
              multiline
              name="additionalNotes"
              label="Additional Notes"
              id="additionalNotes"
              autoComplete="additionalNotes"
              onChange={(event) => {
                setFormData({ ...formData, notes: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12}>
            <Typography variant="h6">
              Change Password
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              fullWidth
              name="oldPassword"
              label="Current Password"
              type="password"
              id="OldPassword"
              value={formData.currentPassword}
              data-testid="old-password"
              autoComplete=""
              error={Boolean(formError.errorCurrentPassword) || Boolean(formError.errorIncorrectPassword)}
              helperText={formError.errorCurrentPassword + formError.errorIncorrectPassword}
              onChange={async (event) => {
                setFormError({ ...formError, errorCurrentPassword: '' });
                setFormData({ ...formData, currentPassword: event.target.value });
                setFormError({ ...formError, errorIncorrectPassword: '' });
                setError('');
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              id="newPassword"
              data-testid="new-password"
              label="New Password"
              name="password"
              value={formData.newPassword}
              type={showPassword ? 'text' : 'password'}
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
              onChange={async (event) => {
                setFormData({ ...formData, newPassword: event.target.value });
                if (formData.confirmNewPassword !== event.target.value) {
                  setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
                } else {
                  setFormError({ ...formError, errorConfirmPassword: '' });
                }
                if (formData.currentPassword === '') {
                  setFormError({ ...formError, errorCurrentPassword: 'Enter your current password.' });
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              id="confirmPassword"
              data-testid="confirm-password"
              value={formData.confirmNewPassword}
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
              onChange={async (event) => {
                if (formData.newPassword !== event.target.value) {
                  setFormError({ ...formError, errorConfirmPassword: 'Passwords don\'t match.' });
                } else {
                  setFormError({ ...formError, errorConfirmPassword: '' });
                }
                setFormData({ ...formData, confirmNewPassword: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" sx={{ mt: 3, mb: 2 }} disabled={disableSubmit} onClick={handleSubmit}>
            Submit
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
