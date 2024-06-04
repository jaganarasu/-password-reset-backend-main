// userController.js
const User = require('../Models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const EMAIL = process.env.E_MAIL;
const E_PASS = process.env.E_PASS;
const SEC_KEY= process.env.SECRET_KEY;

exports.signup = async (req, res) => {
    try {
      const { email, password, userName, mobileNumber, avatar } = req.body;
  
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ email, password: hashedPassword, userName, mobileNumber, avatar });
      
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', err });
      console.log(err);
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
  
      // Generate a JWT token with user information
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        SEC_KEY, // Replace with a secret key for JWT signing
        { expiresIn: '5h' } 
      );
  
      res.json({
        message: 'Login successful',
        token,
        userName: user.userName,
        avatar: user.avatar 
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', err });
    }
  };

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // Token expiration time: 1 hour
  
      await user.save();
  
      // Nodemailer configuration
      const transporter = nodemailer.createTransport({
        service: 'Outlook', // Example: 'Gmail', 'Outlook'
        auth: {
          user: EMAIL,
          pass: E_PASS
        }
      });
  
      const mailOptions = {
        from: EMAIL,
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n`
              + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
              + `https://password-reset-guvi-app.netlify.app/verify-token/${resetToken}\n\n`
              + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };
  
      // Sending the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'Error sending email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Reset link sent to your email' });
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
      console.log(err);
    }
  };

  exports.verifyToken = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() },
      });
  
      if (user) {
        res.status(200).json({ message: 'Token verified' });
      } else {
        res.status(401).json({ message: 'Token verification failed' });
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Logic to reset the password based on the token
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiration: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Token is invalid or expired' });
      }
  
      // Resetting the user's password and cleaning up the resetToken fields
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
  
      await user.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
