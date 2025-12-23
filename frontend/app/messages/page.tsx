
"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  profilePictureUrl?: string;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [userId, setUserId] = useState(''); // TODO: get from auth

  useEffect(() => {
    // TODO: Replace with actual userId from auth store
    setUserId(localStorage.getItem('userId') || '');
    if (userId) {
      axios.get(`${API_URL}/messages/conversations`, { params: { userId } })
        .then(res => setConversations(res.data));
    }
  }, [userId]);

  const openConversation = (conv: Conversation) => {
    setSelected(conv);
    axios.get(`${API_URL}/messages/messages/${conv.id}`)
      .then(res => setMessages(res.data));
  };

  const sendMessage = async () => {
    if (!selected || !newMsg) return;
    const res = await axios.post(`${API_URL}/messages/message`, {
      conversationId: selected.id,
      senderId: userId,
      content: newMsg,
    });
    setMessages([...messages, res.data]);
    setNewMsg('');
  };

  return (
    <div style={{ display: 'flex', height: '80vh' }}>
      <div style={{ width: 300, borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <h2>Conversations</h2>
        {conversations.map(conv => (
          <div key={conv.id} onClick={() => openConversation(conv)} style={{ cursor: 'pointer', padding: 8, background: selected?.id === conv.id ? '#eee' : undefined }}>
            {conv.participants.filter(u => u.id !== userId).map(u => u.username).join(', ')}
            <br />
            <small>{conv.messages[0]?.content}</small>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ margin: '8px 0', textAlign: msg.sender.id === userId ? 'right' : 'left' }}>
                  <b>{msg.sender.username}:</b> {msg.content}
                  <br />
                  <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', padding: 8, borderTop: '1px solid #ccc' }}>
              <input value={newMsg} onChange={e => setNewMsg(e.target.value)} style={{ flex: 1 }} placeholder="Type a message..." />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ margin: 'auto' }}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}
