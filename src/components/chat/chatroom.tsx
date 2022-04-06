/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from 'react';

import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import firebase from 'firebase/compat/app';
import SendIcon from '@mui/icons-material/Send';
import Firebase, { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import { PatientData } from '../dashboard/MedicalView/PatientInfo/PatientInfo';
import './chatroom.css';

interface Message {
  message: string,
  createdAt: Timestamp,
  ownerID: string,
};

interface ChatInfo{
  patientID: string,
  recipientID:string,
  recipientFirstName: string,
  recipientLastName: string,
}

function ChatRoom(props: ChatInfo) {
  const { state } = React.useContext(UserContext);
  const [formValue, setFormValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);
  // ensure scrolls fast to bottom on load and smooth for new message
  const [messagesLoaded, setMessagesLoaded] = useState(0);

  // scroll messsages on send
  useEffect(() => {
    if (messageRef.current) {
      if (messagesLoaded < 2) {
        messageRef.current.scrollIntoView(
          {
            behavior: 'auto',
            block: 'end',
            inline: 'nearest',
          },
        );
        setMessagesLoaded((m) => m + 1);
      } else {
        messageRef.current.scrollIntoView(
          {
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          },
        );
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // define reference to chat
  const chatRef = firestore.collection('chats').doc(props.patientID);

  // save message to firestore
  const sendMessage = async (e: any) => {
    e.preventDefault();

    // creating message object
    const message: Message = {
      message: formValue,
      createdAt: Timestamp.now(),
      ownerID: state.id,
    };

    // add message to messages array and add recipientID to unread
    await chatRef.update({
      // append message
      messages: firebase.firestore.FieldValue.arrayUnion(message),
      unreadUserIds: firebase.firestore.FieldValue.arrayUnion(props.recipientID),
    });

    const sendNotification = Firebase.functions().httpsCallable('sendNotificationForConversation');
    sendNotification({
      title: 'New Message',
      message: `Unread message from ${state.firstName} ${state.lastName}`,
      recipientID: props.recipientID,
      conversationID: props.patientID,
    });

    setFormValue('');
  };

  useEffect(() => {
    // create chat if does not exist
    chatRef.get()
      .then((chatDocument) => {
        if (!chatDocument.exists) {
          // create chat
          chatRef.set({
            messages: [],
          });
        }
      });

    // subscribe to changes in chat
    const unsubscribe = chatRef.onSnapshot((chatSnapshot) => {
      const chatData = chatSnapshot.data();
      if (chatSnapshot.exists && chatData) {
        setMessages(chatData.messages);

        // if unreadUserIds contains current user, remove it
        if (chatData.unreadUserIds.includes(state.id)) {
          chatRef.update({
            unreadUserIds: firebase.firestore.FieldValue.arrayRemove(state.id),
          });
        }
      }
    });

    // remove notifications for this conversation
    const currentUserRef = firestore.doc(`users/${state.id}`);
    currentUserRef.get().then((currentUserDoc) => {
      const currentUser = currentUserDoc.data();
      let notifications = [];
      if (currentUser && currentUser.notifications) {
        // remove notifications for same conversationID
        notifications = currentUser.notifications.filter((n: any) => n.conversationID !== props.patientID);
        // update notifications
        currentUserRef.update({
          notifications,
        });
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box className="messages-container" sx={{ flex: 1, overflow: 'scroll' }}>
        {messages && messages.map((msg, index) => {
          let showAvatar = true;
          if (messages[index - 1] && messages[index - 1].ownerID === msg.ownerID) {
            showAvatar = false;
          }
          return (<ChatMessage key={msg.createdAt} message={msg} showAvatar={showAvatar} chatInfo={props} />);
        })}
        <div className="scroll-to" ref={messageRef} />
      </Box>

      <form onSubmit={sendMessage} style={{ position: 'relative' }}>
        <input
          className="message-input"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Type a message"
        />
        <button
          type="submit"
          disabled={!formValue}
          className="send-message-button"
        >
          <SendIcon />
        </button>
      </form>
    </>
  );
}

function Chat(props: ChatInfo) {
  const sendRequest = () => {
    const enablePatientAppointment = Firebase.functions().httpsCallable('enablePatientAppointment');
    enablePatientAppointment({
      userId: props.patientID,
    });
  };
  const { state } = React.useContext(UserContext);
  const { role } = state;

  return (
    <Box
      className="Chat"
      sx={{ height: 'calc(100vh - 136px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        borderRadius: '20px',

      }}
    >
      <Box sx={{ padding: '15px 20px 15px 20px', borderBottom: '1px solid #e7e7e7' }}>
        <Grid
          container
          spacing={24}
          justifyContent="space-between"
        >
          <Grid item>
            <Typography variant="h6" component="div">Messages</Typography>
          </Grid>
          {role === 'medical'
          && (
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={sendRequest}
            >
              Send Appointment Request

            </Button>
          </Grid>
          )}
        </Grid>
      </Box>
      <ChatRoom {...props} />
    </Box>
  );
}

function ChatMessage(props: any) {
  const { message, ownerID } = props.message;
  const { showAvatar } = props;
  const { chatInfo } = props;
  const user = React.useContext(UserContext);

  const messageClass = ownerID === user.state.id ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {showAvatar && (
      <Avatar
        sx={{ bgcolor: 'grey' }}
        alt="Avatar-Icon"
      >
        {messageClass === 'sent' && user.state.firstName[0] + user.state.lastName[0]}
        {messageClass === 'received' && chatInfo.recipientFirstName[0] + chatInfo.recipientLastName[0]}

      </Avatar>
      )}
      {!showAvatar && (
      <Box
        sx={{ width: '42px' }}
      />
      )}
      {showAvatar && <p>{message}</p>}
      {!showAvatar && <p className="no-avatar-spacing">{message}</p>}
    </div>
  );
}

export default Chat;
