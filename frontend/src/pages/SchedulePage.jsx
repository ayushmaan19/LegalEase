import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// --- 1. IMPORT 'Views' ---
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from './SchedulePage.module.css';
import { useAuth } from '../context/AuthContext';

// Setup for react-big-calendar
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// --- 2. DEFINE THE VIEWS WE WANT ---
const allViews = [Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA];

const SchedulePage = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 3. ADD STATE FOR CALENDAR CONTROLS ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH); // Default to month view

  // State for the new appointment form
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // --- (Fetch Appointments is unchanged) ---
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5001/api/appointments');
      const events = res.data.map(apt => ({
        id: apt._id,
        title: apt.status === 'Available' ? 'Available Slot' : `Booked: ${apt.citizen?.name || 'Client'}`,
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        resource: apt,
      }));
      setMyEvents(events);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // --- (Add Slot is unchanged) ---
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const startDateTime = new Date(`${date}T${startTime}`);
      const endDateTime = new Date(`${date}T${endTime}`);
      if (endDateTime <= startDateTime) {
        return setError('End time must be after start time.');
      }
      await axios.post('http://localhost:5001/api/appointments', {
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      setSuccess('New availability slot added!');
      fetchAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to add slot.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // --- 4. ADD HANDLERS FOR NAVIGATION AND VIEW CHANGES ---
  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, [setCurrentDate]);

  const handleView = useCallback((newView) => {
    setCurrentView(newView);
  }, [setCurrentView]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Scheduled Appointments</h1>
      <p className={styles.pageSubtitle}>Manage your calendar and add new availability slots for clients to book.</p>

      <div className={styles.scheduleLayout}>
        {/* --- 5. UPDATE THE CALENDAR COMPONENT --- */}
        <div className={styles.calendarContainer}>
          <Calendar
            localizer={localizer}
            events={myEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', minHeight: '600px' }}
            
            // --- THESE ARE THE FIXES ---
            view={currentView}         // Tell the calendar what view to show
            date={currentDate}         // Tell the calendar what date to show
            onView={handleView}        // Tell the calendar what to do when view changes
            onNavigate={handleNavigate}  // Tell the calendar what to do when date changes
            views={allViews}           // Tell the calendar all views are enabled
            // --- END OF FIXES ---
          />
        </div>

        {/* --- THE FORM (Unchanged) --- */}
        <aside className={styles.formContainer}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Add New Slot</h3>
            <form onSubmit={handleAddSlot}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  className={styles.formInput}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div className={styles.timeGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="time"
                    id="startTime"
                    className={styles.formInput}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="time"
                    id="endTime"
                    className={styles.formInput}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
              
              {error && <div className={styles.errorText}>{error}</div>}
              {success && <div className={styles.successText}>{success}</div>}
              
              <button type="submit" className={styles.submitButton}>Add Availability</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SchedulePage;