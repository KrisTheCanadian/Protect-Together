import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../../config/firebase_config';

import Hospital from '../../static/style/images/Hospital.png';
import ProtectTogether from '../../static/style/images/talktodoctor.png';
import Blob from '../../static/style/images/centerblob.png';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));
  const midSize = useMediaQuery(theme.breakpoints.down('md'));

  const navigate = useNavigate();

  const LoginWithEmailAndPassword = () => {
    if (error !== '') setError('');

    auth.signInWithEmailAndPassword(email, password)
      .then(async (data) => {
        const user = (await firestore.collection('users').doc(data.user?.uid).get()).data();
        navigate('/dashboard');
      }).catch(() => {
        setError('Login Failed: Your email or password is incorrect');
      });
  };

  auth.onAuthStateChanged((user: any) => {
    if (user) {
      navigate('/dashboard');
    }
  });

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={5} component={Paper} elevation={6} square display="flex" alignItems="center" justifyContent="center">
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
            Welcome
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              inputProps={{ 'data-testid': 'email' }}
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              inputProps={{ 'data-testid': 'password' }}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="button"
              onClick={() => LoginWithEmailAndPassword()}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgot" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Dont have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        sm={6}
        md={7}
        display="flex"
        bgcolor="primary.main"
        direction="column"
        sx={{
          backgroundImage: `url(${Blob})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '90%',
          backgroundPosition: 'center',
          overflowY: 'visible',
        }}
      >
        <Grid
          container
          item
          xs={2}
          direction="row"
          paddingLeft={3}
          sx={{
            Width: '100%',
            paddingLeft: phoneSize ? 1 : 3,
          }}
        >
          <Grid
            item
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <SentimentSatisfiedAltIcon
              style={{ color: '#FFFFFF', marginRight: '5px', fontSize: phoneSize ? '30px' : '40px' }}
            />
          </Grid>
          <Grid
            item
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              variant="h4"
              display="flex"
              alignItems="center"
              justifyContent="center"
              noWrap
              component="div"
              color="#FFFFFF"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.7rem',
                },
              }}
            >
              Protect Together
            </Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={10}
        >
          <Grid
            item
            container
            direction="row"
            display="flex"
            alignItems="flex-end"
            justifyContent="center"
            sm={3}
          >
            <Typography
              variant="h5"
              color="#FFFFFF"
              textAlign="center"
              fontSize="2rem"
              width="100%"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.5rem',
                },
              }}
            >
              Connect with a Doctor from
              <Typography
                variant="h5"
                color="#FFFFFF"
                textAlign="center"
                fontSize="2.5rem"
                fontWeight="700"
                sx={{
                  [theme.breakpoints.down('sm')]: {
                    fontSize: '1.7rem',
                  },
                }}
              >
                Anywhere.
              </Typography>
            </Typography>
          </Grid>
          <Grid
            item
            sm={9}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              [theme.breakpoints.down('sm')]: {
                marginTop: 3,
                alignItems: 'flex-end',
              },
            }}
          >
            <img src={ProtectTogether} alt="hospital" style={{ width: '50%' }} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
