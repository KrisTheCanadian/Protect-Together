/* eslint-disable react/jsx-no-constructed-context-values */
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
import StyleGuide from './layout/StyleGuide';
import AuthRequired from './auth';
import Dashboard from '../pages/auth/dashboard';
import ChangePassword from '../pages/auth/change';
import ForgotPassword from '../pages/auth/forgot';
import Layout from './layout/Layout';
import { LayoutContext } from './layout/LayoutContext';

function App() {
  const [open, setOpen] = React.useState(false);
  return (
    <ThemeProvider theme={theme}>
      <div>
        <LayoutContext.Provider value={{ open, setOpen }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<AuthRequired component={<Dashboard />} />} />
            <Route path="/change" element={<AuthRequired component={<ChangePassword />} />} />
            <Route path="/styleguide" element={<StyleGuide />} />
            <Route path="/layout" element={<Layout />} />
          </Routes>
        </LayoutContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
