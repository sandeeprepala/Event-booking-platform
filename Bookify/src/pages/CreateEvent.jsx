import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateEvent.css'; 
import { Toaster, toast } from "react-hot-toast";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    language: '',
    rating: ''
  });

  const [coverImage, setCoverImage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userDataString = localStorage.getItem('bookifyUser');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    if (userData?.user?.role === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      setMessage("Please upload a cover image.");
      toast.error("Please upload a cover image."); // 🔥 show toast
      return;
    }

    try {
      const userDataString = localStorage.getItem('bookifyUser');
      const token = userDataString ? JSON.parse(userDataString).accessToken : null;

      if (!token) {
        setMessage("Authentication token missing.");
        toast.error("Authentication token missing."); // 🔥 show toast
        return;
      }

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      form.append('coverImage', coverImage);

      const response = await axios.post(
        '/api/v1/admin/create-event',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const successMsg = response.data.message || "Event created successfully!";
      setMessage(successMsg);
      toast.success(successMsg); // 🔥 success toast

      setFormData({
        title: '',
        description: '',
        date: '',
        venue: '',
        language: '',
        rating: ''
      });
      setCoverImage(null);
    } catch (error) {
      console.error("Error creating event:", error);
      const errorMsg = error.response?.data?.message || "Server error while creating event.";
      setMessage(errorMsg);
      toast.error(errorMsg); // 🔥 error toast
    }
  };

  if (!isAdmin) {
    return <p>You are not authorized to create events.</p>;
  }

  return (
    <div className="event-form-container">
      <h2>Create Event</h2>

      {/* Toast container must be rendered once */}
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
        <input type="text" name="language" placeholder="Language" value={formData.language} onChange={handleChange} required />
        <input type="number" name="rating" placeholder="Rating (1-5)" min="1" max="5" value={formData.rating} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
