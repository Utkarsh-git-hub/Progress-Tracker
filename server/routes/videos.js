import express from 'express';
import Video from '../models/Video.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

export default router;