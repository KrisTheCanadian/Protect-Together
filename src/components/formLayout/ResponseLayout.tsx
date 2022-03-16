import React from 'react';
import { Container, Typography, Box, CardMedia, Button } from '@mui/material';
import { Score } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Hospital from '../../static/style/images/Hospital.png';
import Symptoms from '../../static/style/images/Symptoms.png';
import Doctor from '../../static/style/images/Doctor.png';
import data from '../../static/data/responses.json';
import Firebase, { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function ResponseLayout({ selection, sendUserInfo }: any) {
  const navigate = useNavigate();

  const users = firestore.collection('users');

  const { state, update } = React.useContext(UserContext);

  const requestDoctor = async (patientScore: number) => {
    await users
      .doc(state.id)
      .update({
        score: patientScore,
        assignedDoctor: 'requestedDoctor',
      })
      .then(() => {
        const getDoctor = Firebase.functions().httpsCallable('requestDoctor');
        getDoctor();
        navigate('/dashboard');
      });
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        sx={{ flexGrow: 1 }}
        style={styles.centered}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {selection === 0 && (
              <img
                src={Hospital}
                style={{ maxWidth: '50%' }}
                alt="Emergency Room"
              />
            )}
            {selection === 1 && (
              <img src={Symptoms} style={{ maxWidth: '60%' }} alt="Symptoms" />
            )}
            {selection === 2 && (
              <img src={Doctor} style={{ maxWidth: '40%' }} alt="Doctor" />
            )}
          </CardMedia>
          <Container>
            <Typography
              variant="h4"
              sx={{
                marginTop: 1,
                flexGrow: 1,
                textAlign: 'center',
              }}
            >
              {data[selection]?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                marginTop: 1,
                flexGrow: 1,
                textAlign: 'center',
                marginBottom: 2,
              }}
            >
              {data[selection]?.subTitle}
            </Typography>
          </Container>
          <Container
            sx={{
              position: 'fixed',
              bottom: 10,
              width: '100%',
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#383737',
                marginRight: '1rem',
              }}
            >
              Would you like to be contacted by one of our doctors?
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                sendUserInfo();
                requestDoctor(1);
              }}
            >
              Yes
            </Button>
            <Button variant="text">No</Button>
          </Container>
        </Container>
      </Box>
    </div>
  );
}
