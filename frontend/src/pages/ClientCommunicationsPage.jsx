import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './ClientCommunicationsPage.module.css';
import { FiMessageSquare, FiChevronRight } from 'react-icons/fi';

const ClientCommunicationsPage = () => {
  const { user } = useAuth(); // This is the logged-in lawyer
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        // Call our new backend route
        const res = await axios.get('http://localhost:5001/api/cases/conversations');
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations', err);
        setError('Could not load conversations.');
      }
      setLoading(false);
    };

    if (user?.role === 'lawyer') {
      fetchConversations();
    }
  }, [user]);

  // This function creates the unique, consistent room ID
  const getRoomId = (citizenId) => {
    // --- THIS IS THE FIX ---
    // Safely get the lawyer's ID (it might be .id or ._id)
    const lawyerId = user.id || user._id; 
    // --- END OF FIX ---
    
    return [lawyerId, citizenId].sort().join('_');
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Client Communications</h1>
      <p className={styles.pageSubtitle}>View and respond to messages from your clients.</p>

      <div className={styles.chatList}>
        {loading ? (
          <p style={{padding: '2rem', textAlign: 'center'}}>Loading conversations...</p>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : conversations.length === 0 ? (
          <p style={{padding: '2rem', textAlign: 'center'}}>You have no active client conversations.</p>
        ) : (
          conversations.map(convo => (
            <Link 
              key={convo._id} 
              // convo.user._id is the citizen's ID from populate
              to={`/chat/${getRoomId(convo.user._id)}`} 
              className={styles.chatItem}
            >
              <div className={styles.chatIcon}>
                <FiMessageSquare />
              </div>
              <div className={styles.chatInfo}>
                {/* convo.user.name comes from the .populate() in our backend */}
                <h3 className={styles.clientName}>Chat with {convo.user.name}</h3>
                <p className={styles.caseTitle}>Re: {convo.title}</p>
              </div>
              <FiChevronRight className={styles.arrowIcon} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientCommunicationsPage;