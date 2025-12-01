import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LawyerCard from './LawyerCard';
import styles from './FindLawyer.module.css';

// --- DUMMY DATA (formatted to match API) ---
const dummyLawyers = [
  {
    _id: 'dummy1', 
    user: { name: 'Priya Sharma (Sample)', enrollmentNumber: 'BAR/MH/2015/1234' },
    experience: 8,
    specializations: ['Family Law', 'Property Law', 'Civil Rights'],
    languages: ['English', 'Hindi', 'Marathi'],
    proBono: true,
    verified: true
  },
  {
    _id: 'dummy2',
    user: { name: 'Rajesh Kumar (Sample)', enrollmentNumber: 'BAR/DL/2012/5678' },
    experience: 12,
    specializations: ['Criminal Law', 'Labor Law'],
    languages: ['English', 'Hindi'],
    proBono: false,
    verified: false
  },
  {
    _id: 'dummy3',
    user: { name: 'Sneha Patel (Sample)', enrollmentNumber: 'BAR/GJ/2018/9012' },
    experience: 5,
    specializations: ['Consumer Protection', 'Taxation', 'Corporate Law'],
    languages: ['English', 'Gujarati'],
    proBono: true,
    verified: true
  },
];

const FindLawyerPage = () => {
  // --- STATE FOR FILTERS ---
  const [searchQuery, setSearchQuery] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [language, setLanguage] = useState('All');
  const [experience, setExperience] = useState('All');
  const [status, setStatus] = useState('All');

  // --- STATE FOR DATA ---
  const [masterProfileList, setMasterProfileList] = useState(dummyLawyers); // Holds all profiles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- FETCH DATA ONCE ON LOAD ---
  useEffect(() => {
    const fetchLawyerProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('http://localhost:5001/api/profile');
        const realProfiles = res.data.filter(profile => profile.user);
        const realProfileUserIds = realProfiles.map(p => p.user._id);
        const filteredDummies = dummyLawyers.filter(dummy => 
          !realProfileUserIds.includes(dummy.user?._id)
        );
        // Set the master list with all real and unique dummy profiles
        setMasterProfileList([...realProfiles, ...filteredDummies]);
      } catch (err) {
        console.error('Failed to fetch profiles', err);
        setError('Failed to load lawyer profiles. Displaying sample data.');
      }
      setLoading(false);
    };
    fetchLawyerProfiles();
  }, []); // Empty array means this runs only once

  // --- FILTERING LOGIC ---
  // This runs every time a filter state changes
  const filteredProfiles = useMemo(() => {
    return masterProfileList.filter(profile => {
      const query = searchQuery.toLowerCase();
      
      // 1. Search Query Filter
      const nameMatch = profile.user.name.toLowerCase().includes(query);
      const specMatch = profile.specializations.some(spec => spec.toLowerCase().includes(query));
      if (searchQuery && !(nameMatch || specMatch)) {
        return false;
      }
      
      // 2. Specialization Filter
      if (specialization !== 'All' && !profile.specializations.includes(specialization)) {
        return false;
      }
      
      // 3. Language Filter
      if (language !== 'All' && !profile.languages.includes(language)) {
        return false;
      }
      
      // 4. Experience Filter
      if (experience !== 'All') {
        const minExp = parseInt(experience, 10);
        if (profile.experience < minExp) return false;
      }

      // 5. Status Filter
      if (status === 'Verified' && !profile.verified) return false;
      if (status === 'Pro Bono' && !profile.proBono) return false;
      
      return true; // If all checks pass, include the profile
    });
  }, [searchQuery, specialization, language, experience, status, masterProfileList]);

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <h1>Find Legal Experts</h1>
        <p>Connect with qualified lawyers for your legal needs</p>
      </header>
      
      {/* --- FUNCTIONAL FILTERS --- */}
      <div className={styles.filters}>
        <input 
          type="search" 
          placeholder="Search by name or specialization..." 
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className={styles.filterSelect} value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
          <option value="All">All Specializations</option>
          <option value="Family Law">Family Law</option>
          <option value="Criminal Law">Criminal Law</option>
          <option value="Property Law">Property Law</option>
          <option value="Labor Law">Labor Law</option>
          <option value="Taxation">Taxation</option>
        </select>
        <select className={styles.filterSelect} value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="All">All Languages</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="Marathi">Marathi</option>
          <option value="Gujarati">Gujarati</option>
        </select>
        <select className={styles.filterSelect} value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="All">All Experience</option>
          <option value="1">1+ Years</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
        </select>
        <select className={styles.filterSelect} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Verified">Verified</option>
          <option value="Pro Bono">Pro Bono</option>
        </select>
      </div>

      {/* --- RENDER LOGIC --- */}
      {loading ? (
        <p className={styles.resultsHeader}>Loading lawyers...</p>
      ) : (
        <>
          {error && <p className={styles.errorText}>{error}</p>}
          
          <p className={styles.resultsHeader}>Showing {filteredProfiles.length} lawyers matching your criteria</p>
          
          {filteredProfiles.length > 0 ? (
            <div className={styles.resultsGrid}>
              {filteredProfiles.map(profile => (
                <LawyerCard key={profile._id} profile={profile} />
              ))}
            </div>
          ) : (
            <p className={styles.resultsHeader}>No lawyers match your current filters.</p>
          )}
        </>
      )}
    </div>
  );
};

export default FindLawyerPage;