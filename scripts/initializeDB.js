import mongoose from 'mongoose';
import ProjectManager from '../models/ProjectManager.js';

const MONGODB_URI =
  'mongodb+srv://sp656:Angular656@cluster0.j6kcxvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function initializeDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Create default project managers
    const defaultPMs = [
      {
        emailId: 'Raja.RavindraPulimela@company.com',
        password: 'inspirePM@321',
        name: 'Raja Ravindra Pulimela',
        isAdmin: true,
      },
      {
        emailId: 'shrikant656@gmail.com',
        password: 'inspirePM@321',
        name: 'Shrikant Panigrahi',
        isAdmin: true,
      },
      {
        emailId: 'shrikant.panigrahi@inspirebrands.com',
        password: 'inspirePM@321',
        name: 'Shrikant Panigrahi',
        isAdmin: true,
      },
      {
        emailId: 'Rita.Singh@company.com',
        password: 'inspirePM@321',
        name: 'Rita Singh',
        isAdmin: true,
      },
    ];

    for (const pmData of defaultPMs) {
      const existingPM = await ProjectManager.findOne({
        emailId: pmData.emailId,
      });

      if (!existingPM) {
        const pm = new ProjectManager(pmData);
        await pm.save();
        console.log(`Created Project Manager: ${pmData.name}`);
      } else {
        console.log(`Project Manager already exists: ${pmData.name}`);
      }
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

initializeDB();
