import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styles from './Auth.module.css';
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        identifier,
        password,
      });
      loginAction(res.data);
      
      // --- (Small fix to add the smart redirect) ---
      const user = res.data.user;
      if (user.role) {
        navigate('/dashboard');
      } else {
        navigate('/select-role'); // Send to role selection if role is null
      }
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential; // This is the JWT from Google
    setError('');
    try {
      // Send this token to our backend's /google route
      const res = await axios.post('http://localhost:5001/api/auth/google', {
        token: idToken 
      });
      
      // Our backend verifies the token and returns *our* user and token
      loginAction(res.data);
      
      // Redirect based on role
      const user = res.data.user;
      if (user.role) {
        navigate('/dashboard');
      } else {
        navigate('/select-role'); // New Google user, send to role selection
      }
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
  };
  
  const handleGoogleLoginError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className={styles.authPage}>
      {/* --- Left Branding Column --- */}
      <div className={styles.brandingContainer}>
        <div className={styles.logoCircle}>LN</div>
        <h1 className={styles.brandingTitle}>Welcome Back to LegalEase</h1>
        <p className={styles.brandingSubtitle}>
          Sign in to access your dashboard, manage your cases, and connect with legal professionals.
        </p>
      </div>

      {/* --- Right Form Column --- */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <header className={styles.welcomeHeader}>
            <h1>Sign In</h1>
            <p>Please enter your details to continue.</p>
          </header>

          {/* --- Google Login Button --- */}
          <div className={styles.googleBtnContainer}>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
              useOneTap
              theme="button"
              size="xlarge"
              width="23rem" // You can adjust this width
            />
          </div>

          <div className={styles.divider}>OR</div>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Email or Username"
                className={styles.inputField}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className={styles.passwordIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            {error && <p className={styles.errorText}>{error}</p>}
            
            <div className={styles.formFooter} style={{ justifyContent: 'flex-end', marginBottom: '1.5rem', textAlign: 'right' }}>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            
            <button type="submit" className={styles.signInBtn}>Sign In</button>
          </form>

          <div className={styles.formFooter}>
            <p>Need an account? <Link to="/select-role">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;