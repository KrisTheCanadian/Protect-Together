/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
// eslint-disable-next-line import/no-unresolved
import './CovidData.css';
import {
  Button,
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
} from '@mui/material';
import Iframe from 'react-iframe';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Header from '../layout/Header';
import MainContent from '../layout/MainContent';
import SideBar from '../layout/SideBar';
import { UserContext } from '../../context/UserContext';
import UpdateTestResult from './patienttestresult';
import theme from '../../static/style/theme';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: 0,
  },
  boxShadow: 0,
  margin: 0,
  p: 4,
};

function PatientDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenQuiz = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();
  const [testOpen, setTestOpen] = useState(false);
  const handleTestOpen = () => setTestOpen(true);
  const handleTestClose = () => setTestOpen(false);
  const { state, update } = React.useContext(UserContext);

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
    fetch('https://disease.sh/v3/covid-19/countries')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
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
      <CssBaseline />
      <Header title={`Welcome ${state.firstName}`} subtitle="Stay safe">
        <Button variant="contained" color="info" sx={{ mr: 1 }} onClick={handleTestOpen}>
          Add Covid-19 Test
        </Button>
        <Button variant="contained" color="primary" onClick={() => { navigate('/symptomsForm'); }}>
          Ask for Help
        </Button>
      </Header>
      <SideBar>
        <List>
          <ListItem button key="Dashboard">
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      <MainContent>
        {/* <Typography paragraph>{state.firstName}</Typography> */}
        {/* <Box m={2} pt={3} /> */}
        <Typography
          variant="h4"
          sx={{
            color: 'rgba(0, 0, 0, 0.87)',
            paddingTop: 1,
          }}
        >
          Covid-19 News

          <Typography sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.87)' }}>
            Do not forget to follow the safety policies and stay safe!
          </Typography>
          <Typography sx={{ fontSize: '1rem', color: 'rgba(0, 0, 0, 0.87)' }}>
            Cumulative Covid-19 Statics for Canada
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
                height: 400,
              }}
            >
              {/* <Chart /> */}
              <Iframe
                // eslint-disable-next-line max-len
                url="https://covid19canada.maps.arcgis.com/apps/Minimalist/index.html?appid=b3baccb0f30e4516b8e64009b3383f55"
                position="absolute"
                width="55%"
                id="myId"
                className="myClassname"
                height="57%"
                styles={{ height: '25px' }}
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
                height: 400,
              }}
            >

              <div className="covidData">
                {/* <h1>COVID-19 CASES COUNTRY WISE</h1> */}
                <div className="covidData__input">
                  <form onSubmit={handleSubmit}>
                    {/* input county name */}
                    <input onChange={handleSearch} placeholder="Enter Country Name" />
                    <br />
                    <button type="submit">Search</button>
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

      </MainContent>

      <Modal
        open={testOpen}
        onClose={handleTestClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateTestResult handleTestClose={handleTestClose} />
        </Box>
      </Modal>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          quiz
        </Box>
      </Modal>
    </Box>
  );
}
export default PatientDashboard;
