import React, { useState, useEffect, useCallback } from 'react';
import styles from './SettingsPage.module.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiUser, FiLock, FiAlertTriangle, FiShield, FiCreditCard } from 'react-icons/fi';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const SettingsPage = () => {
  const { user, updateUser } = useAuth();

  // --- Common State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');

  // --- Password State ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- Lawyer-Specific Profile State ---
  const [experience, setExperience] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [languages, setLanguages] = useState('');
  const [bio, setBio] = useState('');
  const [proBono, setProBono] = useState(false);
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [lawyerProfileMsg, setLawyerProfileMsg] = useState('');
  
  // --- KYC State ---
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [kycMsg, setKycMsg] = useState('');
  const [kycError, setKycError] = useState('');
  const [kycStatus, setKycStatus] = useState('Not Verified');

  // --- Fetch Lawyer Profile Function ---
  const fetchLawyerProfile = useCallback(async () => {
    if (!user || user.role !== 'lawyer') return;
    try {
      const res = await axios.get('http://localhost:5001/api/profile/me');
      const profile = res.data;
      setExperience(profile.experience || '');
      setBio(profile.bio || '');
      setProBono(profile.proBono || false);
      setSpecializations(profile.specializations.join(', '));
      setLanguages(profile.languages.join(', '));
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log('No lawyer profile found, user can create one.');
      } else {
        console.error('Failed to fetch lawyer profile', err);
      }
    }
  }, [user]);

  // --- Pre-fill forms on page load ---
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setKycStatus(user.kycStatus || 'Not Verified');
      
      if (user.role === 'lawyer') {
        setEnrollmentNumber(user.enrollmentNumber || '');
        fetchLawyerProfile();
      }
    }
  }, [user, fetchLawyerProfile]);

  
  // --- Submit Handlers ---
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    try {
      const res = await axios.put('http://localhost:5001/api/users/me', {
        name,
        email,
        phone,
      });
      updateUser(res.data);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileError(err.response?.data?.msg || 'Failed to update profile.');
      setTimeout(() => setProfileError(''), 3000);
    }
  };

  const handleLawyerProfileSubmit = async (e) => {
    e.preventDefault();
    setLawyerProfileMsg('');
    try {
      const profileData = {
        experience: Number(experience),
        specializations,
        languages,
        bio,
        proBono,
      };
      await axios.post('http://localhost:5001/api/profile', profileData);
      setLawyerProfileMsg('Lawyer profile updated successfully!');
      fetchLawyerProfile();
      setTimeout(() => setLawyerProfileMsg(''), 3000);
    } catch (err) {
      setLawyerProfileMsg(err.response?.data?.msg || 'Failed to update profile.');
      setTimeout(() => setLawyerProfileMsg(''), 3000);
    }
  };

  const handleKycSubmit = async (e) => {
    e.preventDefault();
    setKycMsg('');
    setKycError('');
    try {
      const res = await axios.post('http://localhost:5001/api/users/kyc', {
        aadhaarNumber,
      });
      updateUser(res.data);
      setKycMsg('KYC Verified Successfully!');
      setAadhaarNumber('');
      setTimeout(() => setKycMsg(''), 3000);
    } catch (err) {
      setKycError(err.response?.data?.msg || 'KYC submission failed.');
      setTimeout(() => setKycError(''), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    try {
      const passwordData = { currentPassword, newPassword };
      const res = await axios.put(
        'http://localhost:5001/api/users/change-password', 
        passwordData
      );
      setPasswordMsg(res.data.msg);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMsg(''), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.msg || 'Failed to update password.');
      setTimeout(() => setPasswordError(''), 3000);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Account Settings</h1>
      <p className={styles.pageSubtitle}>Manage your profile, password, and account settings.</p>

      {/* --- Profile Information Card (Common) --- */}
      <div className={styles.settingsCard}>
        <h2 className={styles.cardTitle}><FiUser /> Profile Information</h2>
        <form onSubmit={handleProfileSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" className={styles.formInput} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" className={styles.formInput} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" className={styles.formInput} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <input type="text" id="role" className={styles.formInput} value={user?.role || ''} disabled />
            </div>
          </div>
          <div className={styles.cardFooter}>
            {profileMsg && <span className={styles.successMsg}>{profileMsg}</span>}
            {profileError && <span className={styles.errorMsg}>{profileError}</span>}
            <button type="submit" className={styles.submitButton}>Save Changes</button>
          </div>
        </form>
      </div>

      
      {/* --- LAWYER-ONLY CARDS --- */}
      {user?.role === 'lawyer' && (
        <>
          <div className={styles.settingsCard}>
            <h2 className={styles.cardTitle}><FiShield /> Professional Verification</h2>
            <form onSubmit={handleLawyerProfileSubmit}>
              <div className={styles.formGroup} style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <label htmlFor="enrollmentNumber">Bar Council Enrollment No.</label>
                <input type="text" id="enrollmentNumber" className={styles.formInput} value={enrollmentNumber} disabled />
              </div>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="experience">Years of Experience</label>
                  <input type="number" id="experience" className={styles.formInput} value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g., 5" />
                </div>
                 <div className={styles.formGroup}>
                   <label htmlFor="proBono">Available for Pro Bono?</label>
                   <label className={styles.checkboxWrapper}>
                     <input type="checkbox" id="proBono" checked={proBono} onChange={(e) => setProBono(e.target.checked)} />
                     <span>Yes, I am available</span>
                   </label>
                </div>
              </div>
              <div className={styles.formGroup} style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <label htmlFor="specializations">Specializations (Comma-separated)</label>
                <input type="text" id="specializations" className={styles.formInput} value={specializations} onChange={(e) => setSpecializations(e.target.value)} placeholder="e.g., Family Law, Criminal Law" />
              </div>
              <div className={styles.formGroup} style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <label htmlFor="languages">Languages Spoken (Comma-separated)</label>
                <input type="text" id="languages" className={styles.formInput} value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="e.g., English, Hindi" />
              </div>
              <div className={styles.formGroup} style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <label htmlFor="bio">Short Bio (max 500 characters)</label>
                <textarea id="bio" className={styles.formTextarea} rows="4" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell clients about your expertise..." />
              </div>
              <div className={styles.cardFooter}>
                {lawyerProfileMsg && <span className={styles.successMsg}>{lawyerProfileMsg}</span>}
                <button type="submit" className={styles.submitButton}>Save Lawyer Profile</button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* --- END OF LAWYER-ONLY CARDS --- */}


      {/* --- KYC CARD (FOR EVERYONE) --- */}
      <div className={styles.settingsCard}>
        <h2 className={styles.cardTitle}><FiCreditCard /> KYC Verification</h2>
        
        {kycStatus === 'Verified' ? (
          <div className={styles.statusDisplay}>
            <div className={`${styles.verificationStatus} ${styles.verified}`}>KYC Verified</div>
            <p>Your account is verified. Thank you!</p>
          </div>
        ) : kycStatus === 'Pending' ? (
          <div className={styles.statusDisplay}>
            <div className={`${styles.verificationStatus} ${styles.pending}`}>KYC Pending</div>
            <p>Your documents are under review. This may take up to 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleKycSubmit}>
            <div className={styles.formGroup} style={{ padding: '1.5rem' }}>
              <label htmlFor="aadhaar">Aadhaar / Social Security Number</label>
              <input 
                type="text" 
                id="aadhaar" 
                className={styles.formInput}
                placeholder="Enter 12-digit Aadhaar Number"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                maxLength="12"
              />
              <small>Your number is encrypted and used for verification only.</small>
            </div>
            <div className={styles.cardFooter}>
              {kycMsg && <span className={styles.successMsg}>{kycMsg}</span>}
              {kycError && <span className={styles.errorMsg}>{kycError}</span>}
              <button type="submit" className={styles.submitButton}>Submit for Verification</button>
            </div>
          </form>
        )}
      </div>
      {/* --- END OF KYC CARD --- */}


      {/* --- Change Password Card (Common) --- */}
      <div className={styles.settingsCard}>
        <h2 className={styles.cardTitle}><FiLock /> Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <input type="password" id="currentPassword" className={styles.formInput} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input type="password" id="newPassword" className={styles.formInput} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength="6" required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input type="password" id="confirmPassword" className={styles.formInput} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength="6" required />
            </div>
          </div>
          <div className={styles.cardFooter}>
            {passwordMsg && <span className={styles.successMsg}>{passwordMsg}</span>}
            {passwordError && <span className={styles.errorMsg}>{passwordError}</span>}
            <button type="submit" className={styles.submitButton}>Update Password</button>
          </div>
        </form>
      </div>

      {/* --- Danger Zone Card (Common) --- */}
      <div className={`${styles.settingsCard} ${styles.dangerZone}`}>
        <h2 className={styles.cardTitle}><FiAlertTriangle /> Danger Zone</h2>
        <div className={styles.dangerContent}>
          <p>
            <strong>Delete Your Account</strong>
            <br />
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className={styles.deleteButton}>Delete My Account</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;