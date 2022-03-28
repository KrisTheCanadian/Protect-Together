/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';

import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Avatar } from '@mui/material';
import firebase from 'firebase/compat/app';
import { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

interface Patient {
  id: string,
}

interface Message {
  message: string,
  createdAt: Timestamp,
  ownerID: string,
};

function ChatRoom(props: Patient) {
  const { state } = React.useContext(UserContext);
  const [formValue, setFormValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // define reference to chat
  const chatRef = firestore.collection('chats').doc(props.id);

  // save message to firestore
  const sendMessage = async (e: any) => {
    e.preventDefault();

    // creating message object
    const message: Message = {
      message: e.value,
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
      <main>
        {messages && messages.map((msg) => <ChatMessage key={msg.createdAt} message={msg} />)}
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  );
}

function Chat(props: Patient) {
  return (
    <div className="Chat">
      <header>
        <h1>⚛️🔥💬</h1>
      </header>

      <section>
        <ChatRoom {...props} />
      </section>

    </div>
  );
}

function ChatMessage(props: any) {
  const { text, uid } = props.message;
  const user = React.useContext(UserContext);

  const messageClass = uid === user.state.id ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <Avatar src={`https://avatars.dicebear.com/api/initials/${user.state.firstName}.svg`} alt="Avatar-Icon" />
      <p>{text}</p>
    </div>
  );
}

export default Chat;
