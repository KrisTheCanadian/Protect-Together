import React, { useState, useEffect } from 'react';
import {
  Alert, Avatar, Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton,
  InputAdornment, InputLabel, Link, MenuItem, MobileStepper, Select, TextField, Typography,
  Paper, useTheme, useMediaQuery,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import validator from 'validator';

import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../config/firebase_config';

type FormData = {
    dob: Date | null,
    weight: string,
    height: string,
    sex: string,
    healthCardNumber: string,
    medicalConditions: string,
    additionalNotes: string,
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
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState<FormData>({
    dob: null,
    weight: '',
    height: '',
    sex: '',
    healthCardNumber: '',
    medicalConditions: '',
    additionalNotes: '',
  });

  const [formError, setFormError] = useState<FormError>({
    errorEmail: '',
    errorPhoneNumber: '',
    errorConfirmPassword: '',
    errorWeight: '',
    errorHeight: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (formError.errorWeight === '' && formError.errorHeight === ''
                && formData.dob !== null && formData.height !== '' && formData.healthCardNumber !== '') {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [formData, formError.errorConfirmPassword, formError.errorEmail, formError.errorHeight,
    formError.errorPhoneNumber, formError.errorWeight, disableSubmit]);

  const updateHealthInfo = async () => {
    const uid = auth.currentUser?.uid;
    const users = firestore.collection('users').doc(uid);
    await users.update({
      dateOfBirth: formData.dob,
      healthCardNumber: formData.healthCardNumber,
      height: formData.height,
      medicalConditions: formData.medicalConditions,
      notes: formData.additionalNotes,
      sex: formData.sex,
      weight: formData.weight,
    }).then(() => { navigate('/'); });
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
          my: 1,
          mx: 10,
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          Health Information
        </Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
          <Grid item xs={12} sm={6}>
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
              name="additionalNotes"
              label="Additional Notes"
              id="additionalNotes"
              autoComplete="additionalNotes"
              onChange={(event) => {
                setFormData({ ...formData, additionalNotes: event.target.value });
              }}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container justifyContent="flex-end">
          <Button variant="contained" disabled={disableSubmit} onClick={updateHealthInfo}>
            Submit
            <ArrowRightAltIcon />
          </Button>
        </Grid>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
}
