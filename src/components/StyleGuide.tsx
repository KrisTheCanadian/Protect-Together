import {
  Box, Button, Grid, Typography, useTheme,
} from '@mui/material';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import codeTheme from '../static/codeTheme';

function StyleGuide() {
  const theme = useTheme();

  const boxStyle = {
    width: '100%', maxWidth: 700, padding: '20px', boxSizing: 'border-box',
  };

  const circleStyle = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
  };

  return (
    <div style={{ marginTop: '50px' }}>
      <Grid
        container
        spacing={2}
        columns={12}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Box sx={boxStyle}>
          <Typography variant="h3" component="div" gutterBottom>
            Style Guide
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h4" component="div" gutterBottom>
            Buttons
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Button variant="contained">Main Button</Button>
          <SyntaxHighlighter language="jsx" style={codeTheme}>
            {'<Button variant="contained">Main Button</Button>'}
          </SyntaxHighlighter>

        </Box>
        <Box sx={boxStyle}>
          <Button variant="contained" color="secondary">Secondary Button</Button>
          <SyntaxHighlighter language="jsx" style={codeTheme}>
            {'<Button variant="contained" color="secondary">Secondary</Button>'}
          </SyntaxHighlighter>

        </Box>
        <Box sx={boxStyle}>
          <Button variant="contained" color="info">Info Button</Button>
          <SyntaxHighlighter language="jsx" style={codeTheme}>
            {'<Button variant="contained" color="info">Info Button</Button>'}
          </SyntaxHighlighter>

        </Box>

        <Box sx={boxStyle}>
          <Button variant="contained" color="warning">Warning Button</Button>
          <SyntaxHighlighter language="jsx" style={codeTheme}>
            {'<Button variant="contained" color="info">Info Button</Button>'}
          </SyntaxHighlighter>

        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h3" component="div" gutterBottom>
            Typography
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h1" component="div" gutterBottom>
            h1. Heading
          </Typography>
          <Typography variant="h2" gutterBottom component="div">
            h2. Heading
          </Typography>
          <Typography variant="h3" gutterBottom component="div">
            h3. Heading
          </Typography>
          <Typography variant="h4" gutterBottom component="div">
            h4. Heading
          </Typography>
          <Typography variant="h5" gutterBottom component="div">
            h5. Heading
          </Typography>
          <Typography variant="h6" gutterBottom component="div">
            h6. Heading
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
          </Typography>
          <Typography variant="subtitle2" gutterBottom component="div">
            subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur
          </Typography>
          <Typography variant="body1" gutterBottom>
            body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
          </Typography>
          <Typography variant="body2" gutterBottom>
            body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
            blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
            neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
            quasi quidem quibusdam.
          </Typography>
          <Typography variant="button" display="block" gutterBottom>
            button text
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            caption text
          </Typography>
          <Typography variant="overline" display="block" gutterBottom>
            overline text
          </Typography>
          <SyntaxHighlighter language="jsx" style={codeTheme}>
            {'<Typography variant="h1" component="div" gutterBottom>h1. Heading</Typography>'}
          </SyntaxHighlighter>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="h3" component="div" gutterBottom>
            Colors
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Grid container spacing={8}>

            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Primary Main
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.primary.main }} />

            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Primary Contrast Text
              </Typography>
              <div style={{
                ...circleStyle,
                background: theme.palette.primary.contrastText,
                borderWidth: '1px',
                borderColor: 'grey',
                borderStyle: 'solid',
              }}
              />

            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Secondary Main
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.secondary.main }} />

            </Grid>

            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Secondary Contrast Text
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.secondary.contrastText }} />

            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Info Main
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.info.main }} />

            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Info Contrast Text
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.info.contrastText }} />

            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Warning Main
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.warning.main }} />

            </Grid>
            <Grid item xs={6}>
              <Typography variant="h5" component="div">
                Warning Contrast Text
              </Typography>
              <div style={{ ...circleStyle, background: theme.palette.warning.contrastText }} />

            </Grid>
            <Grid item xs={12}>
              <SyntaxHighlighter language="jsx" style={codeTheme}>
                const theme = useTheme(); `\nsecond`
              </SyntaxHighlighter>
              <SyntaxHighlighter language="jsx" style={codeTheme}>
                theme.palette.warning.contrastText
              </SyntaxHighlighter>
              <SyntaxHighlighter language="jsx" style={codeTheme}>
                theme.palette.warning.main
              </SyntaxHighlighter>
            </Grid>

          </Grid>
        </Box>

      </Grid>
    </div>
  );
}

export default StyleGuide;
