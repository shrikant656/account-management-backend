# Food brands - Employee Onboarding & Offboarding Application

A comprehensive React.js and Node.js application for managing employee onboarding and offboarding processes at Food brands.

## 🚀 Features

### Frontend (React.js with Vite)

- **Modern UI**: Built with Material-UI and TailwindCSS
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Authentication**: JWT-based secure login system
- **Role-based Access**: Different dashboards for employees and project managers
- **File Upload**: Support for document uploads (resume, policy, agreement)
- **Toast Notifications**: Real-time feedback using react-toastify
- **Gallery**: Beautiful masonry layout with nature images

### Backend (Node.js with Express)

- **RESTful API**: Clean and organized API endpoints
- **MongoDB Integration**: Cloud-based MongoDB Atlas database
- **Email Service**: Automated email notifications using Nodemailer
- **File Management**: Multer for handling file uploads
- **Authentication**: JWT token-based authentication
- **Data Validation**: Comprehensive input validation

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React.js, Vite, Material-UI, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Database**: MongoDB Atlas
- **Email**: Nodemailer with Gmail SMTP
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

### Project Structure

```
workspace/
├── inspire-brands-frontend/     # React.js frontend
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── context/             # React contexts
│   │   ├── services/            # API services
│   │   ├── assets/              # Static assets
│   │   │   └── images/          # Gallery images (10 local images)
│   │   └── utils/               # Utility functions
│   └── public/                  # Static assets
└── inspire-brands-backend/      # Node.js backend
    ├── models/                  # MongoDB models
    ├── routes/                  # API routes
    ├── middleware/              # Custom middleware
    ├── services/                # Business logic
    ├── scripts/                 # Database scripts
    ├── inspire-docs/            # PDF documents for onboarding
    │   ├── Resume_Format.pdf
    │   ├── Acceptable Use Policy (AUP) (firstname_lastname).pdf
    │   └── IP & Confidentiality Agreement (firstname_lastname).pdf
    └── uploads/                 # File uploads directory
```

## 🎯 Application Flow

### 1. Homepage

- Welcome message for Food brands
- Display of all brand logos (Arby's, Baskin Robbins, Buffalo Wild Wings, Jimmy Johns, Sonic)
- Upcoming birthdays section (top 3 employees)

### 2. User Authentication

- **Login**: Username (email), password, and role selection
- **Roles**: Team Member or Project Manager
- **Default Credentials**:
  - **Project Manager**: Raja.RavindraPulimela@company.com / inspirePM@321
  - **Admin**: Rita.Singh@company.com / inspirePM@321

### 3. Employee Onboarding Process

#### Project Manager Workflow:

1. **Register New Employee**: Fill comprehensive form with:
   - Employee details (ID, name, email, role, start date)
   - Project information (ESA project ID/name, SOW number)
   - Project manager details
   - Optional document uploads
2. **Send Onboarding Email**: Automatic email with login credentials and PDF attachments
3. **Monitor Progress**: Dashboard with employee list and status tracking
4. **Receive Completion Notification**: Email with employee details and all uploaded documents as attachments
5. **Update Status**: Change employee status and notify via email

#### Employee Workflow:

1. **Receive Email**: Get onboarding email with credentials and attached PDF documents:
   - **Resume Format Template** (Resume_Format.pdf)
   - **Acceptable Use Policy (AUP)** - to be signed
   - **IP & Confidentiality Agreement** - to be signed
2. **Download & Review**: Download all attached PDF documents from email
3. **Prepare Documents**:
   - Read and sign the Policy and Agreement documents
   - Prepare resume using the provided format template
4. **Login**: Access employee dashboard using provided credentials
5. **Complete Profile**: Fill additional details with validation:
   - Birthday (with validation - no future dates allowed)
   - Phone number
   - Location
   - Upload ALL required documents (resume, signed policy, signed agreement)
6. **Validation Check**: System ensures all required documents are uploaded before submission
7. **Submit**: Complete onboarding process (only allowed with all documents)
8. **Confirmation**: Redirect to thank you page
9. **Manager Notification**: Project Manager and Raja.RavindraPulimela@company.com receive completion email with all uploaded documents as attachments

## 📧 Email Notifications

### Automated Emails:

1. **Onboarding Initiation**: Sent to new employees with:
   - Login credentials (username/password)
   - Three PDF attachments:
     - Resume Format Template
     - Acceptable Use Policy (AUP) document
     - IP & Confidentiality Agreement document
   - Step-by-step onboarding instructions
   - Professional HTML formatting with clear next steps

2. **Profile Completion**: Sent to project managers AND Raja.RavindraPulimela@company.com when employees complete onboarding with:
   - Complete employee details and information table
   - **File Attachments**: All uploaded documents attached to email
     - Employee's resume with custom naming: `Resume_FirstName_LastName_OriginalFileName`
     - Signed policy document: `Signed_Policy_FirstName_LastName_OriginalFileName`
     - Signed agreement document: `Signed_Agreement_FirstName_LastName_OriginalFileName`
   - Attachment status indicator (which documents are included)
   - Action required section with next steps for managers
   - Professional formatting with color-coded sections

3. **Status Updates**: Sent to employees when their status changes

### PDF Document Attachments:

**For Employee Onboarding Email:**

- **Resume_Format.pdf**: Template for employees to format their resume correctly
- **Acceptable*Use_Policy*(firstname_lastname).pdf**: Policy document requiring signature
- **IP*Confidentiality_Agreement*(firstname_lastname).pdf**: Confidentiality agreement requiring signature

**For Manager Completion Email:**

- **Employee's uploaded resume**: With descriptive filename including employee name
- **Employee's signed policy document**: With descriptive filename including employee name
- **Employee's signed agreement document**: With descriptive filename including employee name

### Email Configuration:

- **Service**: Gmail SMTP
- **From**: inspire0656@gmail.com
- **Authentication**: App-specific password
- **Attachments**: PDF documents from `inspire-docs/` folder (onboarding) and `uploads/` folder (completion)
- **Recipients**: Employees for onboarding, PM + Raja for completion notifications
- **File Validation**: Ensures all required documents are uploaded before notification

## 🗄️ Database Schema

### Employee Model:

```javascript
{
  employeeId: String (unique),
  firstName: String,
  lastName: String,
  companyEmailId: String (unique),
  role: String (Team Member/Project Manager),
  startDate: Date,
  esaProjectId: String,
  esaProjectName: String,
  inspireSowNumber: String,
  projectManagerName: String,
  projectManagerEmailId: String,
  birthday: Date,
  phoneNumber: String,
  location: String,
  accountStatus: String (In Progress/Completed/Hold),
  resumeFile: Object,
  policyFile: Object,
  agreementFile: Object,
  password: String (default: inspire@123),
  isOnboardingComplete: Boolean
}
```

### Project Manager Model:

```javascript
{
  emailId: String (unique),
  password: String (default: inspirePM@321),
  name: String,
  isAdmin: Boolean
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository** (if applicable)
2. **Install backend dependencies**:

   ```bash
   cd inspire-brands-backend
   npm install
   ```

3. **Install frontend dependencies**:

   ```bash
   cd inspire-brands-frontend
   npm install
   ```

4. **Initialize database**:

   ```bash
   cd inspire-brands-backend
   npm run init-db
   ```

5. **Start the backend server**:

   ```bash
   npm run dev
   ```

6. **Start the frontend server**:
   ```bash
   cd inspire-brands-frontend
   npm run dev
   ```

### Access the Application:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔐 Default Login Credentials

### Project Managers:

- **Raja Ravindra Pulimela**
  - Email: Raja.RavindraPulimela@company.com
  - Password: inspirePM@321

- **Rita Singh**
  - Email: rita.singh@company.com
  - Password: inspirePM@321

### Employees:

- Use credentials provided in onboarding email
- Default password: inspire@123

## 📱 Pages & Features

### Public Pages:

- **Home**: Welcome page with brand showcase and upcoming birthdays
- **Gallery**: Masonry layout with 20+ beautiful nature images
- **Login**: Authentication page with role selection

### Protected Pages:

- **Register**: Employee registration form (Project Managers only)
- **Employee Dashboard**: Profile completion and document upload
- **PM Dashboard**: Employee management and status tracking
- **Thank You**: Completion confirmation page

## 🛠️ API Endpoints

### Authentication:

- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Employee Management:

- `POST /api/employees/register` - Register new employee
- `GET /api/employees/profile/:id` - Get employee profile
- `PUT /api/employees/update/:id` - Update employee profile (with file validation)
- `GET /api/employees/list` - Get all employees (PM only)
- `PUT /api/employees/status/:id` - Update employee status (PM only)
- `GET /api/employees/birthdays` - Get upcoming birthdays

### File Upload:

- `GET /api/uploads/download/:filename` - Download uploaded files
- **File Validation**: Server-side validation ensures all required documents are uploaded
- **Email Integration**: Uploaded files automatically sent as attachments to managers

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- File type and size restrictions
- **Required File Validation**: Prevents form submission without all mandatory documents
- **Birthday Validation**: Triple-layer protection against future date selection
- Secure password handling
- CORS protection
- **File Attachment Security**: Server-side file path validation for email attachments

## 📄 File Upload Support

### Supported Formats:

- **Documents**: PDF, DOC, DOCX
- **Images**: JPEG, JPG, PNG
- **Size Limit**: 5MB per file

### Upload Types:

- **Resume** (Required): Employee's resume using provided format
- **Policy documents** (Required): Signed Acceptable Use Policy
- **Agreement documents** (Required): Signed IP & Confidentiality Agreement

### Validation Features:

- **Mandatory Upload Check**: All three documents must be uploaded before submission
- **File Type Validation**: Only approved file formats accepted
- **Visual Progress Indicators**:
  - Red asterisk (\*) for required fields
  - Outlined buttons for pending uploads
  - Green contained buttons for completed uploads
  - Success checkmarks with filenames
- **Error Prevention**: Clear error messages for missing documents
- **Email Integration**: Uploaded files automatically attached to manager notification emails

## 🎨 UI/UX Features

- **Material Design**: Consistent and modern interface
- **Responsive Layout**: Mobile-first design approach
- **Center Alignment**: All pages are properly center-aligned for professional appearance
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time status updates
- **Form Validation**: Client and server-side validation
- **Birthday Validation**: Prevents future date selection with triple-layer protection:
  - UI level: DatePicker disables future dates
  - Real-time: Immediate validation on date change
  - Submission: Final validation before API call
- **File Upload Validation**: Comprehensive document requirement enforcement:
  - Required field indicators with red asterisks (\*)
  - Dynamic button styling (outlined → contained green when uploaded)
  - Visual upload progress with checkmarks and filenames
  - Error prevention with clear missing document messages
  - Instructional guidance for each document type
- **Statistics Cards**: Fixed height cards with perfect center alignment for dashboard
- **Gallery**: Local image gallery with 10 company-relevant images
- **Email Attachments**: Automatic PDF document delivery in onboarding emails and manager notifications

## 🔮 Future Enhancements

- **Offboarding Module**: Complete employee offboarding workflow
- **Advanced Search**: Filter and search employees in PM dashboard
- **Analytics Dashboard**: Onboarding metrics and reports
- **Multi-language Support**: Internationalization
- **Advanced File Management**: Version control for documents
- **Calendar Integration**: Schedule onboarding activities
- **Digital Signature**: In-app document signing capability
- **Progress Tracking**: Visual progress indicators for onboarding steps
- **Bulk Operations**: Mass employee registration and status updates
- **Custom Email Templates**: Configurable email templates for different scenarios

## 🤝 Contributing

This application was built as a comprehensive onboarding solution for Food brands. For modifications or enhancements, please follow the existing code structure and patterns.

## 📞 Support

For technical support or questions about the application:

- Contact the development team
- Review the code documentation
- Check the console logs for debugging

---

**Built with ❤️ for Food brands Team**
