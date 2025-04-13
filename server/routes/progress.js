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

  const progress = await Progress.findOne({ userId, videoId });
  res.json(progress || {});
});

export default router;