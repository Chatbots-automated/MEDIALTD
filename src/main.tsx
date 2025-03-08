import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import TouchPlus from './pages/TouchPlus.tsx';
import About from './pages/About.tsx';
import Booking from './pages/Booking.tsx';
import GoogleRedirect from './pages/GoogleRedirect.tsx';
import GoogleAuth from './pages/GoogleAuth.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/touchplus',
    element: <TouchPlus />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/booking',
    element: <Booking />
  },
  {
    path: '/auth/google',
    element: <GoogleAuth />
  },
  {
    path: '/auth/google/callback',
    element: <GoogleRedirect />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);