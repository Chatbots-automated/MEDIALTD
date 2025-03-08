import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the dist directory after build
app.use(express.static(join(__dirname, 'dist')));

// Initialize database
let db;
const initializeDatabase = async () => {
  db = await open({
    filename: './bookings.db',
    driver: sqlite3.Database
  });

  // Create bookings table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      services TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized');
};

// Initialize database when server starts
initializeDatabase().catch(err => {
  console.error('Database initialization error:', err);
});

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API endpoint for checking availability
app.get('/api/check-availability', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required' });
    }
    
    // Query database for bookings on the specified date
    const bookings = await db.all(
      'SELECT time FROM bookings WHERE date = ?',
      [date]
    );
    
    // Extract booked times
    const bookedTimes = bookings.map(booking => booking.time);
    
    res.status(200).json({ 
      success: true, 
      bookedTimes 
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check availability. Please try again.' 
    });
  }
});

// API endpoint for sending booking emails
app.post('/api/send-booking', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    services,
    date,
    time,
    location,
    message
  } = req.body;

  // Format the services array into a string
  const servicesString = Array.isArray(services) 
    ? services.join(', ') 
    : services;

  try {
    // Check if the time slot is already booked
    const existingBooking = await db.get(
      'SELECT id FROM bookings WHERE date = ? AND time = ?',
      [date, time]
    );
    
    if (existingBooking) {
      return res.status(409).json({ 
        success: false, 
        message: 'This time slot has already been booked. Please select another time.' 
      });
    }
    
    // Save booking to database
    await db.run(
      `INSERT INTO bookings (firstName, lastName, email, phone, services, date, time, location, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, servicesString, date, time, location, message || '']
    );

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to your business email
      subject: `New Booking: ${servicesString} - ${firstName} ${lastName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        
        <h3>Booking Details</h3>
        <p><strong>Services:</strong> ${servicesString}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Location:</strong> ${location}</p>
        
        <h3>Additional Information</h3>
        <p>${message || 'No additional information provided.'}</p>
      `,
      // Add text version for email clients that don't support HTML
      text: `
        New Booking Request
        Date: ${new Date().toLocaleString()}
        
        Customer Information
        Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Booking Details
        Services: ${servicesString}
        Date: ${date}
        Time: ${time}
        Location: ${location}
        
        Additional Information
        ${message || 'No additional information provided.'}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    // Send confirmation email to customer
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Booking Confirmation - Touch Media Ltd.`,
      html: `
        <h2>Thank You for Your Booking!</h2>
        <p>Dear ${firstName},</p>
        <p>We have received your booking request for ${servicesString} on ${date} at ${time}.</p>
        <p>Our team will review your request and get back to you shortly to confirm your appointment.</p>
        
        <h3>Your Booking Details</h3>
        <p><strong>Services:</strong> ${servicesString}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Location:</strong> ${location}</p>
        
        <p>If you need to make any changes to your booking, please contact us at ${process.env.EMAIL_USER}.</p>
        
        <p>Best regards,</p>
        <p>Touch Media Ltd. Team</p>
      `,
      text: `
        Thank You for Your Booking!
        
        Dear ${firstName},
        
        We have received your booking request for ${servicesString} on ${date} at ${time}.
        Our team will review your request and get back to you shortly to confirm your appointment.
        
        Your Booking Details
        Services: ${servicesString}
        Date: ${date}
        Time: ${time}
        Location: ${location}
        
        If you need to make any changes to your booking, please contact us at ${process.env.EMAIL_USER}.
        
        Best regards,
        Touch Media Ltd. Team
      `
    };
    
    await transporter.sendMail(confirmationEmail);
    
    res.status(200).json({ success: true, message: 'Booking submitted successfully!' });
  } catch (error) {
    console.error('Error sending email or saving booking:', error);
    res.status(500).json({ success: false, message: 'Failed to send booking. Please try again.' });
  }
});

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});