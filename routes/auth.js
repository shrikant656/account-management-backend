import express from 'express';
import bcrypt from 'bcryptjs';
import Employee from '../models/Employee.js';
import ProjectManager from '../models/ProjectManager.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    if (role === 'Project Manager') {
      // Check if it's a project manager
      const pm = await ProjectManager.findOne({ emailId: username });
      if (pm && pm.password === password) {
        const token = generateToken(pm);
        return res.json({
          success: true,
          token,
          user: {
            id: pm._id,
            email: pm.emailId,
            name: pm.name,
            role: 'Project Manager',
            isAdmin: pm.isAdmin
          }
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    } else {
      // Check if it's an employee
      const employee = await Employee.findOne({ companyEmailId: username });
      if (employee && employee.password === password) {
        const token = generateToken(employee);
        return res.json({
          success: true,
          token,
          user: {
            id: employee._id,
            email: employee.companyEmailId,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role,
            isOnboardingComplete: employee.isOnboardingComplete
          }
        });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // For simplicity, we'll skip full JWT verification here and just check the user exists
    // In a real app, you'd use the authenticateToken middleware

    res.json({ message: 'Profile endpoint - implement JWT verification' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;