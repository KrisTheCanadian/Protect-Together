import React, { useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import questions from '../../../static/data/formQuestions.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question3Layout(props: any) {
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down('md'));
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = React.useState('false');
  const [checkedSymptoms, setCheckedSymptoms] = React.useState<number[]>([]);
  const [nextQuestions, setNextQuestions] = React.useState<number[]>([]);
  const [error, setError] = React.useState(false);

  const handleCheckboxChange = (symptom: any) => {
    if (symptom.id === 13) {
      setCheckedSymptoms([13]);
      setNextQuestions([]);
    } else if (checkedSymptoms.includes(symptom.id)) {
      setCheckedSymptoms(checkedSymptoms.filter((item) => item !== symptom.id));

      if (nextQuestions.includes(symptom.next)) {
        setNextQuestions(nextQuestions.filter((item) => item !== symptom.next));
      }
    } else {
      setCheckedSymptoms([...checkedSymptoms, symptom.id]);
      if (symptom.next !== -1) {
        setNextQuestions([...nextQuestions, symptom.next]);
      }

      console.log(checkedSymptoms);
    }
  };

  useEffect(() => {
    if (checkedSymptoms.includes(13) && checkedSymptoms.length > 1) {
      setCheckedSymptoms(checkedSymptoms.filter((item) => item !== 13));
    }
  }, [checkedSymptoms]);

  useEffect(() => {
    if (value !== 'false') {
      props.changeStatus(value);
    }
  }, [props, value]);

  const handleSubmit = () => {
    if (checkedSymptoms.length === 0) {
      setError(true);
    } else if (nextQuestions.length !== 0) {
      setValue('4');
      props.changeSymptoms(nextQuestions);
    } else {
      setValue('5');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        flexDirection="column"
        sx={{
          flexGrow: 1,
          marginTop: phoneSize ? 7 : 3,
          paddingTop: midSize ? 20 : 3,
          marginBottom: 3 }}
        style={styles.centered}
      >
        <Container
          sx={{
            marginLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 8,
              fontSize: '17px',
              paddingBottom: '3px',
              paddingTop: '3px',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            Question 3
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1 }}>
            In the last 10 days have you experienced any of these symptoms?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, marginTop: 1, marginBottom: 3 }}>
            Choose any/all that are new, worsening,
            and not related to other known causes or conditions you already have.
          </Typography>
          <Container
            sx={{ display: 'flex',
              justifyContent: 'center',
              borderRadius: '10%',
              backgroundColor: '#ffff',
              border: 2,
              borderColor: 'primary.main',
              width: midSize ? '70%' : '50%',
              paddingBottom: 2,
              paddingTop: 2,
            }}
          >
            <FormControl component="fieldset">
              <FormGroup>
                {questions.map((symptom) => (
                  <FormControlLabel
                    key={Math.random()}
                    control={(
                      <Checkbox
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
    </div>
  );
}
