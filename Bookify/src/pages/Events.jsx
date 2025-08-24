import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Events.css';
import { Toaster, toast } from "react-hot-toast";
import { CircularProgress } from '@mui/material'; // Import loader
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isAdmin, setIsAdmin] = useState('');
  const [userId, setUserId] = useState('');
  const [search , setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userDataString = localStorage.getItem('bookifyUser');
        const token = userDataString ? JSON.parse(userDataString).accessToken : null;
        const parsedData = userDataString ? JSON.parse(userDataString) : null;

        const role = parsedData?.user?.role || '';
        const id = parsedData?.user?._id || '';
        setIsAdmin(role);
        setUserId(id);

        const response = await axios.get(`${backendURL}/api/v1/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(response.data.data || []);
        setLoading(false); // Data fetched, hide loader
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false); // Hide loader even on error
        toast.error("Failed to fetch events.");
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="events-container">
      <div className="events-heading">
        <h3>Events in your City</h3>
        <input
          className='search'
          type="text"
          placeholder='Search Events 🔍︎'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isAdmin === "admin" && (
        <button className="add-event-btn" onClick={() => navigate('/create-event')}>
          Add Event
        </button>
      )}

      {loading ? ( // Show loader while fetching
        <div className="loader-container">
          <CircularProgress />
        </div>
      ) : (
        <div className="cards-wrapper">
          {filteredEvents.map((event) => (
            <div className="event-card" key={event._id}>
              <img src={event.coverImage} alt={event.title} className="event-image" />
              <div className="event-details">
                <h2>{event.title}</h2>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Language:</strong> {event.language}</p>
                <p><strong>Rating:</strong> {event.rating}/5</p>
                <p><strong>Ticket Prize: Rs 200</strong></p>
              </div>
              {isAdmin === "admin" && String(userId) === String(event.createdBy) && (
                <button className="delete-event-btn" onClick={() => {
                  toast.success("Event deleted successfully!");
                  navigate(`/delete-event/${event._id}`);
                }}>
                  Delete
                </button>
              )}
              <button className='book-event-btn' onClick={()=>navigate(`/event/${event._id}/theatres`)}>Book</button>
            </div>
          ))}
          <Toaster position="top-right" reverseOrder={false} />
        </div>
      )}
    </div>
  );
};

export default Events;
