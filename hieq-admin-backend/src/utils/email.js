const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter (configure with your email settings)
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'missayushi06@gmail.com';
  const emailPassword = process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD;

  // Validate that email credentials exist and are not empty
  if (!emailPassword || emailPassword.trim() === '') {
    const errorMessage = 
      'Email credentials are missing or empty. Please set EMAIL_PASSWORD or EMAIL_APP_PASSWORD in your .env file.\n' +
      'For Gmail, you need to use an App Password (not your regular password).\n' +
      'Generate one at: https://myaccount.google.com/apppasswords\n' +
      'Then add to your .env file: EMAIL_PASSWORD=your_app_password';
    
    console.error('Email Configuration Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Validate email user is not empty
  if (!emailUser || emailUser.trim() === '') {
    const errorMessage = 
      'Email user is missing. Please set EMAIL_USER in your .env file.';
    console.error('Email Configuration Error:', errorMessage);
    throw new Error(errorMessage);
  }

  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser.trim(),
        pass: emailPassword.trim(),
      },
    });
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw new Error(`Failed to create email transporter: ${error.message}`);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken, resetUrl) => {
  try {
    // Validate email parameter
    if (!email || !email.trim()) {
      throw new Error('Recipient email address is required');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'missayushi06@gmail.com',
      to: email.trim(),
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Password Reset Request</h2>
          <p>You have requested to reset your password. Click the link below to reset it:</p>
          <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file. ' +
        'For Gmail, make sure you are using an App Password, not your regular password.'
      );
    }
    
    throw error;
  }
};

// Send email verification email
exports.sendEmailVerificationEmail = async (email, verificationToken, verificationUrl) => {
  try {
    // Validate email parameter
    if (!email || !email.trim()) {
      throw new Error('Recipient email address is required');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'missayushi06@gmail.com',
      to: email.trim(),
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
          <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
          <p><a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a></p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. Please check your EMAIL_USER and EMAIL_PASSWORD in .env file. ' +
        'For Gmail, make sure you are using an App Password, not your regular password.'
      );
    }
    
    throw error;
  }
};

