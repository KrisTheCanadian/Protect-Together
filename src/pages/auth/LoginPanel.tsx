import React, { useState } from 'react';
import {
  Grid, Typography, useTheme, useMediaQuery,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const LoginPanel = (props: any) => {
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      item
      xs={false}
      sm={props.smallSize}
      md={props.medSize}
      display="flex"
      bgcolor="primary.main"
      direction="column"
      sx={{
        backgroundImage: `url(${props.blob})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '90%',
        backgroundPosition: 'center',
        overflowY: 'visible',
      }}
    >
      <Grid
        container
        item
        xs={2}
        direction="row"
        paddingLeft={3}
        sx={{
          Width: '100%',
          paddingLeft: phoneSize ? 1 : 3,
        }}
      >
        <Grid
          item
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <SentimentSatisfiedAltIcon
            style={{ color: '#FFFFFF', marginRight: '5px', fontSize: phoneSize ? '30px' : '40px' }}
          />
        </Grid>
        <Grid
          item
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            justifyContent="center"
            noWrap
            component="div"
            color="#FFFFFF"
            sx={{
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.7rem',
              },
            }}
          >
            Protect Together
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        xs={10}
      >
        <Grid
          item
          container
          direction="row"
          display="flex"
          alignItems="flex-end"
          justifyContent="center"
          sm={3}
        >
          <Typography
            variant="h5"
            color="#FFFFFF"
            textAlign="center"
            fontSize="2rem"
            width="100%"
            sx={{
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.5rem',
              },
            }}
          >
            {props.sentence}
            <Typography
              variant="h5"
              color="#FFFFFF"
              textAlign="center"
              fontSize="2.5rem"
              fontWeight="700"
              sx={{
                [theme.breakpoints.down('sm')]: {
                  fontSize: '1.7rem',
                },
              }}
            >
              {props.boldWord}
            </Typography>
          </Typography>
        </Grid>
        <Grid
          item
          sm={9}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            [theme.breakpoints.down('sm')]: {
              marginTop: 3,
              alignItems: 'flex-end',
            },
          }}
        >
          <img src={props.illustration} alt="hospital" style={{ width: '60%' }} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginPanel;
