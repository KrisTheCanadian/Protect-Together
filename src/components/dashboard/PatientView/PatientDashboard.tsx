/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState, useContext } from 'react';
// eslint-disable-next-line import/no-unresolved
import '../../../static/style/CovidData.css';
import {
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  useMediaQuery,
  useTheme,
  Modal,
} from '@mui/material';
import Iframe from 'react-iframe';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import { UserContext } from '../../../context/UserContext';
import { firestore } from '../../../config/firebase_config';

function PatientDashboard(props: { setContentId: any }) {
  const theme = useTheme();
  const matchesLg = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();
  const { state, update } = React.useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();

  const [country, setCountry] = useState('');
  const [cases, setCases] = useState('');
  const [recovered, setRecovered] = useState('');
  const [deaths, setDeaths] = useState('');
  const [todayCases, setTodayCases] = useState('');
  const [deathCases, setDeathCases] = useState('');
  const [recoveredCases, setRecoveredCases] = useState('');
  const [userInput, setUserInput] = useState('');

  const setData = ({
    country,
    cases,
    deaths,
    recovered,
    todayCases,
    todayDeaths,
    todayRecovered,
  }: any) => {
    setCountry(country);
    setCases(cases);
    setRecovered(recovered);
    setDeaths(deaths);
    setTodayCases(todayCases);
    setDeathCases(todayDeaths);
    setRecoveredCases(todayRecovered);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (props: { preventDefault: () => void; }) => {
    props.preventDefault();
    fetch(`https://disease.sh/v3/covid-19/countries/${userInput}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title={`Welcome ${state.firstName}`} subtitle="Stay safe">
        <div>
          {!user?.assignedDoctor && (
            <Button variant="contained" color="primary" sx={{ mr: 1 }} onClick={() => { navigate('/symptomsForm'); }}>
              Ask for Help
            </Button>
          )}
        </div>
      </Header>
      <MainContent>
        {user?.assignedDoctor && (
          <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: '#ebeefd',
                borderColor: '#434ce7',
                width: matchesLg ? '80%' : '70%',
              }}
              variant="outlined"
            >
              {user?.doctorName && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '1rem' }}>
                    <Typography variant="h5">
                      You have been connected to a doctor.
                    </Typography>
                    <Typography>
                      You are currently assigned to
                      {' '}
                      {user?.doctorName}
                      {' '}
                      .
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginTop: '1rem' }}
                      onClick={() => { props.setContentId(1); }}
                    >
                      Connect with your Doctor
                    </Button>
                  </div>
                </div>
              )}
              {!user?.doctorName && (
                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '1rem' }}>
                  <Typography variant="h5">
                    You have been added to our waitlist.
                  </Typography>
                  <Typography>
                    Due to a surge in demand, you are currently on the waitlist.
                    You will be connected with a doctor shortly.
                  </Typography>
                </div>
              )}
            </Paper>
          </Container>
        )}

        <Typography
          variant="h5"
          sx={{
            color: 'rgba(0, 0, 0, 0.87)',
            paddingTop: 1,
            mt: 3,
            fontWeight: 500,
          }}
        >
          Covid-19 Statistics
          <Typography sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.87)' }}>
            Do not forget to follow the safety policies and stay safe!
          </Typography>
        </Typography>
        <Box m={1} pt={1} />
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 550,
              }}
            >
              {/* <Chart /> */}
              <Iframe
                url="https://ourworldindata.org/grapher/total-cases-covid-19?tab=map&region=NorthAmerica"
                width="100%"
                height="600px"
              />
            </Paper>
          </Grid>
          {/* box 1 */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 390,
              }}
            >

              <div className="covidData">
                <h4> COVID-19 Statistics Per Country</h4>
                <div className="covidData__input">
                  <form onSubmit={handleSubmit}>
                    {/* input county name */}
                    <input onChange={handleSearch} placeholder="Enter Country Name" />
                    <br />
                    <button color="secondary" type="submit">Search</button>
                  </form>
                </div>

                {/* Showing the details of the country */}
                <div className="covidData__country__info">
                  <p>
                    Country Name :
                    {' '}
                    {country}
                    {' '}
                  </p>

                  <p>
                    Cases :
                    {' '}
                    {cases}
                  </p>

                  <p>
                    Deaths :
                    {' '}
                    {deaths}
                  </p>

                  <p>
                    Recovered :
                    {' '}
                    {recovered}
                  </p>

                  <p>
                    Cases Today :
                    {' '}
                    {todayCases}
                  </p>

                  <p>
                    Deaths Today :
                    {' '}
                    {deathCases}
                  </p>

                  <p>
                    Recovered Today :
                    {' '}
                    {recoveredCases}
                  </p>
                </div>
              </div>
              {/* <box 2 /> */}
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
              Basic Protective Measures Against Coronavirus
            </Typography>
          </Grid>
        </Grid>

        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="1." src="../../static/style/images/1.png" />
            </ListItemAvatar>
            <ListItemText
              primary="Clean your hands "
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  />
                  Wash hands often with soap and water for at least 20s.
                </>
              )}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="2." src="/static/images/avatar/2.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Wear a facemask"
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  />
                  You should wear facemask when you are around other poeple.
                </>
              )}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="3." src="/static/images/avatar/3.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary="Avoid touching your face"
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  />
                  Hands touch many surfaces and can pick up viruses.
                </>
              )}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="4." src="../../static/style/images/2.png" />
            </ListItemAvatar>
            <ListItemText
              primary="Avoid close contact"
              secondary={(
                <>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  />
                  Put distance between yourself and other people.
                </>
              )}
            />
          </ListItem>
        </List>
      </MainContent>
    </Box>
  );
}
export default PatientDashboard;
