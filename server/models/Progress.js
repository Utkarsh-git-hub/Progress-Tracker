import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
  watchedIntervals: [[Number]],
  lastWatchedPosition: Number,
  progressPercentage: Number
});
export default mongoose.model('Progress', progressSchema);
