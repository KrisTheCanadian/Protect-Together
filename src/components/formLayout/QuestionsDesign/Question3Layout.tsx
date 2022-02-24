import React from 'react';
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
  const [value, setValue] = React.useState('4');

  const buttons = [
    'Fever and/or chills',
    'Cough', 'Shortness of breath',
    'Sore throat',
    'Loss or change of sense of smell or taste',
    'Headache',
    'Extreme fatigue or tiredness',
    'Runny nose',
    'Sneezing',
    'Diarrhea',
    'Loss of appetite',
    'Nausea or vomiting',
    'Body or muscle aches',
    'None of the above',

  ];

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
                {buttons.map((name) => (
                  <FormControlLabel
                    key={name}
                    control={(
                      <Checkbox
                        name={name}
                      />
            )}
                    label={name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Container>

        </Container>

        <Container
          sx={{
            marginTop: '2rem',
          }}
          style={styles.centered}
        >
          <Button onClick={() => props.changeStatus(value)} type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
