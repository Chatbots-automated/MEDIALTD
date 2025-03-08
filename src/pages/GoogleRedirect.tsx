import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Logo from '../components/Logo';

const GoogleRedirect: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Parse the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const error = queryParams.get('error');
    
    if (code) {
      setAuthCode(code);
      setAuthStatus('success');
      
      // You can send this code to your backend or handle it as needed
      console.log('Authorization code:', code);
      
      // Optional: Send the code to your backend
      // sendCodeToBackend(code);
    } else if (error) {
      setErrorMessage(error);
      setAuthStatus('error');
    } else {
      setErrorMessage('No authorization code received');
      setAuthStatus('error');
    }
  }, [location]);
  
  // Optional: Function to send the code to your backend
  /*
  const sendCodeToBackend = async (code: string) => {
    try {
      const response = await fetch('/api/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process authorization code');
      }
      
      // Handle successful response
      console.log('Auth code processed successfully:', data);
    } catch (error) {
      console.error('Error sending auth code to backend:', error);
      setErrorMessage('Failed to process authorization code');
      setAuthStatus('error');
    }
  };
  */
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
          ${isScrolled ? 'bg-black/90 backdrop-blur-sm py-3' : 'bg-transparent py-5'}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          {/* Back Button */}
          <Link 
            to="/" 
            className="text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content Section */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">GOOGLE AUTHORIZATION</h2>
            <div className="w-20 h-1 bg-white mb-12"></div>
            
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-8">
              {authStatus === 'loading' && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-xl text-gray-300">Processing authorization...</p>
                </div>
              )}
              
              {authStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-green-400" />
                  </div>
                  
                  <h3 className="text-2xl font-medium mb-4">Authorization Successful!</h3>
                  
                  <p className="text-gray-300 mb-6">
                    Your Google account has been successfully authorized.
                  </p>
                  
                  <div className="bg-black/30 rounded-lg p-4 mb-6 text-left overflow-x-auto">
                    <p className="text-sm text-gray-400 mb-2">Authorization Code:</p>
                    <code className="text-green-400 text-sm break-all">{authCode}</code>
                  </div>
                  
                  <p className="text-gray-200 mb-6">
                    You can now close this window and return to the application.
                  </p>
                  
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    Return to Home
                  </Link>
                </div>
              )}
              
              {authStatus === 'error' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} className="text-red-400" />
                  </div>
                  
                  <h3 className="text-2xl font-medium mb-4">Authorization Failed</h3>
                  
                  <p className="text-gray-300 mb-6">
                    There was a problem authorizing your Google account.
                  </p>
                  
                  {errorMessage && (
                    <div className="bg-red-900/30 border border-red-800 text-white p-4 mb-6 rounded-md">
                      {errorMessage}
                    </div>
                  )}
                  
                  <p className="text-gray-200 mb-6">
                    Please try again or contact support if the problem persists.
                  </p>
                  
                  <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
                  >
                    Return to Home
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Touch Media Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default GoogleRedirect;