import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const { token } = useParams(); // Gets the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    try {
      const res = await axios.put(
        `http://localhost:5001/api/auth/resetpassword/${token}`, 
        { password }
      );
      
      setMessage(res.data.msg + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Error resetting password.');
    }
  };

  return (
    <div className={styles.authPage}>
      {/* --- Left Branding Column --- */}
      <div className={styles.brandingContainer}>
        <div className={styles.logoCircle}>LN</div>
        <h1 className={styles.brandingTitle}>Set a New Password</h1>
        <p className={styles.brandingSubtitle}>
          Please enter a new, secure password for your account.
        </p>
      </div>

      {/* --- Right Form Column --- */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <header className={styles.welcomeHeader}>
            <h1>New Password</h1>
            <p>Enter your new password below.</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
               />
               <div className={styles.passwordIcon} onClick={() => setShowPassword(!showPassword)}>
                 {showPassword ? <FiEyeOff /> : <FiEye />}
               </div>
            </div>
            <div className={styles.inputGroup}>
              <input
                 type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
               <div className={styles.passwordIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                 {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
               </div>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
            {message && <p className={styles.successText}>{message}</p>}
            
            <button type="submit" className={styles.signInBtn}>Reset Password</button>
          </form>

          <div className={styles.formFooter}>
            <Link to="/login">Back to Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;