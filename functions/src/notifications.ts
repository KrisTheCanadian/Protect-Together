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
  return sendNotificationHelper(userId, message);
});


// send notification for unread messages
export const sendNotificationForConversation = functions.https.onCall(async (_data) => {
  // create message
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

    const batch = db.batch();
    // mark patient as unread if recipient is a doctor
    if (recipient && recipient.role == "medical") {
      const patient = db.doc(`users/${conversationID}`);
      batch.update(patient, {hasUpdates: true});
    }

    let notifications: UserNotification[] = [];
    if (recipient && recipient.notifications) {
      // remove notifications for same conversationID
      notifications = recipient.notifications.filter((n: UserNotification) => n.conversationID !== conversationID);
    }

    // send notification
    batch.update(userRef, {notifications: [...notifications, message]});
    return batch.commit();
  }
  // or do nothing if not unread
  return null;
});

// time is in milliseconds
const delay = (time:number) => {
  return new Promise((res) => {
    setTimeout(() => {
      res("VALUE TO RESOLVE");
    }, time);
  });
};

// reset user's hasUpdates
export const resetHasUpdates = functions.https.onCall(async (_data) => {
  const userId = _data.userId;
  const userRef = db.doc(`users/${userId}`);
  return userRef.update({
    hasUpdates: false,
  });
});

// helper function to send notification to user
export const sendNotificationHelper = async (recipientID: string, notification: UserNotification) => {
  const userRef = db.doc(`users/${recipientID}`);
  const userSnap = await userRef.get();
  return userSnap.ref.update({
    notifications: admin.firestore.FieldValue.arrayUnion(notification),
  });
};

// format for notification
export interface UserNotification {
  title: string;
  message: string;
  date: admin.firestore.Timestamp;
  read: boolean;
  conversationID: string | null;
}

