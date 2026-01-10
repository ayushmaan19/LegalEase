import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styles from './ChatsListPage.module.css';
import { FiMessageCircle, FiSearch, FiUser } from 'react-icons/fi';

const ChatsListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/messages/conversations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleChatClick = (room) => {
    navigate(`/chat/${room}`);
  };

  const filteredConversations = conversations.filter(conv => 
    conv.otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        <p className={styles.subtitle}>
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.conversationsList}>
        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className={styles.emptyState}>
            <FiMessageCircle className={styles.emptyIcon} />
            <h3>No conversations yet</h3>
            <p>
              {user?.role === 'lawyer' 
                ? 'Accept a case to start chatting with clients'
                : 'Find a lawyer and start a conversation'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div 
              key={conv.room} 
              className={styles.conversationItem}
              onClick={() => handleChatClick(conv.room)}
            >
              <div className={styles.avatar}>
                {conv.otherUser?.picture ? (
                  <img src={conv.otherUser.picture} alt={conv.otherUser.name} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {getInitials(conv.otherUser?.name)}
                  </div>
                )}
              </div>
              
              <div className={styles.conversationInfo}>
                <div className={styles.topRow}>
                  <h4 className={styles.userName}>
                    {conv.otherUser?.name || 'Unknown User'}
                  </h4>
                  <span className={styles.time}>
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <div className={styles.bottomRow}>
                  <p className={styles.lastMessage}>
                    {conv.lastMessageSender?._id === (user?.id || user?._id) && (
                      <span className={styles.youPrefix}>You: </span>
                    )}
                    {conv.lastMessage}
                  </p>
                  {conv.otherUser?.role && (
                    <span className={styles.roleTag}>
                      {conv.otherUser.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatsListPage;
