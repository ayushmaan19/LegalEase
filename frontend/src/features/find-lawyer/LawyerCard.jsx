import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FindLawyer.module.css';
import { useAuth } from '../../context/AuthContext';

const LawyerCard = ({ profile }) => {
  const { user: loggedInUser } = useAuth();
  // Safe destructuring
  const { 
    user = { name: 'Unknown Lawyer', enrollmentNumber: 'N/A' }, 
    experience, 
    specializations, 
    languages, 
    proBono, 
    verified, 
    _id 
  } = profile;
  
  const { name, enrollmentNumber } = user; 
  const initials = name ? name.split(' ').map(n => n[0]).join('') : '??';

  // --- THIS IS THE FIX ---
  // Check if the ID starts with 'dummy'
  const isDummy = _id.startsWith('dummy');
  
  // Set the correct link based on whether it's a dummy or real profile
  const profileLink = isDummy ? '/lawyer/dummy' : `/lawyer/${_id}`;
  // --- END OF FIX ---
  const lawyerId = user._id; // The ID of the lawyer you're viewing
  const citizenId = loggedInUser.id; // Your own ID
  const chatRoomId = [lawyerId, citizenId].sort().join('_');

  return (
    <div className={styles.lawyerCard}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>{initials}</div>
        <div className={styles.nameAndStatus}>
          <h4>{name}</h4>
          <div className={styles.statusTags}>
            {verified && <span className={`${styles.tag} ${styles.verified}`}>Verified</span>}
            {proBono && <span className={`${styles.tag} ${styles.proBono}`}>Pro Bono</span>}
          </div>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Experience:</span>
          <span>{experience || 'N/A'} years</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>License:</span>
          <span>{enrollmentNumber}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Languages:</span>
          <span>{languages?.join(', ') || 'N/A'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Specializations:</span>
          <div>
            {specializations?.map(spec => <span key={spec} className={styles.specialtyTag}>{spec}</span>)}
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <Link to={`/chat/${chatRoomId}`} className={styles.contactBtn}>Contact Lawyer</Link>
        
        {/* This Link component now does two things:
          1. Navigates to the correct link (profileLink).
          2. If it's a dummy, it passes the entire 'profile' object in the route's state.
        */}
        <Link 
          to={profileLink} 
          state={isDummy ? { profile: profile } : null} 
          className={styles.viewProfileBtn}
        >
          View Profile
        </Link>
        
      </div>
    </div>
  );
};

export default LawyerCard;