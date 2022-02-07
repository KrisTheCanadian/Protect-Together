import React from 'react';
import { Route } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import NotFound from '../../pages/NotFound';

interface IAuthRouteProps {
  component: JSX.Element
}

const AuthRequired: React.FC<IAuthRouteProps> = ({ component }) => {
  if (!auth.currentUser) {
    return (
      <NotFound />
    );
  }

  return (
    <div>{component}</div>
  );
};

export default AuthRequired;
