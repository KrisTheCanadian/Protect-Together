import React, { useState, useEffect } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import validator from 'validator';
import { auth, firestore, createUserFirebase } from '../../config/firebase_config';
import generatePassword from '../../utils/generatePassword.js';
import { medicalConstants } from '../../static/data/constants';

type Props = {
  handleClose: any;
};

type FormData = {
  role: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

type FormError = {
  errorEmail: string,
  errorPhoneNumber: string,
  errorSignup: string,
};

const formDataDefaultValues: FormData = {
  role: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const formErrorDefaultValues: FormError = {
  errorEmail: '',
  errorPhoneNumber: '',
  errorSignup: '',
};

// form state objects
function AdminCreateAccount({ handleClose }: Props) {
  const [formData, setFormData] = useState<FormData>(formDataDefaultValues);
  const [formError, setFormError] = useState<FormError>(formErrorDefaultValues);
  const [error, setError] = useState<string>('');

  // save user to database
  const addUserInfo = async (userCreds: any) => {
    const uid = userCreds?.user?.uid;
    const users = firestore.collection('users');
    if (uid === undefined) {
      setError('An error has occured. Please try again later.');
    }
    let staffMember: any = {
      UID: uid,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phoneNumber,
      role: formData.role,
    };
    if (formData.role === 'medical') {
      staffMember = {
        ...staffMember,
        availableSlots: medicalConstants.PATIENT_DEFAULT_SLOTS,
        patientSlots: medicalConstants.PATIENT_DEFAULT_SLOTS,
        filledSlots: 0,
        availabilities:
        [{ id: 1, startTime: '9:0', endTime: '17:0' },
          { id: 2, startTime: '9:0', endTime: '17:0' },
          { id: 3, startTime: '9:0', endTime: '17:0' },
          { id: 4, startTime: '9:0', endTime: '17:0' },
          { id: 5, startTime: '9:0', endTime: '17:0' }],
      };
    }

    await users.doc(uid).set(staffMember).then(() => {
      auth.sendPasswordResetEmail(formData.email);
    });
  };

  const signUpWithEmailAndPassword = (): boolean => {
    const password = generatePassword();
    createUserFirebase.auth().createUserWithEmailAndPassword(formData.email, password)
      .then((userCreds) => {
        addUserInfo(userCreds);
      }).catch((err: { code: string | string[]; }) => {
        if (err.code.includes('auth/weak-password')) {
          setFormError({ ...formError, errorSignup: 'Please enter a stronger password.' });
        } else if (err.code.includes('auth/email-already-in-use')) {
          setFormError({ ...formError, errorSignup: 'Email already in use.' });
        } else {
          setFormError({ ...formError, errorSignup: 'Unable to register. Please try again later.' });
        }
        return false;
      });
    return true;
  };

  const handleSubmit = (event: any) => {
    if (formError.errorEmail !== '' || formError.errorPhoneNumber !== '' || !signUpWithEmailAndPassword()) {
      event.preventDefault();
    }
    handleClose();
  };

  useEffect(() => {
    if (formError.errorEmail !== '') {
      setError('Please enter a valid email address.');
    } else if (formError.errorPhoneNumber !== '') {
      setError('Please enter a valid phone number.');
    } else if (formError.errorSignup !== '') {
      setError(formError.errorSignup);
    } else {
      setError('');
    }
  }, [formError.errorEmail, formError.errorPhoneNumber, formError.errorSignup]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        p={3}
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',

        }}
      >
        <Avatar
          sx={{
            m: 1,
            bgcolor: 'primary.main',
            width: 48,
            height: 48,
          }}
        />
        <Typography component="h1" variant="h4">
          Create Account
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role">Account Type</InputLabel>
              <Select
                labelId="role"
                label="Account Type"
                required
                id="role"
                inputProps={{ 'data-testid': 'account-type' }}
                value={formData.role}
                onChange={(event) => setFormData({ ...formData, role: event.target.value })}
                autoFocus
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="medical">Medical Professional</MenuItem>
                <MenuItem value="thirdParty"> Third Party</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              inputProps={{ 'data-testid': 'first-name' }}
              label="First Name"
              value={formData.firstName}
              onChange={(event) => setFormData({ ...formData, firstName: event.target.value })}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              inputProps={{ 'data-testid': 'last-name' }}
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(event) => setFormData({ ...formData, lastName: event.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              inputProps={{ 'data-testid': 'email' }}
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
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
              id="phoneNumber"
              inputProps={{ 'data-testid': 'phone-number' }}
              label="Phone Number"
              name="phoneNumber"
              autoComplete="phone-number"
              value={formData.phoneNumber}
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: 3, mb: 2 }}
        >
          Send Activation Link to Email
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
}

export default AdminCreateAccount;
