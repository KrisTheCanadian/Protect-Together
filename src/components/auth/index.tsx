import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';
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
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user: any) => {
      resolve(user.uid);
    });
  });
}

const AuthRequired: React.FC<IAuthRouteProps> = ({ component }) => {
  const [user, setUser] = useState({ loggedIn: false });
  const { state, update } = React.useContext(UserContext);
  console.log('im in the component, chilling here');
  useEffect(() => {
    console.log('im chilling in the useeffect');
    const unsubscribe = onAuthStateChange(setUser);

    // retrieve user data when we have id
    getUserId().then((id) => {
      const unsub = onSnapshot(doc(firestore, 'users', `${id}`), (docu) => {
        console.log('Current data: ', docu.data());
        const data = docu.data();
        if (data) {
          update({ firstName: data.firstName });
        }
      });
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user.loggedIn) {
    return <NotFound />;
  }

  return <div>{component}</div>;
};

export default AuthRequired;
