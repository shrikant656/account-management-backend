import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Employee from '../models/Employee.js';
import ProjectManager from '../models/ProjectManager.js';
import { sendOnboardingEmail, sendEmployeeDetailsToManager, sendStatusChangeEmail } from '../services/emailService.js';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Register new employee (by Project Manager)
router.post('/register', upload.fields([
  { name: 'resumeFile', maxCount: 1 },
  { name: 'policyFile', maxCount: 1 },
  { name: 'agreementFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      companyEmailId,
      role,
      startDate,
      esaProjectId,
      esaProjectName,
      inspireSowNumber,
      projectManagerName,
      projectManagerEmailId,
      accountStatus
    } = req.body;

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !companyEmailId || !role ||
      !startDate || !esaProjectId || !esaProjectName || !inspireSowNumber ||
      !projectManagerName || !projectManagerEmailId) {
      return res.status(400).json({
        message: 'All required fields must be filled'
      });
    }

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { companyEmailId }]
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: 'Employee with this ID or email already exists'
      });
    }

    // Create employee data object
    const employeeData = {
      employeeId,
      firstName,
      lastName,
      companyEmailId,
      role,
      startDate: new Date(startDate),
      esaProjectId,
      esaProjectName,
      inspireSowNumber,
      projectManagerName,
      projectManagerEmailId,
      accountStatus: accountStatus || 'In Progress'
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.resumeFile) {
        const file = req.files.resumeFile[0];
        employeeData.resumeFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }

      if (req.files.policyFile) {
        const file = req.files.policyFile[0];
        employeeData.policyFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }

      if (req.files.agreementFile) {
        const file = req.files.agreementFile[0];
        employeeData.agreementFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }
    }

    // Save employee to database
    const employee = new Employee(employeeData);
    await employee.save();

    // Send onboarding email
    const emailResult = await sendOnboardingEmail(employeeData);

    if (emailResult.success) {
      const message = emailResult.warning
        ? 'Employee registered successfully and onboarding email sent (without attachments - contact IT if needed)'
        : 'Employee registered successfully and onboarding email sent';

      res.json({
        success: true,
        message: message,
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.companyEmailId
        },
        emailWarning: emailResult.warning || null
      });
    } else {
      res.json({
        success: true,
        message: 'Employee registered successfully but email failed to send',
        employee: {
          id: employee._id,
          employeeId: employee.employeeId,
          name: `${employee.firstName} ${employee.lastName}`,
          email: employee.companyEmailId
        },
        emailError: emailResult.error
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get employee details for updating (employee fills additional info)
router.get('/profile/:id', authenticateToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ success: true, employee });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update employee details (employee completes onboarding)
router.put('/update/:id', upload.fields([
  { name: 'resumeFile', maxCount: 1 },
  { name: 'policyFile', maxCount: 1 },
  { name: 'agreementFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { birthday, phoneNumber, location } = req.body;

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update employee data
    if (birthday) employee.birthday = new Date(birthday);
    if (phoneNumber) employee.phoneNumber = phoneNumber;
    if (location) employee.location = location;

    // Handle file uploads
    if (req.files) {
      if (req.files.resumeFile) {
        const file = req.files.resumeFile[0];
        employee.resumeFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }

      if (req.files.policyFile) {
        const file = req.files.policyFile[0];
        employee.policyFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }

      if (req.files.agreementFile) {
        const file = req.files.agreementFile[0];
        employee.agreementFile = {
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path
        };
      }
    }

    employee.isOnboardingComplete = true;
    await employee.save();

    // Send email to project manager
    const emailRecipients = [employee.projectManagerEmailId, 'Raja.RavindraPulimela@company.com'];
    const emailResult = await sendEmployeeDetailsToManager(employee, emailRecipients);

    res.json({
      success: true,
      message: 'Employee details updated successfully',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all employees (for Project Manager dashboard)
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Employee list error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update employee status (by Project Manager)
router.put('/status/:id', authenticateToken, async (req, res) => {
  try {
    const { accountStatus } = req.body;

    if (!['In Progress', 'Completed', 'Hold'].includes(accountStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.accountStatus = accountStatus;
    await employee.save();

    // Send status change email to employee
    const emailResult = await sendStatusChangeEmail(employee, accountStatus);

    res.json({
      success: true,
      message: 'Employee status updated successfully',
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get upcoming birthdays
router.get('/birthdays', async (req, res) => {
  try {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const employees = await Employee.find({
      birthday: { $exists: true, $ne: null }
    }).select('firstName lastName companyEmailId birthday');

    // Filter employees with birthdays in the next 30 days
    const upcomingBirthdays = employees.filter(emp => {
      if (!emp.birthday) return false;

      const birthday = new Date(emp.birthday);
      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1);
      }

      return thisYearBirthday <= nextMonth;
    }).sort((a, b) => {
      const birthdayA = new Date(today.getFullYear(), new Date(a.birthday).getMonth(), new Date(a.birthday).getDate());
      const birthdayB = new Date(today.getFullYear(), new Date(b.birthday).getMonth(), new Date(b.birthday).getDate());
      return birthdayA - birthdayB;
    }).slice(0, 3);

    res.json({ success: true, birthdays: upcomingBirthdays });
  } catch (error) {
    console.error('Birthdays fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;