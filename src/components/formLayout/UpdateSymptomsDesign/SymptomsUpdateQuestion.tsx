import React, { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import symptoms from '../../../static/data/formSymptoms.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function SymptomsUpdateQuestion({ changeStatus, changePoints, changeSymptoms, addToSymptoms }: any) {
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down('md'));
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('false');
  const [checkedSymptoms, setCheckedSymptoms] = useState<number[]>([]);
  const [nextQuestions, setNextQuestions] = useState<number[]>([]);
  const [symptomsArray, setSymptomsArray] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [pointValue, setPointValue] = useState(0);

  const handleCheckboxChange = (symptom: any) => {
    if (symptom.id === 13) {
      setCheckedSymptoms([13]);
      setNextQuestions([]);
      setPointValue(0);
    } else if (checkedSymptoms.includes(symptom.id)) {
      setCheckedSymptoms(checkedSymptoms.filter((item) => item !== symptom.id));
      setPointValue(pointValue - symptom.pt);

      if (nextQuestions.includes(symptom.next)) {
        setNextQuestions(nextQuestions.filter((item) => item !== symptom.next));
      } else {
        setSymptomsArray(symptomsArray.filter((item) => item !== symptom.label));
      }
    } else {
      setCheckedSymptoms([...checkedSymptoms, symptom.id]);
      setPointValue(pointValue + symptom.pt);
      if (symptom.next !== -1) {
        setNextQuestions([...nextQuestions, symptom.next]);
      } else {
        setSymptomsArray([...symptomsArray, symptom.label]);
      }
    }
  };

  useEffect(() => {
    if (checkedSymptoms.includes(13) && checkedSymptoms.length > 1) {
      setCheckedSymptoms(checkedSymptoms.filter((item) => item !== 13));
    }
  }, [checkedSymptoms]);

  useEffect(() => {
    if (value !== 'false') {
      changeStatus(value);
    }
  }, [changeStatus, value]);

  const handleSubmit = () => {
    if (checkedSymptoms.length === 0) {
      setError(true);
    } else {
      changePoints(pointValue);
      if (nextQuestions.length !== 0) {
        if (symptomsArray.length !== 0) {
          addToSymptoms(symptomsArray, false);
        }
        setValue('2');
        changeSymptoms(nextQuestions);
      } else {
        if (symptomsArray.length !== 0) {
          addToSymptoms(symptomsArray, true);
        }
        setValue('response');
      }
    }
  };

  return (
    <div data-testid="symptom_update" style={{ display: 'flex' }}>
      <Paper
        sx={{
          margin: 'auto',
          padding: 4,
          marginTop: phoneSize ? 4 : 3,
          paddingTop: midSize ? 20 : 3,
        }}
      >
        <Box
          // minHeight="95vh"
          width="100%"
          flexDirection="column"
          sx={{
            flexGrow: 1,
            marginBottom: 1 }}
          style={styles.centered}
        >
          <Container
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ marginTop: 1 }}>
              Have you noticed any changes in your symptoms?
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 400, marginTop: 1, marginBottom: 3 }}>
              Choose any/all that are new, worsening,
              and not related to other known causes or conditions you already have.
            </Typography>
            <Container
              sx={{ display: 'flex',
                justifyContent: 'center',
                width: midSize ? '100%' : '70%',
              }}
            >
              <FormControl component="fieldset">
                <FormGroup>
                  {symptoms.map((symptom) => (
                    <FormControlLabel
                      sx={{
                        borderBottom: 1,
                        borderColor: '#adaeaf',
                      }}
                      key={Math.random()}
                      control={(
                        <Checkbox
                          data-testid="checkbox_update"
                          onChange={() => handleCheckboxChange(symptom)}
                          checked={checkedSymptoms.includes(symptom.id)}
                          name={symptom.label}
                        />
              )}
                      label={symptom.label}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Container>

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
        </Box>
      </Paper>
    </div>
  );
}
