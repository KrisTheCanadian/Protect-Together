/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, useContext } from 'react';
import { Alert, Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import validator from 'validator';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useNavigate } from 'react-router-dom';
import { DocumentData } from 'firebase/firestore';
import Header from '../../layout/Header';
import NotificationsButton from '../../layout/NotificationsButton';
import { auth, firestore } from '../../../config/firebase_config';
import { UserContext } from '../../../context/UserContext';

type FormData = {
  phone: string,
  weight: string,
  height: string,
  healthCardNumber: string,
  medicalConditions: string,
  notes: string,
};
type FormError = {
  errorPhoneNumber: string,
  errorWeight: string,
  errorHeight: string,
};

export default function AccountSettings() {
  const userDoc = firestore.collection('users').doc(auth.currentUser?.uid);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const patientRef = firestore.collection('users').doc(auth.currentUser?.uid);

  const [formData, setFormData] = useState<FormData>({
    phone: '',
    weight: '',
    height: '',
    healthCardNumber: '',
    medicalConditions: '',
    notes: '',
  });
  const [formError, setFormError] = useState<FormError>({
    errorPhoneNumber: '',
    errorWeight: '',
    errorHeight: '',
  });

  useEffect(() => {
    if (error === '' && formError.errorPhoneNumber === ''
        && formError.errorWeight === '' && formError.errorHeight === ''
        && (formData.phone !== ''
            || formData.height !== ''
            || formData.weight !== '' || formData.healthCardNumber !== ''
            || formData.notes !== '' || formData.medicalConditions !== ''
        )) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [error, formData, formError.errorHeight, formError.errorPhoneNumber, formError.errorWeight, disableSubmit]);

  useEffect(() => {
    const unsubscribe = patientRef.onSnapshot(async (patientDataSnapshot: any) => {
      const patient = patientDataSnapshot.data();
      if (patient) {
        const { phone } = patient;
        const { height } = patient;
        const { weight } = patient;
        const { healthCardNumber } = patient;
        const { medicalConditions } = patient;
        const { notes } = patient;
        setFormData({
          phone,
          weight,
          height,
          healthCardNumber,
          medicalConditions,
          notes,
        });
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateContactHealthtInfo = async () => {
    if (formData.phone !== '') await userDoc.update({ phone: formData.phone });
    if (formData.healthCardNumber !== '') await userDoc.update({ healthCardNumber: formData.healthCardNumber });
    if (formData.medicalConditions !== '') await userDoc.update({ medicalConditions: formData.medicalConditions });
    if (formData.notes !== '') await userDoc.update({ notes: formData.notes });
    if (formData.weight !== '') await userDoc.update({ weight: formData.weight });
    if (formData.height !== '') await userDoc.update({ height: formData.height });
  };

  const handleSubmit = async () => {
    await updateContactHealthtInfo().then(() => {
      if (error === '') navigate('/');
    });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title="Account Settings" subtitle="Change your account settings" />
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
          sx={{ my: 16,
            mx: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={12}>
              <Typography variant="h6">
                Contact Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                value={formData?.phone}
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
            <Grid item xs={12} sm={12}>
              <Typography variant="h6">
                Health Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                value={formData?.height}
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
                value={formData?.weight}
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
            <Grid item xs={12}>
              <TextField
                value={formData?.healthCardNumber}
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
                value={formData?.medicalConditions}
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
                value={formData?.notes}
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
          <Grid container justifyContent="flex-end">
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={disableSubmit}
              onClick={handleSubmit}
            >
              Submit
              <ArrowRightAltIcon />
            </Button>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}
