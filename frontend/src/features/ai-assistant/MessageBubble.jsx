import React from 'react';
import styles from './MessageBubble.module.css';
import { FiUser } from 'react-icons/fi';
import { FaRobot } from 'react-icons/fa';

const MessageBubble = ({ message }) => {
  const { text, sender, timestamp } = message;
  const isAI = sender === 'ai';

  return (
    <div className={`${styles.messageBubble} ${isAI ? styles.aiBubble : styles.userBubble}`}>
      
      {/* --- THIS IS THE FIX --- */}
      {/* The AI (aiBubble) should have the FaRobot icon.
        The User (userBubble) should have the FiUser icon.
        My old code had this logic inverted.
      */}
      <div className={styles.avatar}>
        {isAI ? <FaRobot /> : <FiUser />}
      </div>
      {/* --- END OF FIX --- */}

      <div className={styles.messageContent}>
        <p className={styles.messageText}>{text}</p>
        <p className={styles.timestamp}>{timestamp}</p>
      </div>
    </div>
  );
};

export default MessageBubble;