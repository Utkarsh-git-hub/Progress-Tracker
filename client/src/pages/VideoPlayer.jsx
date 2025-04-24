import React, { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import ProgressBar from '../components/ProgressBar';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const videoRef = useRef();
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [watchedSet, setWatchedSet] = useState(new Set());
  const lastSavedTime = useRef(0);

  useEffect(() => {
    api.get('/videos')
      .then(res => {
        const found = res.data.find(v => v._id === videoId);
        setVideo(found);
      })
      .catch(console.error);
  }, [videoId]);

  useEffect(() => {
    api.get(`/progress/${videoId}`)
      .then(res => {
        const { watchedIntervals = [], lastWatchedPosition = 0, progressPercentage = 0 } = res.data;
        const set = new Set();
        watchedIntervals.forEach(([start, end]) => {
          for (let i = start; i < end; i++) set.add(i);
        });
        setWatchedSet(set);
        setProgress(progressPercentage);
        lastSavedTime.current = lastWatchedPosition;
        if (videoRef.current) {
          videoRef.current.currentTime = lastWatchedPosition;
        }
      })
      .catch(console.error);
  }, [videoId]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const immediateSaveProgress = async (setToSave, lastTimeSec, progPercent) => {
      if (!videoRef.current || setToSave.size === 0) return;
      const timesArr = [...setToSave].sort((a, b) => a - b);
      const intervals = [];
      let start = timesArr[0], end = timesArr[0];
      for (let i = 1; i < timesArr.length; i++) {
        if (timesArr[i] === end + 1) {
          end = timesArr[i];
        } else {
          intervals.push([start, end + 1]);
          start = end = timesArr[i];
        }
      }
      intervals.push([start, end + 1]);

      try {
        await api.post('/progress/save', {
          videoId,
          watchedIntervals: intervals,
          lastWatchedPosition: lastTimeSec,
          progressPercentage: progPercent
        });
      } catch (err) {
        console.error('Immediate save error', err);
      }
    };

    const tick = () => {
      if (!vid.paused && !vid.seeking) {
        const sec = Math.floor(vid.currentTime);
        if (!watchedSet.has(sec)) {
          const newSet = new Set(watchedSet).add(sec);
          setWatchedSet(newSet);

          const uniqueCount = newSet.size;
          const newProg = (uniqueCount / vid.duration) * 100;
          setProgress(newProg);

          lastSavedTime.current = sec;
          immediateSaveProgress(newSet, sec, newProg);
        }
      }
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [watchedSet, videoId]);

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

  const handlePauseOrEnded = () => saveProgress();
  const handleSeeked = () => {
    if (videoRef.current) {
      lastSavedTime.current = Math.floor(videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    const onUnload = () => {
      if (videoRef.current) lastSavedTime.current = Math.floor(videoRef.current.currentTime);
      saveProgress();
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  useEffect(() => {
    return () => {
      if (videoRef.current) lastSavedTime.current = Math.floor(videoRef.current.currentTime);
      saveProgress();
    };
  }, [location.pathname]);

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
        onSeeked={handleSeeked}
        onPause={handlePauseOrEnded}
        onEnded={handlePauseOrEnded}
      />
      <p className="progress-text">Progress: {progress.toFixed(2)}%</p>
    </div>
  );
};

export default VideoPlayer;









