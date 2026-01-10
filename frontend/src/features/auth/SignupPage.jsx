import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import styles from './Auth.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Auth3DScene from '../../components/common/Auth3DScene';

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [error, setError] = useState('');
  
  const { loginAction } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!role || (role !== 'citizen' && role !== 'lawyer')) {
      navigate('/select-role');
    }
  }, [role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const signupData = {
        name,
        username,
        email,
        countryCode,
        phone,
        password,
        role,
        enrollmentNumber: role === 'lawyer' ? enrollmentNumber : undefined,
      };
      const res = await axios.post('http://localhost:5001/api/auth/register', signupData);
      loginAction(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again.');
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
          <h1 className={styles.brandingTitle}>Get started</h1>
          <p className={styles.brandingSubtitle}>
            Create your account and connect with legal professionals today.
          </p>
        </div>
      </div>

      {/* --- Right Form Column --- */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <header className={styles.welcomeHeader}>
            <h1>Create Your Account</h1>
            <p>Signing up as a {role === 'lawyer' ? 'Lawyer' : 'Citizen'}</p>
          </header>

          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Full Name" className={styles.inputField}
                value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Username (e.g., ayush24)" className={styles.inputField}
                value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            
            <div className={styles.inputGroup}>
              <input type="email" placeholder="Email" className={styles.inputField}
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className={`${styles.inputGroup} ${styles.phoneGroup}`}>
              <select className={styles.countryCodeSelect} value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
              </select>
              <input type="tel" placeholder="Phone Number" className={styles.phoneInput}
                value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className={styles.inputGroup}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" 
                className={styles.inputField}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                minLength="6" required 
              />
              <div className={styles.passwordIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            {role === 'lawyer' && (
              <div className={styles.inputGroup}>
                <input type="text" placeholder="Unique Enrollment Number" className={styles.inputField}
                  value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} required />
              </div>
            )}

            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.signInBtn}>Sign Up</button>
          </form>

          <div className={styles.formFooter}>
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;