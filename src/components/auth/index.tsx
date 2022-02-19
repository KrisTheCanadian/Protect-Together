import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import NotFound from '../../pages/NotFound';

interface IAuthRouteProps {
  component: JSX.Element
}

function onAuthStateChange(callback : any) {
  return auth.onAuthStateChanged((user: any) => {
    if (user) {
      callback({ loggedIn: true });
    } else {
      callback({ loggedIn: false });
    }
  });
}

const AuthRequired: React.FC<IAuthRouteProps> = ({ component }) => {
  const [user, setUser] = useState({ loggedIn: false });
  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  if (!user.loggedIn) {
    return (
      <NotFound />
    );
  }

  return (
    <div>{component}</div>
  );
};

export default AuthRequired;
