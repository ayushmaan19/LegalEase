import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './LawyerProfilePage.module.css';
import { FiStar, FiFileText, FiAward, FiGlobe, FiCheckCircle, FiMessageSquare } from 'react-icons/fi'; // Added chat icon
import { useAuth } from '../context/AuthContext';

// --- DUMMY REVIEW DATA ---
const dummyReviews = [
  { id: 1, name: 'R. Sharma', rating: 5, date: '2025-10-20', comment: 'Excellent professional. Understood my case and provided clear guidance. Highly recommended.' },
  { id: 2, name: 'Priya K.', rating: 4, date: '2025-09-15', comment: 'Very knowledgeable in property law. Helped me resolve my dispute quickly.' },
  { id: 3, name: 'Amit S.', rating: 5, date: '2025-08-01', comment: 'Clear, concise, and very effective. A great lawyer.' },
];

const LawyerProfilePage = () => {
  const { id } = useParams(); // Gets the profile :id from the URL
  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    const fetchProfileAndSlots = async () => {
      try {
        setLoading(true);
        // Fetch profile
        const profileRes = await axios.get(`http://localhost:5001/api/profile/${id}`);
        setProfile(profileRes.data);
        
        // Fetch available slots
        const lawyerUserId = profileRes.data.user._id;
        const slotsRes = await axios.get(`http://localhost:5001/api/appointments/lawyer/${lawyerUserId}`);
        setAppointments(slotsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Could not load lawyer profile.');
        setLoading(false);
      }
    };
    fetchProfileAndSlots();
  }, [id]);

  const handleBookAppointment = async (slotId) => {
    setBookingMsg('Booking...');
    try {
      await axios.put(`http://localhost:5001/api/appointments/book/${slotId}`);
      setBookingMsg('Booked! Redirecting to chat...');
      
      setAppointments(prev => prev.filter(slot => slot._id !== slotId));

      const lawyerId = profile.user._id;
      const citizenId = loggedInUser.id || loggedInUser._id;
      const chatRoomId = [lawyerId, citizenId].sort().join('_');
      
      setTimeout(() => {
        navigate(`/chat/${chatRoomId}`);
      }, 2000);

    } catch (err) {
      setBookingMsg(err.response?.data?.msg || 'Failed to book slot.');
    }
  };

  // --- CHAT BUTTON HANDLER ---
  const handleContactClick = () => {
    const lawyerId = profile.user._id;
    const citizenId = loggedInUser.id || loggedInUser._id;
    const chatRoomId = [lawyerId, citizenId].sort().join('_');
    navigate(`/chat/${chatRoomId}`);
  };

  if (loading) {
    return <div className={styles.pageWrapper}><div className={styles.loading}>Loading Profile...</div></div>;
  }
  if (error) {
    return <div className={styles.pageWrapper}><div className={styles.error}>{error}</div></div>;
  }
  if (!profile) {
    return <div className={styles.pageWrapper}><div className={styles.error}>Profile not found.</div></div>;
  }
  
  const { user, experience, specializations, languages, proBono, verified, bio } = profile;
  const initials = user.name.split(' ').map(n => n[0]).join('');

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileGrid}>
        
        {/* --- THIS IS THE MISSING LEFT COLUMN --- */}
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
              <strong>{user.casesHandled || 10}+</strong>
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
        {/* --- END OF MISSING LEFT COLUMN --- */}


        {/* --- Right Column: Bio, Slots, & Reviews --- */}
        <main className={styles.mainContent}>
          <div className={styles.bioSection}>
            <h2>About {user.name}</h2>
            <p>{bio || "No biography provided."}</p>
          </div>

          <div className={styles.slotsSection}>
            <h2>Available Slots</h2>
            {bookingMsg && <p className={styles.bookingStatus}>{bookingMsg}</p>}
            <div className={styles.slotList}>
              {appointments.length > 0 ? (
                appointments.map(slot => (
                  <div key={slot._id} className={styles.slotCard}>
                    <div className={styles.slotInfo}>
                      <strong>{new Date(slot.startTime).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</strong>
                      <span>
                        {new Date(slot.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        {' - '}
                        {new Date(slot.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <button 
                      className={styles.bookButton}
                      onClick={() => handleBookAppointment(slot._id)}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p>This lawyer has no available slots.</p>
              )}
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

export default LawyerProfilePage;