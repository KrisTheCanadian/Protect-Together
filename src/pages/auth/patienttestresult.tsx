import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';

type Props = {
    handleTestClose: any;
  };
function UpdateTestResult({ handleTestClose }: Props) {
  const [testType, setTestType] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  return (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          p={16}
          sx={{
            bgcolor: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 6,
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              bgcolor: 'secondary.main',
              p: 4,
              mb: 2,
            }}
          >
            <Typography variant="h5">
              Which test did you take?
            </Typography>
            <FormControl>
              <RadioGroup
                value={testType}
                onChange={(event) => setTestType(event.target.value)}
              >
                <FormControlLabel value="PCRTest" control={<Radio />} label="PCR Test" />
                <FormControlLabel value="rapidAntigenTest" control={<Radio />} label="Rapid Antigen Test" />
                <FormControlLabel value="antibodyTest" control={<Radio />} label="Antibody Test" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              bgcolor: 'secondary.main',
              p: 4,
              mt: 2,
            }}
          >
            <Typography variant="h5">
              What was your result?
            </Typography>
            <FormControl>
              <RadioGroup
                value={testResult}
                onChange={(event) => setTestResult(event.target.value)}
              >
                <FormControlLabel value="positive" control={<Radio />} label="Covid-19 Positive" />
                <FormControlLabel value="negative" control={<Radio />} label="Covid-19 Negative" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Button
            type="button"
            onClick={() => {
              handleTestClose();
            }}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}

export default UpdateTestResult;
