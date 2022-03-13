import { TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../../config/firebase_config';

type Props = {
  handleClose: any;
  selectedUser: string;
};

type FormData = {
  role: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

type FormError = {
  errorEmail: string,
  errorPhoneNumber: string,
  errorSignup: string,
};

const formDataDefaultValues: FormData = {
  role: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const formErrorDefaultValues: FormError = {
  errorEmail: '',
  errorPhoneNumber: '',
  errorSignup: '',
};

export const EditUser = ({ handleClose, selectedUser }: Props) => {
  const [formData, setFormData] = useState<FormData>(formDataDefaultValues);
  const [formError, setFormError] = useState<FormError>(formErrorDefaultValues);
  const [error, setError] = useState<string>('');

  // get selected user doc
  const userRef = firestore.collection('/users').doc(selectedUser);
  let user: any = {};
  const userSnap = userRef.get().then((data) => {
    user = data;
  });

  return (
    <div>
      <Typography variant="h4" component="div" gutterBottom />
      <TextField
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formData.email}
        error={Boolean(formError.errorEmail)}
        helperText={formError.errorEmail}
        onChange={(event) => {
          if (false) {
            setFormError({ ...formError, errorEmail: 'Invalid email address.' });
          } else {
            setFormError({ ...formError, errorEmail: '' });
          }
          setFormData({ ...formData, email: event.target.value });
        }}
      />
    </div>
  );
};
