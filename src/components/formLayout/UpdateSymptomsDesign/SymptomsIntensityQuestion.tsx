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
  const tempSymptomsArray: string[] = [];

  const handleClick = (id: number, v: string, pt: number) => {
    if (buttonMap.get(id) !== v) {
      setButtonMap((prev) => new Map(prev).set(id, v));
      setError(false);
      setPointValue(pointValue + pt);
    } else {
      setButtonMap((prev) => new Map(prev).set(id, 'false'));
      setPointValue(pointValue - pt);
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
        tempSymptomsArray.push(`${v} ${questions[id].label}`);
      });
      setSymptomsArray(tempSymptomsArray);
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
                        onClick={() => handleClick(symptomID, 'Mild', questions[symptomID].p1)}
                        variant={buttonMap.get(symptomID) === 'Mild' ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Mild
                      </Button>
                      <Button
                        onClick={() => handleClick(symptomID, 'Moderate', questions[symptomID].p2)}
                        variant={buttonMap.get(symptomID) === 'Moderate' ? 'contained' : 'outlined'}
                        sx={{ marginRight: '0.5rem' }}
                      >
                        Moderate
                      </Button>
                      <Button
                        onClick={() => handleClick(symptomID, 'Severe', questions[symptomID].p3)}
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
