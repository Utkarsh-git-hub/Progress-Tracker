import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: String,
  videoSrc: String,
  duration: Number
});

export default mongoose.model('Video', videoSchema);
