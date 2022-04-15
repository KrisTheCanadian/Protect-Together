/* eslint-disable @typescript-eslint/no-explicit-any */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {pick} from "lodash";

const db = admin.firestore();

// get third party information
export const getThirdPartyInfo = functions.https.onCall(async (_data, context) => {
  if (context.auth) {
    // verify third party user
    const thirdPartyRef = db.collection("users").doc(`${context.auth.uid}`);
    const thirdPartySnap = await thirdPartyRef.get();
    if (thirdPartySnap.data()?.role == "thirdParty") {
      const patientsRef = db.collection("users").where("role", "==", "patient");
      const patientsSnap = await patientsRef.get();

      // filter out privacy info
      const filteredPatientData = patientsSnap.docs.map((patient)=>{
        const patientData = patient.data();
        return pick(patientData, ["dateOfBirth", "sex", "weight", "testsResults", "doctorName"]);
      });
      return filteredPatientData;
    } else {
      return null;
    }
  } else {
    return null;
  }
});


