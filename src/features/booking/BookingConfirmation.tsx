import React from 'react';
import { CheckCircle, Clock, Calendar, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookingConfirmationProps {
  onClose: () => void;
  status?: 'OK' | 'NO_TIME';
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ onClose, status = 'OK' }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          {status === 'OK' ? (
            <>
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              
              <h2 className="text-2xl font-medium mb-2">Thank you for completing your booking!</h2>
              
              <p className="text-gray-300 mb-6">
                Your reservation has been successfully registered in our system.
              </p>
              
              <div className="w-full bg-black/30 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3 text-white">Here's what happens next:</h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                      <Clock size={16} className="text-white" />
                    </div>
                    <p className="text-gray-300">Our team will contact you within the next 2-4 hours</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <p className="text-gray-300">We'll confirm all your booking details</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                      <CreditCard size={16} className="text-white" />
                    </div>
                    <p className="text-gray-300">We'll discuss payment options and process your preferred method</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-200 mb-6">
                Welcome aboard! We're excited to create something magical together. ✨
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <Clock size={32} className="text-red-400" />
              </div>
              
              <h2 className="text-2xl font-medium mb-2">Booking Duration Too Long</h2>
              
              <p className="text-gray-300 mb-6">
                We apologize, but the selected time slot cannot accommodate the requested duration. 
                Please select a shorter booking duration or choose a different time slot.
              </p>
              
              <div className="w-full bg-black/30 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-3 text-white">Suggestions:</h3>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                      <Clock size={16} className="text-white" />
                    </div>
                    <p className="text-gray-300">Try reducing the booking duration</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-2 rounded-full mr-3 flex-shrink-0">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <p className="text-gray-300">Choose an earlier time slot</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            {status === 'OK' ? 'OK' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;