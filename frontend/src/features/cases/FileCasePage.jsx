import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './FileCasePage.module.css'; // We will create this CSS file next
import { FiFileText, FiType, FiGlobe, FiDollarSign } from 'react-icons/fi';

const FileCasePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caseType, setCaseType] = useState('');
  const [language, setLanguage] = useState('English');
  const [amount, setAmount] = useState('₹under-5000');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!title || !description || !caseType || !language || !amount) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const caseData = { title, description, caseType, language, amount };
      
      // The token is already in axios headers from our AuthContext
      const res = await axios.post('http://localhost:5001/api/cases', caseData);

      setSuccess('Case filed successfully! Redirecting you to your cases...');
      
      // Clear the form
      setTitle('');
      setDescription('');
      setCaseType('');

      // Redirect to "My Cases" after 2 seconds
      setTimeout(() => {
        navigate('/my-cases');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to file case. Please try again.');
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>File a New Case</h1>
      <p className={styles.pageSubtitle}>Please provide as much detail as possible. This information will be sent to verified lawyers.</p>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          {/* Case Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title"><FiFileText /> Case Title</label>
            <input 
              type="text" 
              id="title"
              className={styles.formInput}
              placeholder="e.g., Dispute over Property Inheritance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Case Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description">Detailed Description</label>
            <textarea 
              id="description"
              className={styles.formTextarea}
              rows="6"
              placeholder="Describe your legal issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className={styles.formGrid}>
            {/* Case Type */}
            <div className={styles.formGroup}>
              <label htmlFor="caseType"><FiType /> Case Type</label>
              <select 
                id="caseType" 
                className={styles.formSelect}
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
              >
                <option value="" disabled>Select a legal domain...</option>
                <option value="Property Law">Property Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Labor Law">Labor Law</option>
                <option value="Consumer Law">Consumer Law</option>
                <option value="Civil Rights">Civil Rights</option>
                <option value="Taxation">Taxation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Language */}
            <div className={styles.formGroup}>
              <label htmlFor="language"><FiGlobe /> Preferred Language</label>
              <select 
                id="language" 
                className={styles.formSelect}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="English">English</option>
                <option value="हिंदी">हिंदी</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>
          </div>
          
          {/* Claim Amount */}
          <div className={styles.formGroup}>
             <label htmlFor="amount"><FiDollarSign /> Estimated Claim Amount (if applicable)</label>
              <select 
                id="amount" 
                className={styles.formSelect}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              >
                <option value="₹under-5000">₹under-5000</option>
                <option value="₹5000-50000">₹5,000 - ₹50,000</option>
                <option value="₹50000-150000">₹50,000 - ₹1,50,000</option>
                <option value="₹150000+">₹1,50,000+</option>
                <option value="N/A">N/A (Not a monetary dispute)</option>
              </select>
          </div>
          
          {/* --- Messages --- */}
          {error && <div className={styles.errorText}>{error}</div>}
          {success && <div className={styles.successText}>{success}</div>}
          
          <div className={styles.cardFooter}>
            <button type="submit" className={styles.submitButton}>Submit Case</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileCasePage;