import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const videoRef = useRef();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [watchedSet, setWatchedSet] = useState(new Set());
  const [duration, setDuration] = useState(0);
  const lastSavedTime = useRef(0);
  const lastProgress = useRef(0);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get('/videos');
        const found = res.data.find(v => v._id === videoId);
        setVideo(found);
      } catch (err) {
        console.error('Error fetching video', err);
      }
    };
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get(`/progress/${videoId}`);
        const { watchedIntervals, lastWatchedPosition, progressPercentage } = res.data;
        const newWatched = new Set();
        watchedIntervals.forEach(([start, end]) => {
          for (let i = start; i < end; i++) newWatched.add(i);
        });
        setWatchedSet(newWatched);
        setProgress(progressPercentage);
        lastSavedTime.current = lastWatchedPosition;
        lastProgress.current = progressPercentage;  
        if (videoRef.current) {
          videoRef.current.currentTime = lastWatchedPosition;  
        }
      } catch (err) {
        console.error('Error fetching progress', err);
      }
    };
    fetchProgress();
  }, [videoId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (!video.paused && !video.seeking) {
        const currentTime = Math.floor(video.currentTime);
        if (!watchedSet.has(currentTime)) {
          const newWatched = new Set(watchedSet);
          newWatched.add(currentTime);
          setWatchedSet(newWatched);

          const uniqueSeconds = newWatched.size;
          const newProgress = (uniqueSeconds / video.duration) * 100;
          setProgress(newProgress);
          lastSavedTime.current = currentTime; 
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [watchedSet]);

  const saveProgress = async () => {
    if (!videoRef.current || watchedSet.size === 0) return;

    const times = [...watchedSet].sort((a, b) => a - b);
    const intervals = [];
    let start = times[0], end = times[0];

    for (let i = 1; i < times.length; i++) {
      if (times[i] === end + 1) {
        end = times[i];
      } else {
        intervals.push([start, end + 1]);
        start = end = times[i];
      }
    }
    intervals.push([start, end + 1]);

    try {
      await api.post('/progress/save', {
        videoId,
        watchedIntervals: intervals,
        lastWatchedPosition: lastSavedTime.current,
        progressPercentage: progress
      });
    } catch (err) {
      console.error('Error saving progress', err);
    }
  };

  const handlePauseOrEnded = () => {
    saveProgress();
  };


  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  useEffect(() => {
    return () => {
      saveProgress();  
    };
  }, []);

  if (!video) {
    return <div className="container"><p>Loading video...</p></div>;
  }

  return (
    <div className="container video-player-container">
      <h2>{video.title}</h2>
      <ProgressBar progress={progress} />
      <video
        ref={videoRef}
        src={video.videoSrc}
        controls
        className="video-element"
        onPause={handlePauseOrEnded}
        onEnded={handlePauseOrEnded}
        onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      />
      <p className="progress-text">Progress: {progress.toFixed(2)}%</p>
    </div>
  );
};

export default VideoPlayer;





