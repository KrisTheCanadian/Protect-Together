import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, useMediaQuery, useTheme, Paper, Grid } from '@mui/material';
import questions from '../../../static/data/formSymptomsIntensity.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function SymptomsIntensity({ changeStatus, selection, changePoints, addToSymptoms }: any) {
  const [value, setValue] = useState('false');
  const [error, setError] = useState(false);
  const [pointValue, setPointValue] = useState(0);
  const [symptomsArray, setSymptomsArray] = useState<string[]>([]);
  const [buttonMap, setButtonMap] = useState(new Map());
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down('md'));
  const tempSymptomsArr: string[] = [];

  const handleClickOne = (id: number) => {
    if (buttonMap.get(id) !== 'Mild') {
      setButtonMap((prev) => new Map(prev).set(id, 'Mild'));
      setError(false);
      setPointValue(pointValue + questions[id].p1);
    } else {
      setButtonMap((prev) => new Map(prev).set(id, 'false'));
      setPointValue(pointValue - questions[id].p1);
      setError(true);
    }
  };

  const handleClickTwo = (id: number) => {
    if (buttonMap.get(id) !== 'Moderate') {
      setButtonMap((prev) => new Map(prev).set(id, 'Moderate'));
      setError(false);
      setPointValue(pointValue + questions[id].p2);
    } else {
      setButtonMap((prev) => new Map(prev).set(id, 'false'));
      setPointValue(pointValue - questions[id].p2);
      setError(true);
    }
  };

  const handleClickThree = (id: number) => {
    if (buttonMap.get(id) !== 'Severe') {
      setButtonMap((prev) => new Map(prev).set(id, 'Severe'));
      setError(false);
      setPointValue(pointValue + questions[id].p3);
    } else {
      setButtonMap((prev) => new Map(prev).set(id, 'false'));
      setPointValue(pointValue - questions[id].p3);
      setError(true);
    }
  };

  useEffect(() => {
    selection.forEach((id: number) => {
      setButtonMap(buttonMap.set(id, 'false'));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value !== 'false') {
      addToSymptoms(symptomsArray, true);
      changeStatus(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeStatus, value]);

  const handleSubmit = () => {
    if (!error) {
      changePoints(pointValue);
      buttonMap.forEach((v, id) => {
        tempSymptomsArr.push(`${v} ${questions[id].label}`);
      });
      setSymptomsArray(tempSymptomsArr);
      setValue('response');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        flexDirection="column"
        sx={{ flexGrow: 1,
          margin: 'auto',
          paddingTop: midSize ? 15 : 3 }}
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
            {selection.map((symptomID: number) => (
              <Container
                sx={{
                  justifyContent: 'center',
                  margin: 0,
                  paddingBottom: 2,
                  paddingTop: 2,
                  borderBottom: 1,
                  alignItems: 'center',
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
                      {questions[symptomID]?.label}
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
                    }}
                    >
                      <Button
                        onClick={() => handleClickOne(symptomID)}
                        variant={buttonMap.get(symptomID) === 'Mild' ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Mild
                      </Button>
                      <Button
                        onClick={() => handleClickTwo(symptomID)}
                        variant={buttonMap.get(symptomID) === 'Moderate' ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Moderate
                      </Button>
                      <Button
                        onClick={() => handleClickThree(symptomID)}
                        variant={buttonMap.get(symptomID) === 'Severe' ? 'contained' : 'outlined'}
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
