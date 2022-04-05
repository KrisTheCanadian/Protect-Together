import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


const db = admin.firestore();


// send Notification to user
export const sendNotification = functions.https.onCall(async (_data) => {
  // get doctor with available slots
  const message: UserNotification = {
    title: _data.title,
    message: _data.message,
    date: admin.firestore.Timestamp.now(),
    read: false,
    conversationID: null,
  };
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  const userSnap = await userRef.get();

  return userSnap.ref.update({
    notifications: admin.firestore.FieldValue.arrayUnion(message),
  });
});

interface UserNotification {
  title: string;
  message: string;
  date: admin.firestore.Timestamp;
  read: boolean;
}


// send notification if user is marked as unread in conversation
export const sendNotificationForConversation = functions.https.onCall(async (_data) => {
  // get doctor with available slots
  const message: UserNotification = {
    conversationID: _data.conversationID,
    title: _data.title,
    message: _data.message,
    date: admin.firestore.Timestamp.now(),
    read: false,
  };
  const recipientID = _data.recipientID;
  const conversationID = _data.conversationID;

  // allow 2 seconds for user to mark as read
  await delay(2000);

  // check to see if user is unread in conversation
  const conversationRef = db.doc(`chats/${conversationID}`);
  const conversationDoc = await conversationRef.get();
  const conversation = conversationDoc.data();
  if (conversation && conversation.unreadUserIds && conversation.unreadUserIds.includes(recipientID)) {
    // filter out notifications that already exist for conversation
    const userRef = db.doc(`users/${recipientID}`);
    const recipientDoc = await userRef.get();
    const recipient = recipientDoc.data();
    let notifications: UserNotification[] = [];
    if (recipient && recipient.notifications) {
      // remove notifications for same conversationID
      notifications = recipient.notifications.filter((n: UserNotification) => n.conversationID !== conversationID);
    }

    // send notification
    return userRef.update({
      notifications: [...notifications, message],
    });
  }
  // or do nothing if not unread
  return null;
});

interface UserNotification {
  title: string;
  message: string;
  date: admin.firestore.Timestamp;
  read: boolean;
  conversationID: string | null;
}

// time is in milliseconds
const delay = (time:number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("VALUE TO RESOLVE");
    }, time);
  });
};


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
