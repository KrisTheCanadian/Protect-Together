import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { auth, firestore, createUserFirebase } from '../../config/firebase_config';
import generatePassword from '../../utils/generatePassword.js';
import theme from '../../static/style/theme';

type Props = {
  handleClose: any;
};
// form state objects
function AdminCreateAccount({ handleClose }: Props) {
  const [role, setRole] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');

  // save user to database
  const addUserInfo = async (userCreds: any) => {
    const uid = userCreds?.user?.uid;
    const users = firestore.collection('users');
    if (uid === undefined) {
      setError('An error has occured. Please try again later.');
    }
    await users.doc(uid).set({
      UID: uid,
      firstName,
      lastName,
      email,
      phone: phoneNumber,
      role,
    }).then(() => {
      auth.sendPasswordResetEmail(email);
    });
  };

  const signUpWithEmailAndPassword = () => {
    const password = generatePassword();
    createUserFirebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCreds) => {
        addUserInfo(userCreds);
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
    <Box
      sx={{
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"

      >
        <Box
          p={16}
          sx={{
            [theme.breakpoints.down('sm')]: {
              padding: 4,
            },
            bgcolor: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 6,
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10,

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
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
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
          </Grid>
          <Button
            type="button"
            onClick={() => {
              signUpWithEmailAndPassword();
              handleClose();
            }}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Activation Link to Email
          </Button>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>
    </Box>
  );
}

export default AdminCreateAccount;
