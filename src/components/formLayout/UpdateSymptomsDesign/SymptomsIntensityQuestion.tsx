import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, useMediaQuery, useTheme, Paper, Grid } from '@mui/material';
import questions from '../../../static/data/formSymptomsIntensity.json';
import SymptomsUpdateQuestion from './SymptomsUpdateQuestion';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function SymptomsIntensity({ changeStatus, selection }: any) {
  const [ansOne, setAnsOne] = useState(false);
  const [ansTwo, setAnsTwo] = useState(false);
  const [ansThree, setAnsThree] = useState(false);
  const [value, setValue] = useState('false');
  const [error, setError] = useState(false);
  const [pointValue, setPointValue] = useState(0);
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [symptomIntensityAnswer, setSymptomIntensityAnswer] = useState<string[]>([]);
  const dict: any = {};
  const [dictionaryState, setDictionaryState] = useState();

  // eslint-disable-next-line array-callback-return
  selection.map((id: any) => {
    dict[id] = { Mild: false, Moderate: false, Severe: false };
  });
  console.log(dict);
  setDictionaryState(dict);
  console.log(dictionaryState);

  const handleClickOne = (id: any) => {
    if (!dict[id].Mild) {
      setError(false);
      dict[id].Mild = true;
      dict[id].Moderate = false;
      dict[id].Severe = false;
    }
    console.log(dict);
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setError(false);
      // setPointValue(questions[id].p1);
    } else {
      setAnsOne(false);
    }
  };

  const handleClickTwo = () => {
    if (ansTwo !== true) {
      setAnsTwo(true);
      setAnsOne(false);
      setAnsThree(false);
      setError(false);
      // setPointValue(questions[id].p2);
    } else {
      setAnsTwo(false);
    }
  };

  const handleClickThree = () => {
    if (ansThree !== true) {
      setAnsThree(true);
      setAnsOne(false);
      setAnsTwo(false);
      setError(false);
      // setPointValue(questions[id].p3);
    } else {
      setAnsThree(false);
    }
  };

  useEffect(() => {
    if (value !== 'false') {
      changeStatus(value);
    }
  }, [changeStatus, value]);

  const handleSubmit = () => {
    if (!ansOne && !ansTwo && !ansThree) {
      setError(true);
    } else {
      setAnsOne(false);
      setAnsTwo(false);
      setAnsThree(false);
      setValue('response');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        flexDirection="column"
        sx={{ flexGrow: 1, margin: 'auto' }}
        style={styles.centered}
      >
        <Paper
          sx={{
            width: midSize ? '100%' : 'auto',
            padding: 4,
            margin: 'auto',
          }}
        >
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ marginBottom: 3 }}>
              Indicate the severity your symptoms
            </Typography>
            {selection.map((symptom: number) => (
              <Container
                sx={{
                  justifyContent: 'center',
                  // width: midSize ? '100%' : '70%',
                  margin: 0,
                  paddingBottom: 2,
                  paddingTop: 2,
                  borderBottom: 1,
                  // border: 1,
                  alignItems: 'center',
                  // borderRadius: 6,
                  borderColor: '#adaeaf',
                }}
              >
                <Grid
                  container
                  direction="row"
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={4}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        marginTop: 0.75,
                      }}
                    >
                      {' '}
                      {questions[symptom]?.label}
                      {' '}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={8}
                    sx={{ display: 'flex',
                      alignItems: 'center' }}
                  >
                    <Container sx={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      // width: matchesSm ? '100%' : '80%',
                    }}
                    >
                      <Button
                        onClick={() => handleClickOne(symptom)}
                        variant={dict[symptom].Mild ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Mild
                      </Button>
                      <Button
                        onClick={handleClickTwo}
                        variant={ansTwo ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Moderate
                      </Button>
                      <Button
                        onClick={handleClickThree}
                        variant={ansThree ? 'contained' : 'outlined'}
                      >
                        Severe
                      </Button>
                    </Container>
                  </Grid>
                </Grid>
              </Container>
            ))}
          </Container>
          <Container
            sx={{
              // marginLeft: '1rem',
              marginTop: '2rem',
              flexDirection: 'column',
            }}
            style={styles.centered}
          >
            {error && (
            <p className="validationError">Please select an option.</p>
            )}
            <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </Container>
        </Paper>
      </Box>
    </div>
  );
}
