/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCollectionData } from 'react-firebase-hooks/firestore';
import React, { useEffect, useState } from 'react';

import { Timestamp } from 'firebase/firestore';
import { Avatar } from '@mui/material';
import { auth, firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const user = React.useContext(UserContext);

  const [messages] = useCollectionData(query as any, { idField: 'id' } as any);

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e: any) => {
    e.preventDefault();

    const { id } = user.state;

    await messagesRef.add({
      text: formValue,
      createdAt: Timestamp.now(),
      uid: id,
      recipient: id,
    });

    setFormValue('');
  };

  return (
    <>
      <main>

        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

        <button type="submit" disabled={!formValue}>🕊️</button>

      </form>
    </>
  );
}

function Chat() {
  return (
    <div className="Chat">
      <header>
        <h1>⚛️🔥💬</h1>
      </header>

      <section>
        <ChatRoom />
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
