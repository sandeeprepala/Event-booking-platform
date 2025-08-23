import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminZoomLinkSender.css";

const AdminZoomLinkSender = () => {
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [selectedShow, setSelectedShow] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userDataString = localStorage.getItem('bookifyUser');
   const token = userDataString ? JSON.parse(userDataString).accessToken : null;

  // Fetch theatres on mount
  useEffect(() => {
    axios.get("/api/v1/theatres", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTheatres(res.data.data || []))
      .catch(() => setTheatres([]));
  }, [token]);

  // Update shows when theatre changes
  useEffect(() => {
    if (!selectedTheatre) {
      setShows([]);
      setSelectedShow("");
      return;
    }
    const theatre = theatres.find(t => t._id === selectedTheatre);
    setShows(theatre ? theatre.shows : []);
    setSelectedShow("");
  }, [selectedTheatre, theatres]);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axios.post("/api/v1/admin/sendLink", {
        theatreId: selectedTheatre,
        showId: selectedShow,
        zoomLink
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Zoom link sent successfully!");
      setZoomLink("");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to send link."
      );
    }
    setLoading(false);
  };

  return (
    <div className="zoom-link-sender-container">
      <h2>Send Zoom Link to Booked Users</h2>
      <form className="zoom-link-form" onSubmit={handleSend}>
        <label>
          Select Theatre:
          <select
            value={selectedTheatre}
            onChange={e => setSelectedTheatre(e.target.value)}
            required
          >
            <option value="">-- Select Theatre --</option>
            {theatres.map(theatre => (
              <option key={theatre._id} value={theatre._id}>{theatre.name}</option>
            ))}
          </select>
        </label>
        <label>
          Select Show:
          <select
            value={selectedShow}
            onChange={e => setSelectedShow(e.target.value)}
            required
            disabled={!shows.length}
          >
            <option value="">-- Select Show --</option>
            {shows.map(show => (
              <option key={show._id} value={show._id}>
                {show.showSlot}
              </option>
            ))}
          </select>
        </label>
        <label>
          Zoom Link:
          <input
            type="url"
            value={zoomLink}
            onChange={e => setZoomLink(e.target.value)}
            placeholder="Paste Zoom link here"
            required
          />
        </label>
        <button type="submit" disabled={loading || !selectedTheatre || !selectedShow || !zoomLink}>
          {loading ? "Sending..." : "Send"}
        </button>
        {message && <div className="zoom-link-message">{message}</div>}
      </form>
    </div>
  );
};

export default AdminZoomLinkSender;