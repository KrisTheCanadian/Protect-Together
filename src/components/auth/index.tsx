/* eslint-disable react-hooks/exhaustive-deps */
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import NotFound from '../../pages/NotFound';

interface IAuthRouteProps {
  component: JSX.Element;
}

function onAuthStateChange(callback: any) {
  return auth.onAuthStateChanged((user: any) => {
    if (user) {
      callback({ loggedIn: true });
    } else {
      callback({ loggedIn: false });
    }
  });
}
// https://rnfirebase.io/firestore/usage
// get the user id asynch
function getUserId() {
  return new Promise<string>((resolve, reject) => {
    auth.onAuthStateChanged((user: any) => {
      if (user) resolve(user.uid);
    });
  });
}

const AuthRequired: React.FC<IAuthRouteProps> = ({ component }) => {
  const [user, setUser] = useState({ loggedIn: false });
  const { update } = React.useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);

    // retrieve user data when we have id
    getUserId().then((id) => {
      onSnapshot(doc(firestore, 'users', `${id}`), (docu) => {
        const data = docu.data();
        if (data) {
          update({
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            id,
          });
        }
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (!user.loggedIn) {
    return <NotFound />;
  }

  return <div>{component}</div>;
};

export default AuthRequired;
