import React, { useState } from 'react';
import {
  Alert, Avatar, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select,
  TextField, Typography,
} from '@mui/material';

function AdminCreateAccount() {
  const [role, setRole] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [error, setError] = useState<string>('');

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
        style={{ minHeight: '100vh' }}
      >
        <Box
          p={3}
          sx={{
            bgcolor: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 6,
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '25%',
          }}
        >
          <Avatar sx={{
            m: 1, bgcolor: 'primary.main', width: 48, height: 48,
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
                  <MenuItem>Admin</MenuItem>
                  <MenuItem>Medical Professional</MenuItem>
                  <MenuItem>Third Party</MenuItem>
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
            // onClick={() => signUpWithEmailAndPassword()}
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
