import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const DeleteEventPage = () => {
    const navigate = useNavigate();
  const { id } = useParams(); // grabs `:id` from the URL

  useEffect(() => {
    const deleteEvent = async () => {
      const token = JSON.parse(localStorage.getItem('bookifyUser'))?.accessToken;
      try {
        await axios.delete(`${backendURL}/api/v1/events/delete-event/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    };

    deleteEvent();
  }, [id]);
};

export default DeleteEventPage;