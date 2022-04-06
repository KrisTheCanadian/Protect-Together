import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();


// get availabilities from doctor

export const getDoctorAvailabilities = functions.https.onCall(async (_data, context)=>{
  const userID = context.auth?.uid;
  const userRef = db.doc(`users/${userID}`);
  const user = (await userRef.get()).data();
  if (user) {
    const doctorId = user.assignedDoctor;
    const doctorRef = db.doc(`users/${doctorId}`);
    const doctor = (await doctorRef.get()).data();
    if (doctor) {
      return doctor.availabilities;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

// get appointments from doctor

export const bookAppointment = functions.https.onCall(async (_data, context)=>{
  const userID = context.auth?.uid;
  const appointment = {
    uid: userID,
    date: admin.firestore.Timestamp.fromDate(new Date(_data.appointmentDate)),
  };
  const userRef = db.doc(`users/${userID}`);
  const user = (await userRef.get()).data();
  if (user) {
    const doctorId = user.assignedDoctor;
    const appointmentRef = db.doc(`appointments/${doctorId}`);

    // check if already booked
    const appointmentData = await (await appointmentRef.get()).data();
    const existingAppointment = appointmentData && appointmentData.appointments
        .filter((bookedAppointment: { date: admin.firestore.Timestamp; })=> bookedAppointment.date == appointment.date).length !== 0;

    // if it doesn't exist save it
    if (!existingAppointment) {
      return await appointmentRef.set({
        appointments: admin.firestore.FieldValue.arrayUnion(appointment),
      }, {merge: true});
    } else {
      throw new Error("Appointment already taken, please select another");
    }
  } else {
    throw new Error("Error booking appointment");
  }
});

export const enablePatientAppointment = functions.https.onCall(async (_data) => {
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  return userSnap.ref.update({
    disableBook: false,
  });
});

export const cancelAppointment = functions.https.onCall(async (_data, context)=>{
  const userID = context.auth?.uid;
  const userRef = db.doc(`users/${userID}`);
  const user = (await userRef.get()).data();
  const appointmentDate = admin.firestore.Timestamp.fromDate(new Date(_data.appointmentDate));
  if (user) {
    const updatedPatientAppointments = user.appointments
        .filter((bookedAppointment: { date: admin.firestore.Timestamp; })=> bookedAppointment.date !== appointmentDate);

    const doctorId = user.assignedDoctor;
    const appointmentRef = db.doc(`appointments/${doctorId}`);
    const appointmentData = await (await appointmentRef.get()).data();
    const updatedDoctorAppointments = appointmentData && appointmentData.appointments
        .filter((bookedAppointment: { date: admin.firestore.Timestamp; })=> bookedAppointment.date !== appointmentDate);

    return userRef.update({appointments: updatedPatientAppointments}).then(()=>{
      appointmentRef.update({appointments: updatedDoctorAppointments});
    });
  } else {
    return null;
  }
});
