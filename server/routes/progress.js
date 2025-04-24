import express from 'express';
import Progress from '../models/Progress.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/save', authMiddleware, async (req, res) => {
  const { videoId, watchedIntervals, lastWatchedPosition, progressPercentage } = req.body;
  const userId = req.user.id;

  let progress = await Progress.findOne({ userId, videoId });
  if (progress) {
    progress.watchedIntervals = watchedIntervals;
    progress.lastWatchedPosition = lastWatchedPosition;
    progress.progressPercentage = progressPercentage;
  } else {
    progress = new Progress({ userId, videoId, watchedIntervals, lastWatchedPosition, progressPercentage });
  }
  await progress.save();
  res.json({ message: 'Progress saved' });
});

router.get('/:videoId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { videoId } = req.params;

  try {
    const record = await Progress.findOne({ userId, videoId });
    if (record) {
      return res.json(record);
    }
    return res.json({
      watchedIntervals: [],
      lastWatchedPosition: 0,
      progressPercentage: 0
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
