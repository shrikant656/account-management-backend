import mongoose from 'mongoose';

const projectManagerSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    default: 'inspirePM@321'
  },
  name: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ProjectManager', projectManagerSchema);