import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';
import ProjectManager from '../models/ProjectManager.js';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_brands_secret_key_2024';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Verify user still exists
    if (decoded.role === 'Project Manager') {
      const pm = await ProjectManager.findById(decoded.id);
      if (!pm) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      const employee = await Employee.findById(decoded.id);
      if (!employee) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.companyEmailId || user.emailId,
      role: user.role || 'Project Manager'
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};