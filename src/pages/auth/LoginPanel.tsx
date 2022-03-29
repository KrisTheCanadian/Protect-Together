import React, { useState } from 'react';
import {
  Grid, Typography, useTheme, useMediaQuery,
} from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const LoginPanel = (props: any) => {
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));
  const midSize = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
            sx={{
              color: '#FFFFFF',
              marginRight: '5px',
              fontSize: '40px',
              [theme.breakpoints.between('xs', 'sm')]: {
                fontSize: '30px',
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '35px',
              },
            }}
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
              [theme.breakpoints.between('xs', 'sm')]: {
                fontSize: '1.7rem',
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '1.8rem',
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
          xs={3}
          sm={6}
          md={3}
          sx={{
            [theme.breakpoints.between(0, props.verySmallSize)]: {
              display: 'none',
            },
          }}
        >
          <Typography
            variant="h5"
            color="#FFFFFF"
            textAlign="center"
            fontSize="2rem"
            width="100%"
            sx={{
              [theme.breakpoints.between('xs', 'sm')]: {
                fontSize: '1.5rem',
              },
              [theme.breakpoints.between('sm', 'md')]: {
                fontSize: '1.8rem',
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
                [theme.breakpoints.between('xs', 'sm')]: {
                  fontSize: '1.7rem',
                },
                [theme.breakpoints.between('sm', 'md')]: {
                  fontSize: '2rem',
                },
              }}
            >
              {props.boldWord}
            </Typography>
          </Typography>
        </Grid>
        <Grid
          item
          xs={9}
          sm={6}
          md={9}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            [theme.breakpoints.between(0, props.verySmallSize)]: {
              alignItems: 'flex-end',
            },
          }}
        >
          <img
            src={props.illustration}
            alt="hospital"
            style={{ width: midSize ? '90%' : '50%' }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LoginPanel;
