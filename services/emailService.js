import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'inspire0656@gmail.com',
    pass: 'olauyolsoanpjosl',
  },
});

export const sendOnboardingEmail = async (
  employeeData,
  applicationUrl = 'http://localhost:5173'
) => {
  const { firstName, lastName, companyEmailId } = employeeData;

  // Define the PDF attachments from inspire-docs folder
  const docsPath = path.join(__dirname, '..', 'inspire-docs');
  const attachments = [];

  // Check and add attachments with error handling
  const potentialAttachments = [
    {
      filename: 'Resume_Format.pdf',
      path: path.join(docsPath, 'Resume_Format.pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: `Acceptable_Use_Policy_${firstName}_${lastName}.pdf`,
      path: path.join(docsPath, 'Acceptable Use Policy (AUP) (firstname_lastname).pdf'),
      contentType: 'application/pdf'
    },
    {
      filename: `IP_Confidentiality_Agreement_${firstName}_${lastName}.pdf`,
      path: path.join(docsPath, 'IP & Confidentiality Agreement (firstname_lastname).pdf'),
      contentType: 'application/pdf'
    }
  ];

  // Add attachments that exist
  for (const attachment of potentialAttachments) {
    try {
      if (fs.existsSync(attachment.path)) {
        attachments.push(attachment);
        console.log(`Attachment found: ${attachment.filename}`);
      } else {
        console.warn(`Attachment not found: ${attachment.path}`);
      }
    } catch (error) {
      console.error(`Error checking attachment ${attachment.filename}:`, error);
    }
  }

  // Create the HTML content based on attachment availability
  const documentStatusText = attachments.length === 0
    ? '<p style="color: #ff6b6b; font-style: italic;"><strong>Note:</strong> Documents will be available in the application or contact your Project Manager for the documents.</p>'
    : '<p style="color: #28a745; font-style: italic;"><strong>✓</strong> All required documents are attached to this email.</p>';

  const nextStepsText = attachments.length > 0
    ? 'Download the attached PDF documents'
    : 'Contact your Project Manager to get the required documents';

  const mailOptions = {
    from: 'inspire0656@gmail.com',
    to: companyEmailId,
    subject: 'Welcome to Food brands - Onboarding Process Initiated',
    attachments: attachments,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Welcome to Food brands!</h2>
        <p>Hi <strong>${firstName} ${lastName}</strong>,</p>
        <p>Your onboarding process has been initiated. Please find the required documents information below:</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d32f2f; margin-top: 0;">📎 Required Documents:</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>Resume Format Template</strong> - Use this format to prepare your resume</li>
            <li><strong>Acceptable Use Policy (AUP)</strong> - Please read, sign, and upload</li>
            <li><strong>IP & Confidentiality Agreement</strong> - Please read, sign, and upload</li>
          </ul>
          ${documentStatusText}
        </div>

        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin-top: 0;">📋 Next Steps:</h3>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>${nextStepsText}</li>
            <li>Read and sign the Policy and Agreement documents</li>
            <li>Prepare your resume using the provided format</li>
            <li>Click the link below to complete your onboarding</li>
            <li>Upload your signed documents and resume in the application</li>
          </ol>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${applicationUrl}/login" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Complete Your Onboarding</a>
        </div>

        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3>🔐 Your Login Credentials:</h3>
          <p><strong>Username:</strong> ${companyEmailId}</p>
          <p><strong>Password:</strong> inspire@123</p>
        </div>

        <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>⚠️ Important:</strong> Please ensure all documents are properly signed and uploaded before your start date. Contact your Project Manager if you have any questions.</p>
        </div>

        <p>Best regards,<br>Food brands HR Team</p>
      </div>
    `,
  };

  // Try sending with attachments first
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Onboarding email sent successfully:', info.messageId);
    console.log(`Attachments included: ${attachments.length}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending onboarding email with attachments:', error);

    // If attachments fail, try sending without attachments
    if (attachments.length > 0) {
      console.log('Attempting to send email without attachments...');
      try {
        const mailOptionsWithoutAttachments = {
          from: 'inspire0656@gmail.com',
          to: companyEmailId,
          subject: 'Welcome to Food brands - Onboarding Process Initiated',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d32f2f;">Welcome to Food brands!</h2>
              <p>Hi <strong>${firstName} ${lastName}</strong>,</p>
              <p>Your onboarding process has been initiated. Please contact your Project Manager to get the required documents.</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #d32f2f; margin-top: 0;">📎 Required Documents:</h3>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li><strong>Resume Format Template</strong> - Use this format to prepare your resume</li>
                  <li><strong>Acceptable Use Policy (AUP)</strong> - Please read, sign, and upload</li>
                  <li><strong>IP & Confidentiality Agreement</strong> - Please read, sign, and upload</li>
                </ul>
                <p style="color: #ff6b6b; font-style: italic;"><strong>Note:</strong> Documents will be available in the application or contact your Project Manager for the documents.</p>
              </div>

              <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">📋 Next Steps:</h3>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Contact your Project Manager to get the required documents</li>
                  <li>Read and sign the Policy and Agreement documents</li>
                  <li>Prepare your resume using the provided format</li>
                  <li>Click the link below to complete your onboarding</li>
                  <li>Upload your signed documents and resume in the application</li>
                </ol>
              </div>

              <div style="margin: 30px 0; text-align: center;">
                <a href="${applicationUrl}/login" style="background-color: #d32f2f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Complete Your Onboarding</a>
              </div>

              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <h3>🔐 Your Login Credentials:</h3>
                <p><strong>Username:</strong> ${companyEmailId}</p>
                <p><strong>Password:</strong> inspire@123</p>
              </div>

              <div style="background-color: #fff3e0; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p><strong>⚠️ Important:</strong> Please ensure all documents are properly signed and uploaded before your start date. Contact your Project Manager if you have any questions.</p>
              </div>

              <p>Best regards,<br>Food brands HR Team</p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptionsWithoutAttachments);
        console.log('Onboarding email sent without attachments:', info.messageId);
        return { success: true, messageId: info.messageId, warning: 'Email sent without attachments due to attachment error' };
      } catch (fallbackError) {
        console.error('Error sending onboarding email without attachments:', fallbackError);
        return { success: false, error: fallbackError.message };
      }
    } else {
      return { success: false, error: error.message };
    }
  }
};

export const sendEmployeeDetailsToManager = async (employeeData, pmEmails) => {
  const { firstName, lastName, companyEmailId } = employeeData;

  // Ensure pmEmails is an array and always includes Raja.RavindraPulimela@company.com
  let emailRecipients = [];
  if (Array.isArray(pmEmails)) {
    emailRecipients = [...pmEmails];
  } else {
    emailRecipients = [pmEmails];
  }

  // Always include Raja.RavindraPulimela@company.com if not already present
  const rajaEmail = 'Raja.RavindraPulimela@company.com';
  if (!emailRecipients.includes(rajaEmail)) {
    emailRecipients.push(rajaEmail);
  }

  // Prepare attachments from employee's uploaded files
  const attachments = [];

  if (employeeData.resumeFile && employeeData.resumeFile.path) {
    attachments.push({
      filename: `Resume_${firstName}_${lastName}_${employeeData.resumeFile.originalName}`,
      path: employeeData.resumeFile.path,
      contentType: employeeData.resumeFile.mimetype
    });
  }

  if (employeeData.policyFile && employeeData.policyFile.path) {
    attachments.push({
      filename: `Signed_Policy_${firstName}_${lastName}_${employeeData.policyFile.originalName}`,
      path: employeeData.policyFile.path,
      contentType: employeeData.policyFile.mimetype
    });
  }

  if (employeeData.agreementFile && employeeData.agreementFile.path) {
    attachments.push({
      filename: `Signed_Agreement_${firstName}_${lastName}_${employeeData.agreementFile.originalName}`,
      path: employeeData.agreementFile.path,
      contentType: employeeData.agreementFile.mimetype
    });
  }

  // Create attachment status for HTML
  const attachmentStatusHtml = `
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #d32f2f; margin-top: 0;">📎 Attached Documents:</h3>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li><strong>Resume:</strong> ${employeeData.resumeFile ? '✓ Attached' : '❌ Not uploaded'}</li>
        <li><strong>Signed Policy Document:</strong> ${employeeData.policyFile ? '✓ Attached' : '❌ Not uploaded'}</li>
        <li><strong>Signed Agreement Document:</strong> ${employeeData.agreementFile ? '✓ Attached' : '❌ Not uploaded'}</li>
      </ul>
    </div>
  `;

  // Create employee details HTML
  const employeeDetailsHtml = `
    <table style="border-collapse: collapse; width: 100%;">
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Employee ID:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.employeeId
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name:</td><td style="border: 1px solid #ddd; padding: 8px;">${firstName} ${lastName}</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email:</td><td style="border: 1px solid #ddd; padding: 8px;">${companyEmailId}</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Role:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.role
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Start Date:</td><td style="border: 1px solid #ddd; padding: 8px;">${new Date(
      employeeData.startDate
    ).toLocaleDateString()}</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">ESA Project ID:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.esaProjectId
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">ESA Project Name:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.esaProjectName
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Inspire SOW Number:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.inspireSowNumber
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Birthday:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.birthday
      ? new Date(employeeData.birthday).toLocaleDateString()
      : 'Not provided'
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Phone Number:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.phoneNumber || 'Not provided'
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Location:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.location || 'Not provided'
    }</td></tr>
      <tr><td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Account Status:</td><td style="border: 1px solid #ddd; padding: 8px;">${employeeData.accountStatus
    }</td></tr>
    </table>
  `;

  const mailOptions = {
    from: 'inspire0656@gmail.com',
    to: emailRecipients.join(', '), // Join multiple emails with comma
    subject: `Employee onboarding process completed for ${firstName} ${lastName}`,
    attachments: attachments, // Include employee's uploaded files
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Employee Onboarding Complete</h2>
        <p>Hello,</p>
        <p>Employee <strong>${firstName} ${lastName}</strong> has completed their onboarding process and submitted all required documents.</p>
        
        ${attachmentStatusHtml}
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1976d2;">Employee Details:</h3>
          ${employeeDetailsHtml}
        </div>
        
        <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>✅ Action Required:</strong> Please review the attached documents and update the employee's account status in the Project Manager dashboard as needed.</p>
        </div>
        
        <p>Best regards,<br>Food brands System</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Employee details email with attachments sent to:', emailRecipients.join(', '), 'MessageId:', info.messageId);
    console.log('Attachments included:', attachments.length);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending employee details email with attachments:', error);

    // If attachments fail, try sending without attachments
    if (attachments.length > 0) {
      console.log('Attempting to send manager email without attachments...');
      try {
        const mailOptionsWithoutAttachments = {
          from: 'inspire0656@gmail.com',
          to: emailRecipients.join(', '),
          subject: `Employee onboarding process completed for ${firstName} ${lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d32f2f;">Employee Onboarding Complete</h2>
              <p>Hello,</p>
              <p>Employee <strong>${firstName} ${lastName}</strong> has completed their onboarding process and submitted all required documents.</p>
              
              <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>⚠️ Note:</strong> Documents could not be attached to this email due to technical issues. Please check the employee files directly in the system or contact IT support.</p>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #1976d2;">Employee Details:</h3>
                ${employeeDetailsHtml}
              </div>
              
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>✅ Action Required:</strong> Please review the employee's documents in the system and update their account status in the Project Manager dashboard as needed.</p>
              </div>
              
              <p>Best regards,<br>Food brands System</p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptionsWithoutAttachments);
        console.log('Employee details email sent without attachments:', info.messageId);
        return { success: true, messageId: info.messageId, warning: 'Manager email sent without attachments due to attachment error' };
      } catch (fallbackError) {
        console.error('Error sending manager email without attachments:', fallbackError);
        return { success: false, error: fallbackError.message };
      }
    } else {
      return { success: false, error: error.message };
    }
  }
};

export const sendStatusChangeEmail = async (employeeData, newStatus) => {
  const { firstName, lastName, companyEmailId } = employeeData;

  const mailOptions = {
    from: 'inspire0656@gmail.com',
    to: companyEmailId,
    subject: 'Account Status Update - Food brands',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Account Status Update</h2>
        <p>Hi <strong>${firstName} ${lastName}</strong>,</p>
        <p>Your account status has been updated to: <strong>${newStatus}</strong></p>
        <p>If you have any questions, please contact your Project Manager.</p>
        <p>Best regards,<br>Food brands HR Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Status change email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending status change email:', error);
    return { success: false, error: error.message };
  }
};
