import * as admin from "firebase-admin";
admin.initializeApp();

export {getDoctorAvailabilities, bookAppointment, enablePatientAppointment, cancelAppointment} from "./booking";
export {sendNotification, sendNotificationForConversation} from "./notifications";
export {requestDoctor, dispatchDoctor} from "./triage";


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
