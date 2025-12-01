import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import styles from './ChatPage.module.css';
import { FiSend } from 'react-icons/fi';
import axios from 'axios';

const socket = io('http://localhost:5001');

const ChatPage = () => {
  const { user } = useAuth();
  const { room } = useParams();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!room || !user) return;

    // 1. Fetch chat history
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await axios.get(`http://localhost:5001/api/messages/${room}`);
        setMessageList(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history", err);
      }
      setLoadingHistory(false);
    };
    fetchHistory();

    // 2. Join socket room
    socket.emit('join_room', room);

    // 3. Set up socket listener
    const messageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on('receive_message', messageHandler);

    // 4. Clean up
    return () => {
      socket.off('receive_message', messageHandler);
    };
  }, [room, user]);

  useEffect(scrollToBottom, [messageList]);

  const sendMessage = async () => {
    // --- THIS IS THE FIX ---
    // Check for user and a valid ID (either .id or ._id)
    const userId = user?.id || user?._id; 
    if (currentMessage.trim() === '' || !userId) {
      console.error('Cannot send message: User not loaded or user ID is missing.');
      return;
    }

    const messageData = {
      room: room,
      userId: userId, // <-- Use the safe userId
      message: currentMessage,
    };
    // --- END OF FIX ---

    await socket.emit('send_message', messageData);
    
    // Add our *own* message to the list immediately
    const selfMessage = {
      ...messageData,
      sender: { name: user.name, username: user.username },
      createdAt: new Date().toISOString(),
    }
    setMessageList((list) => [...list, selfMessage]);
    setCurrentMessage('');
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <h2>Chat - Room: {room}</h2>
        <p>You are chatting as: {user?.name}</p>
      </div>

      <div className={styles.chatBody}>
        {loadingHistory && <p>Loading chat history...</p>}
        
        {!loadingHistory && messageList.map((msg, index) => {
          // Check for sender (which should be populated)
          const author = msg.sender?.name || msg.author || 'Unknown';
          // Check if the message is from us
          const isMyMessage = (msg.sender?._id === (user?.id || user?._id)) || (msg.author === (user?.username || user?.name));
          
          const time = new Date(msg.createdAt).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });

          return (
            <div
              key={msg._id || index}
              className={`${styles.message} ${isMyMessage ? styles.myMessage : styles.otherMessage}`}
            >
              <div className={styles.messageContent}>
                <p className={styles.messageText}>{msg.message}</p>
              </div>
              <div className={styles.messageMeta}>
                <span>{isMyMessage ? 'You' : author}</span>
                <span>{time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatFooter}>
        <input
          type="text"
          className={styles.chatInput}
          placeholder="Type your message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className={styles.sendBtn} onClick={sendMessage}>
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;