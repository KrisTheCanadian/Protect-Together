import React from 'react';
import '../static/style/App.css';
import { ThemeProvider } from '@mui/material/styles';
import {
  Route,
  Routes,
} from 'react-router-dom';
import RegisterPage from '../pages/auth/register';
import LoginPage from '../pages/auth/login';
import theme from '../static/style/theme';
import StyleGuide from './StyleGuide';
import AuthRequired from './auth';
import Dashboard from '../pages/auth/dashboard';
import ChangePassword from '../pages/auth/change';
import ForgotPassword from '../pages/auth/forgot';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage />}>
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<AuthRequired component={<Dashboard />} />} />
            <Route path="/change" element={<AuthRequired component={<ChangePassword />} />} />
            <Route path="/styleguide" element={<StyleGuide />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
