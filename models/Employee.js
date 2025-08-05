import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  cognizantEmailId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Team Member', 'Project Manager']
  },
  startDate: {
    type: Date,
    required: true
  },
  esaProjectId: {
    type: String,
    required: true
  },
  esaProjectName: {
    type: String,
    required: true
  },
  inspireSowNumber: {
    type: String,
    required: true
  },
  projectManagerName: {
    type: String,
    required: true
  },
  projectManagerEmailId: {
    type: String,
    required: true
  },
  birthday: {
    type: Date
  },
  phoneNumber: {
    type: String
  },
  location: {
    type: String
  },
  accountStatus: {
    type: String,
    required: true,
    enum: ['In Progress', 'Completed', 'Hold'],
    default: 'In Progress'
  },
  resumeFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  policyFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  agreementFile: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String
  },
  password: {
    type: String,
    default: 'inspire@123'
  },
  isOnboardingComplete: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Employee', employeeSchema);