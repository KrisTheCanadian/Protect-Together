import React, { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import CalendarPicker from '@mui/lab/CalendarPicker';
import { Typography, Box, Paper, Button, useTheme, useMediaQuery, Modal } from '@mui/material';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import { UserContext } from '../../../context/UserContext';
import Firebase, { firestore } from '../../../config/firebase_config';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ff003d',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  p: 4,
  borderRadius: 4,
};

export default function PatientAppointments({ handleAppointmentsViewClose } : any) {
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down(1190));
  const [appointmentDate, setAppointmentDate] = React.useState<Date | null>(new Date());
  const { state, update } = React.useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const users = firestore.collection('users');

  const deleteAppointment = () => {
    console.log(appointmentDate);
    const cancelAppointment = Firebase.functions().httpsCallable('cancelAppointment');
    handleClose();
    handleAppointmentsViewClose();
    const userId = state.id;
    cancelAppointment({ appointmentDate, userId }).then(async () => {
      await users
        .doc(state.id)
        .update({
          disableBook: false,
        });
    }).catch((saveError) => {
      console.error(saveError);
    });
    const sendNotification = Firebase.functions().httpsCallable('sendNotification');
    sendNotification({
      title: `Appointment for patient ${state.firstName} ${state.lastName} has been cancelled!`,
      message: `Patient has cancelled the appointment on ${appointmentDate}.`,
      userId: user?.assignedDoctor,
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
        const appointmentTime = data?.appointments[data.appointments.length - 1].selectedDate;
        setAppointmentDate(appointmentTime.toDate());
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ overflowY: 'auto', minWidth: '365px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" mt={3} ml={3}>
          See Your Upcoming Appointment
        </Typography>
        <Typography variant="subtitle1" mt={1} ml={3}>
          Our appointments are being done by telephone!
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: midSize ? 'column-reverse' : 'row',
          marginTop: midSize ? '1rem' : '0' }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CalendarPicker date={appointmentDate} onChange={() => appointmentDate} />
          </LocalizationProvider>
          <Box>
            <Paper sx={{ backgroundColor: '#434ce6',
              minWidth: '160px',
              minHeight: '170px',
              display: 'flex',
              flexDirection: 'column',
            }}
            >
              <Typography variant="h3" mt={3} ml={2} sx={{ color: '#ffff' }}>
                {appointmentDate !== null && appointmentDate.getDate() < 10 && ('0')}
                {appointmentDate?.getDate()}
              </Typography>
              <Typography variant="subtitle1" ml={2} sx={{ color: '#ffff' }}>
                {appointmentDate?.toLocaleString('default', { month: 'long' })}
                {' '}
                {appointmentDate?.getFullYear()}
              </Typography>
              <Typography variant="h5" mt={1} ml={2} sx={{ color: '#ffff' }}>
                {appointmentDate?.getHours()}
                :
                {appointmentDate !== null && appointmentDate.getMinutes() < 10 && ('0')}
                {appointmentDate?.getMinutes()}
                {' '}
                {appointmentDate !== null && appointmentDate?.getHours() < 12 && (' AM')}
                {appointmentDate !== null && appointmentDate?.getHours() >= 12 && (' PM')}
              </Typography>
            </Paper>
            {!midSize && (
              <Box mt={2}>
                <Button onClick={handleOpen} type="submit" variant="contained" color="secondary">
                  Cancel Appointment
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        {midSize && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleOpen} type="submit" variant="contained" color="secondary">
              Cancel Appointment
            </Button>
          </Box>
        )}
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 300 }}>
          <Typography variant="h6">Are you sure you want to cancel your appointment?</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box mt={2}>
              <Button
                onClick={handleClose}
                type="submit"
                variant="contained"
                color="secondary"
                style={{ width: '200px' }}
              >
                Keep Appointment
              </Button>
            </Box>
            <Box mt={2}>
              <Button
                onClick={deleteAppointment}
                type="submit"
                variant="contained"
                color="warning"
                style={{ width: '200px' }}
              >
                Cancel Appointment
              </Button>
            </Box>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
