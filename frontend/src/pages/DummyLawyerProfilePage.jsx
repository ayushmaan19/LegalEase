import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import navigate
import styles from './LawyerProfilePage.module.css';
import { FiStar, FiFileText, FiAward, FiGlobe, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext'; // Import auth

// --- DUMMY REVIEW DATA ---
const dummyReviews = [
  { id: 1, name: 'R. Sharma', rating: 5, date: '2025-10-20', comment: 'Excellent professional. Understood my case and provided clear guidance.' },
  { id: 2, name: 'Priya K.', rating: 4, date: '2025-09-15', comment: 'Very knowledgeable in property law.' },
];

const DummyLawyerProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth(); // Get logged-in user
  
  const profile = location.state?.profile; // Get profile from link state
  
  if (!profile) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.error}>No profile data was provided.</div>
      </div>
    );
  }
  
  const { user, experience, specializations, languages, bio, verified } = profile;
  const initials = user.name.split(' ').map(n => n[0]).join('');

  // --- DUMMY SLOTS ---
  const dummySlots = [
    { _id: 'd1', startTime: '2025-11-10T10:00:00', endTime: '2025-11-10T10:30:00' },
    { _id: 'd2', startTime: '2025-11-10T11:00:00', endTime: '2025-11-10T11:30:00' },
  ];
  
  // --- CHAT BUTTON HANDLER ---
  const handleContactClick = () => {
    // This is a dummy user, so user._id is just 'user_dummy1' etc.
    const lawyerId = user._id; 
    const citizenId = loggedInUser.id || loggedInUser._id;
    const chatRoomId = [lawyerId, citizenId].sort().join('_');
    navigate(`/chat/${chatRoomId}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileGrid}>
        
        {/* --- Left Column: Profile Card --- */}
        <aside className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{initials}</div>
            <h1 className={styles.lawyerName}>{user.name}</h1>
            {verified && <span className={styles.verifiedTag}><FiCheckCircle /> Verified Professional</span>}
          </div>

          <button className={styles.contactButton} onClick={handleContactClick}>
            <FiMessageSquare /> Contact This Lawyer
          </button>

          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <span>Experience</span>
              <strong>{experience} Years</strong>
            </div>
            <div className={styles.statItem}>
              <span>Rating</span>
              <strong>4.9/5.0 <span className={styles.star}>★</span></strong>
            </div>
            <div className={styles.statItem}>
              <span>Cases</span>
              <strong>{Math.floor(experience * 3.5)}+</strong>
            </div>
          </div>

          <div className={styles.profileDetails}>
            <div className={styles.detailItem}>
              <FiFileText />
              <div>
                <span>Enrollment No.</span>
                <strong>{user.enrollmentNumber}</strong>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiAward />
              <div>
                <span>Specializations</span>
                <strong>{specializations.join(', ')}</strong>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiGlobe />
              <div>
                <span>Languages</span>
                <strong>{languages.join(', ')}</strong>
              </div>
            </div>
          </div>
        </aside>

        {/* --- Right Column: Bio, Slots, & Reviews --- */}
        <main className={styles.mainContent}>
          <div className={styles.bioSection}>
            <h2>About {user.name}</h2>
            <p>{bio || `A dedicated legal professional specializing in ${specializations[0]}.`}</p>
          </div>

          <div className={styles.slotsSection}>
            <h2>Available Slots</h2>
            <div className={styles.slotList}>
              {dummySlots.map(slot => (
                <div key={slot._id} className={styles.slotCard}>
                  <div className={styles.slotInfo}>
                    <strong>{new Date(slot.startTime).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                    <span>
                      {new Date(slot.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(slot.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button className={styles.bookButton}>Book Now</button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.reviewsSection}>
            <h2>Client Reviews ({dummyReviews.length})</h2>
            <div className={styles.reviewList}>
              {dummyReviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{review.name}</strong>
                    <span>{review.date}</span>
                  </div>
                  <div className={styles.starRating}>
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty} />
                    ))}
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default DummyLawyerProfilePage;