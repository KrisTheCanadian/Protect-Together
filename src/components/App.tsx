/* eslint-disable react/jsx-no-constructed-context-values */
import React from 'react';

import '../static/style/App.css';

import { ThemeProvider } from '@mui/material/styles';
import { Route, Routes } from 'react-router-dom';
import theme from '../static/style/theme';
import RegisterPage from '../pages/auth/register';
import LoginPage from '../pages/auth/login';
import StyleGuide from './layout/StyleGuide';
import AuthRequired from './auth';
import Dashboard from '../pages/dashboard/dashboard';
import ChangePassword from '../pages/auth/change';
import ForgotPassword from '../pages/auth/forgot';
import SymptomsForm from '../pages/symptomsForm/SymptomsForm';
import SymptomsUpdate from '../pages/symptomsForm/SymptomsUpdate';
import { LayoutContext } from '../context/LayoutContext';
import { UserProvider } from '../context/UserContext';
import MainSettings from '../pages/mainSettings/MainSettings';

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <LayoutContext.Provider value={{ open, setOpen }}>
        <div>
          <UserProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<AuthRequired component={<Dashboard />} />} />
              <Route path="/change" element={<AuthRequired component={<ChangePassword />} />} />
              <Route path="/styleguide" element={<StyleGuide />} />
              <Route path="/symptomsForm" element={<AuthRequired component={<SymptomsForm />} />} />
              <Route path="/symptomsUpdate" element={<AuthRequired component={<SymptomsUpdate />} />} />
              <Route path="/change" element={<AuthRequired component={<ChangePassword />} />} />
              <Route path="/mainSettings" element={<AuthRequired component={<MainSettings />} />} />
            </Routes>
          </UserProvider>
        </div>
      </LayoutContext.Provider>
    </ThemeProvider>
  );
}

export default App;
