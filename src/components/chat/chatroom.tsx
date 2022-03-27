/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';

import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { Avatar } from '@mui/material';
import firebase from 'firebase/compat';
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
  const sendMessage = async (e: any) => {
    e.preventDefault();

    // creating message object
    const message: Message = {
      message: e.value,
      createdAt: Timestamp.now(),
      ownerID: state.id,
    };

    const document = await firestore.collection('chats').doc(props.id).get();
    // check if chat exists
    if (document && document.exists) {
      // update chat
      await document.ref.update({
        // append message
        messages: firebase.firestore.FieldValue.arrayUnion(message),
      });
    } else {
      // create chat
      await document.ref.set({
        messages: [message],
      });
    }
    setFormValue('');
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'chats', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setMessages(data.messages);
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
