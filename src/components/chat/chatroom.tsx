/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from 'react';

import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import firebase from 'firebase/compat/app';
import SendIcon from '@mui/icons-material/Send';
import { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import { PatientData } from '../dashboard/MedicalView/PatientInfo/PatientInfo';
import './chatroom.css';

interface Message {
  message: string,
  createdAt: Timestamp,
  ownerID: string,
};

function ChatRoom(props: PatientData) {
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
        setMessagesLoaded(messagesLoaded + 1);
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
  }, [messages]);

  // define reference to chat
  const chatRef = firestore.collection('chats').doc(props.PID);

  // save message to firestore
  const sendMessage = async (e: any) => {
    e.preventDefault();

    // creating message object
    const message: Message = {
      message: formValue,
      createdAt: Timestamp.now(),
      ownerID: state.id,
    };

    // add message to messages array
    await chatRef.update({
      // append message

      messages: firebase.firestore.FieldValue.arrayUnion(message),
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
          return (<ChatMessage key={msg.createdAt} message={msg} showAvatar={showAvatar} />);
        })}
        <div ref={messageRef} />
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

function Chat(props: PatientData) {
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
          <Grid item>
            <Button variant="contained" color="secondary">Book Appointment</Button>

          </Grid>
        </Grid>
      </Box>

      <ChatRoom {...props} />

    </Box>
  );
}

function ChatMessage(props: any) {
  const { message, ownerID } = props.message;
  const { showAvatar } = props;
  console.log(showAvatar);
  const user = React.useContext(UserContext);

  const messageClass = ownerID === user.state.id ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      {showAvatar && (
      <Avatar
        sx={{ bgcolor: 'grey' }}
        alt="Avatar-Icon"
      >
        {user.state.firstName[0] + user.state.lastName[0]}

      </Avatar>
      )}
      {!showAvatar && (
      <Box
        sx={{ width: '42px' }}
      />
      )}

      <p>{message}</p>
    </div>
  );
}

export default Chat;
