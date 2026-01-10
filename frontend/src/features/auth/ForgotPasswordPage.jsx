import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';
import Auth3DScene from '../../components/common/Auth3DScene';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5001/api/auth/forgotpassword', { email });
      setMessage('Email sent! Please check your inbox for a reset link.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending email.');
    }
  };

  return (
    <div className={styles.authPage}>
      {/* --- Left Branding Column --- */}
      <div className={styles.brandingContainer}>
        {/* --- Subtle Background --- */}
        <div className={styles.sceneContainer}>
          <Auth3DScene />
        </div>
        <div className={styles.brandingContent}>
          <div className={styles.logoCircle}>LE</div>
          <h1 className={styles.brandingTitle}>Forgot password?</h1>
          <p className={styles.brandingSubtitle}>
            No worries. We'll send you a link to reset it.
          </p>
        </div>
      </div>

      {/* --- Right Form Column --- */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <header className={styles.welcomeHeader}>
            <h1>Reset Password</h1>
            <p>Please enter your registered email.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email Address"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
            {message && <p className={styles.successText}>{message}</p>}
            
            <button type="submit" className={styles.signInBtn}>Send Reset Link</button>
          </form>

          <div className={styles.formFooter}>
            <Link to="/login">Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;