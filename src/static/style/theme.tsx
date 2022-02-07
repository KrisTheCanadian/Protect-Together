import { createTheme } from '@mui/material';
import { Shadows } from '@mui/material/styles/shadows';

//  Theme for material UI
const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
    button: {
      textTransform: 'none',
    },
  },
  shadows: Array(25).fill('none') as Shadows,

  palette: {
    primary: {
      main: '#434ce7',
    },
    info: {
      main: '#e4fff3',
      contrastText: '#0c9259',
      dark: '#c4ffe5',
    },
    secondary: {
      main: '#ebeefd',
      contrastText: '#434ce7',
      dark: '#d4dbff',
    },
    warning: {
      main: '#ffe4e6',
      dark: '#ffbdc2',
      contrastText: '#ff003d',
    },
    background: {
      default: '#f5f7fa',
    },
  },

});

export default theme;
