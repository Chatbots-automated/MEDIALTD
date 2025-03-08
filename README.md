# Touch Media Ltd. Website

This is the official website for Touch Media Ltd., a premium photography and videography agency.

## Features

- Responsive design for all devices
- Portfolio showcase
- Service booking system
- Email notification system for bookings
- Touch+ premium subscription information

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     EMAIL_HOST=your_smtp_host
     EMAIL_PORT=your_smtp_port
     ```

### Running the Application

#### Development Mode

To run the application in development mode:

```
npm run dev
```

This will start the Vite development server.

#### Production Mode

To build the application for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

### Email Server

To run the email server:

```
npm run server
```

This will start the Express server that handles email sending for bookings and contact form submissions.

## Project Structure

- `/src` - React application source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
- `/public` - Static assets
- `/ASSETS` - Media assets (images, videos)
- `server.js` - Express server for email handling

## Email Handling

The application includes a simple email handling system that:

1. Captures booking information from the booking form
2. Sends an email notification to the business email
3. Sends a confirmation email to the customer
4. Works without requiring a database

## Contact

For any questions or issues, please contact:
- Email: info@touchmedialtd.com
- Instagram: [@touch_medialtd](https://www.instagram.com/touch_medialtd/)