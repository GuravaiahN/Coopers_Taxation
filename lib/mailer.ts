// lib/mailer.ts
import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.SMTP_PORT || process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_SERVER_PASSWORD || process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string
) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Cooper's Taxation Support" <${fromEmail}>`,
    to: email,
    subject: "Password Reset Request - Cooper's Taxation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <img src="${baseUrl}/images/Logo.png" alt="Cooper's Taxation" style="width: 150px;" />
        </div>
        <h2 style="color: #C84B31; text-align: center; font-family: 'Arial', sans-serif;">
          Password Reset Request
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear valued client,
        </p>
        <p style="font-size: 16px; color: #333;">
          We received a request to reset your password for your Cooper's Taxation account. If you didn't make this request, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; color: #333;">
          To reset your password, please click the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #C84B31; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 16px; color: #333;">
          If you're having trouble clicking the button, copy and paste the following link into your browser:
        </p>
        <p style="font-size: 14px; color: #777; word-wrap: break-word; background: #f5f5f5; padding: 10px; border-radius: 5px;">
          <a href="${resetUrl}" style="color: #C84B31;">${resetUrl}</a>
        </p>
        <p style="font-size: 16px; color: #333;">
          This link will expire in 1 hour for security purposes.
        </p>
        <p style="font-size: 16px; color: #333;">
          Thanks,<br />
          Cooper's Taxation Team
        </p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">
          This email was sent by Cooper's Taxation. If you did not request a password reset, please ignore this message or contact our support team.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const transporter = createTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Cooper's Taxation" <${fromEmail}>`,
    to: email,
    subject: "Welcome to Cooper's Taxation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <div style="text-align: center; padding: 20px 0;">
          <img src="${baseUrl}/images/Logo.png" alt="Cooper's Taxation" style="width: 150px;" />
        </div>
        <h2 style="color: #C84B31; text-align: center; font-family: 'Arial', sans-serif;">
          Welcome to Cooper's Taxation!
        </h2>
        <p style="font-size: 16px; color: #333;">
          Dear ${name},
        </p>
        <p style="font-size: 16px; color: #333;">
          Thank you for choosing Cooper's Taxation for your tax needs. Your account has been successfully created!
        </p>
        <p style="font-size: 16px; color: #333;">
          You can now access your dashboard to:
        </p>
        <ul style="font-size: 16px; color: #333; padding-left: 20px;">
          <li>Upload your tax documents</li>
          <li>Track your tax filing status</li>
          <li>Schedule consultations</li>
          <li>Access tax resources</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/user/dashboard" style="background-color: #C84B31; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block;">Access Your Dashboard</a>
        </div>
        <p style="font-size: 16px; color: #333;">
          If you have any questions, please don't hesitate to contact our support team.
        </p>
        <p style="font-size: 16px; color: #333;">
          Best regards,<br />
          Cooper's Taxation Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

export const sendContactFormEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@cooperstaxation.com';

  const mailOptions = {
    from: `"Cooper's Taxation Contact Form" <${fromEmail}>`,
    to: adminEmail,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #C84B31; text-align: center;">
          New Contact Form Submission
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
          </tr>
        </table>
        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Message:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="font-size: 12px; color: #777; text-align: center;">
          This message was sent via the Cooper's Taxation website contact form.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact form email sent successfully');
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw new Error('Failed to send contact form email');
  }
};
