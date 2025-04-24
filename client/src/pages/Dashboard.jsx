import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/videos');
        setVideos(res.data);
      } catch (err) {
        console.error('Error fetching videos', err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="container dashboard-container">
      <h2>Dashboard</h2>
      {videos.length === 0 ? (
        <p>No videos available.</p>
      ) : (
        <ul className="video-list">
          {videos.map(video => (
            <li key={video._id} className="video-item">
              <Link to={`/video/${video._id}`}>{video.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
