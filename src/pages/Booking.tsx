import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Phone, CheckCircle, ArrowRight, ArrowLeft, Sparkles, AlertCircle, FileText, Clock3 } from 'lucide-react';
import Logo from '../components/Logo';
import { Link } from 'react-router-dom';
import BookingConfirmation from '../features/booking/BookingConfirmation';
import { FETCH_TIMES_WEBHOOK, SUBMIT_BOOKING_WEBHOOK, services } from '../features/booking/constants';
import { formatDateTimeForWebhook, generateDefaultTimeSlots, validateIrishPhone, formatDateForDisplay, parseWebhookTimeSlots, formatSelectedServices, formatTimeForDisplay, calculateEndTimeAndDuration } from '../features/booking/utils';
import DaySelector from '../features/booking/DaySelector';
import TimeSlotGrid from '../features/booking/TimeSlotGrid';

const Booking: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dateInput, setDateInput] = useState<string>('');
  const [timeInput, setTimeInput] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);
  const [timeError, setTimeError] = useState<string | null>(null);
  const [standardizedDate, setStandardizedDate] = useState<string>('');
  const [standardizedTime, setStandardizedTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [videoIdeas, setVideoIdeas] = useState<string>('');
  const [productionDuration, setProductionDuration] = useState<string>('');
  const [boothDuration, setBoothDuration] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{time: string, available: boolean}[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'OK' | 'NO_TIME'>('OK');
  const [selectedDateISO, setSelectedDateISO] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (standardizedDate && selectedServices.length > 0 && currentStep === 2) {
      fetchAvailableTimeSlots(standardizedDate);
    }
  }, [standardizedDate, currentStep]);

  const fetchAvailableTimeSlots = async (selectedDate: string) => {
    setIsLoadingTimeSlots(true);
    try {
      // Convert selected date to ISO format (YYYY-MM-DD)
      const dateISO = new Date(selectedDate).toISOString().split('T')[0];
      setSelectedDateISO(dateISO);
      
      const formattedServices = formatSelectedServices(selectedServices, services);
      
      const webhookData = {
        date: dateISO,
        ...formattedServices,
        timestamp: new Date().toISOString(),
        source: 'Touch Media Website - Booking Page Time Slot Request'
      };
      
      console.log('Sending webhook data:', webhookData);
      
      const response = await fetch(FETCH_TIMES_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) throw new Error('Failed to fetch time slots');

      const data = await response.json();
      console.log('📥 RAW WEBHOOK RESPONSE:', JSON.stringify(data, null, 2));
      
      const timeSlots = parseWebhookTimeSlots(data, dateISO);
      
      console.log('✅ FINAL AVAILABLE TIME SLOTS:', timeSlots);
      setAvailableTimeSlots(timeSlots);
    } catch (error) {
      console.error('❌ ERROR FETCHING TIME SLOTS:', error);
      setAvailableTimeSlots(generateDefaultTimeSlots());
    } finally {
      setIsLoadingTimeSlots(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const sanitizedValue = value.replace(/[^0-9\s]/g, '');
      
      let formattedValue = sanitizedValue;
      
      const digitsOnly = sanitizedValue.replace(/\s/g, '');
      
      if (value.includes(' ') || sanitizedValue.length > value.length) {
        if (digitsOnly.length > 3 && digitsOnly.length <= 6) {
          formattedValue = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3)}`;
        } else if (digitsOnly.length > 6) {
          formattedValue = `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 6)} ${digitsOnly.slice(6, 10)}`;
        }
      } else {
        formattedValue = digitsOnly;
      }
      
      const phoneRegexWithSpaces = /^08[0-9]\s[0-9]{3}\s[0-9]{4}$/;
      const phoneRegexNoSpaces = /^08[0-9][0-9]{7}$/;
      
      const isValidWithSpaces = phoneRegexWithSpaces.test(formattedValue);
      const isValidNoSpaces = phoneRegexNoSpaces.test(formattedValue);
      
      if (formattedValue && !(isValidWithSpaces || isValidNoSpaces) && formattedValue.length >= 10) {
        setPhoneError('Please enter a valid Irish mobile number (08xxxxxxxx or 08x xxx xxxx)');
      } else {
        setPhoneError(null);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date: string) => {
    const webhookData = {
      date,
      ...formatSelectedServices(selectedServices, services),
      timestamp: new Date().toISOString(),
      source: 'Touch Media Website - Date Selection',
      type: 'availability_check'
    };
    
    fetch(FETCH_TIMES_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    }).catch(error => {
      console.error('Error sending date selection webhook:', error);
    });
    
    setDateInput(date);
    setStandardizedDate(date);
    setDateError(null);
    
    setTimeInput('');
    setStandardizedTime('');
    setTimeError(null);
  };

  const handleTimeSlotSelect = (time: string) => {
    setTimeInput(time);
    setStandardizedTime(time);
    setTimeError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneRegexWithSpaces = /^08[0-9]\s[0-9]{3}\s[0-9]{4}$/;
    const phoneRegexNoSpaces = /^08[0-9][0-9]{7}$/;
    
    const isValidWithSpaces = phoneRegexWithSpaces.test(formData.phone);
    const isValidNoSpaces = phoneRegexNoSpaces.test(formData.phone);
    
    if (!(isValidWithSpaces || isValidNoSpaces)) {
      setPhoneError('Please enter a valid Irish mobile number (08xxxxxxxx or 08x xxx xxxx)');
      return;
    }
    
    if (!standardizedDate) {
      setDateError('Please enter a valid date');
      return;
    }
    
    if (!standardizedTime) {
      setTimeError('Please enter a valid time');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    const formattedServices = formatSelectedServices(selectedServices, services);
    
    const formattedDateTime = formatDateTimeForWebhook(standardizedDate, standardizedTime);
    
    // Calculate end time and duration based on selected duration
    const durationToUse = selectedServices.includes('360-booth') ? boothDuration : productionDuration;
    const { endTime, duration } = calculateEndTimeAndDuration(formattedDateTime, durationToUse || '1 hour');
    
    const bookingData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      ...formattedServices,
      date: standardizedDate,
      time: standardizedTime,
      dateTime: formattedDateTime,
      endTime: endTime,
      duration: duration,
      location: location,
      videoIdeas: videoIdeas || 'No video ideas provided',
      productionDuration: productionDuration || 'Not specified',
      boothDuration: boothDuration || 'Not specified',
      message: formData.message,
      source: 'Touch Media Website',
      timestamp: new Date().toISOString()
    };
    
    try {
      console.log('Sending booking data with dateTime:', formattedDateTime);
      
      const response = await fetch(SUBMIT_BOOKING_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          source: 'Touch Media Website - Booking Form',
          timestamp: new Date().toISOString(),
          type: 'booking'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit booking');
      }
      
      const result = await response.json();
      
      // Check webhook response status
      if (result.status === 'NO_TIME') {
        setIsSubmitting(false);
        setBookingStatus('NO_TIME');
        setShowConfirmation(true);
        return;
      }
      
      setBookingStatus('OK');
      
      try {
        const serviceNames = selectedServices.map(id => 
          services.find(s => s.id === id)?.name
        );
        
        await fetch('/api/send-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            services: serviceNames,
            date: standardizedDate,
            time: standardizedTime,
            location: location,
            videoIdeas: videoIdeas,
            productionDuration: productionDuration,
            boothDuration: boothDuration,
            message: formData.message
          }),
        });
      } catch (apiError) {
        console.error('Error sending data to API endpoint:', apiError);
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      setShowConfirmation(true);
      
      setSelectedServices([]);
      setDateInput('');
      setTimeInput('');
      setStandardizedDate('');
      setStandardizedTime('');
      setLocation('');
      setVideoIdeas('');
      setProductionDuration('');
      setBoothDuration('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setIsSubmitting(false);
      setSubmitError('There was a problem submitting your booking. Please try again or contact us directly.');
      
      if (!navigator.onLine || (error instanceof Error && error.message.includes('Failed to fetch'))) {
        setIsSubmitted(true);
        setShowConfirmation(true);
        
        setSelectedServices([]);
        setDateInput('');
        setTimeInput('');
        setStandardizedDate('');
        setStandardizedTime('');
        setLocation('');
        setVideoIdeas('');
        setProductionDuration('');
        setBoothDuration('');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
        setCurrentStep(1);
      }
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedServices.length === 0) {
      return;
    }
    
    if (currentStep === 1 && selectedServices.length > 0) {
      sendServiceSelectionWebhook();
    }
    
    if (currentStep === 2 && (!standardizedDate || !standardizedTime)) {
      if (!standardizedDate) {
        setDateError('Please enter a valid date');
      }
      if (!standardizedTime) {
        setTimeError('Please enter a valid time');
      }
      return;
    }
    if (currentStep === 3 && !location) {
      return;
    }
    
    if (currentStep === 3 && selectedServices.includes('videography') && !videoIdeas) {
      console.log('User proceeded without providing video ideas for videography booking');
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const sendServiceSelectionWebhook = async () => {
    try {
      const formattedServices = formatSelectedServices(selectedServices, services);
      
      const webhookData = {
        ...formattedServices,
        timestamp: new Date().toISOString(),
        source: 'Touch Media Website - Booking Page Service Selection',
        action: 'Next button clicked',
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      
      console.log('Sending service selection webhook:', webhookData);
      
      await fetch(FETCH_TIMES_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      console.log('Service selection webhook sent successfully');
    } catch (error) {
      console.error('Error sending service selection webhook:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isNextDisabled = () => {
    if (currentStep === 1) return selectedServices.length === 0;
    if (currentStep === 2) return !standardizedDate || !standardizedTime;
    if (currentStep === 3) return !location;
    return false;
  };

  const isSubmitDisabled = () => {
    return !formData.firstName || !formData.lastName || !formData.email || !formData.phone || phoneError !== null || isSubmitting;
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const isVideographySelected = () => {
    return selectedServices.includes('videography');
  };

  const is360BoothSelected = () => {
    return selectedServices.includes('360-booth');
  };

  const formatTimeForStorage = (time: string): string => {
    if (!time) return '';
    
    if (time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      return time;
    }
    
    const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return time;
    
    let [_, hours, minutes, period] = match;
    let hour = parseInt(hours, 10);
    
    if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
    
    return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
          
          <div className="hidden md:flex space-x-8">
            <Link to="/#services" className="text-white hover:text-gray-300 transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/#portfolio" className="text-white hover:text-gray-300 transition-colors relative group">
              Portfolio
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300 transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link to="/touchplus" className="text-white hover:text-gray-300 transition-colors relative group">
              <span className="inline-flex items-center">
                <Sparkles size={16} className="mr-1 text-yellow-400" />
                Touch+
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <span className="text-white bg-black hover:bg-gray-900 transition-colors px-4 py-2 rounded-md">
              Book Now
            </span>
          </div>
          
          <Link to="/" className="md:hidden text-white px-4 py-2 border border-white/30 rounded-md hover:bg-white/10 transition-colors">
            Back to Home
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light mb-2 tracking-wide">BOOK YOUR SESSION</h2>
            <div className="w-20 h-1 bg-white mb-8"></div>
            <p className="text-xl text-gray-300 mb-12">
              Complete the booking process below to schedule your session with Touch Media.
            </p>
            
            {isSubmitted && !showConfirmation ? (
              <div className="bg-green-900/30 border border-green-800 text-white p-8 rounded-lg text-center">
                <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-medium mb-4">Booking Confirmed!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for booking with Touch Media. We've received your request and will contact you shortly to confirm your appointment. A confirmation email has been sent to your email address.
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-md"
                >
                  Return to Home
                </Link>
              </div>
            ) : (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
                <div className="flex border-b border-gray-800">
                  <div 
                    className={`flex-1 py-4 px-4 text-center ${currentStep >= 1 ? 'text-white' : 'text-gray-500'}`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      currentStep >= 1 ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                    }`}>1</span>
                    Services
                  </div>
                  <div 
                    className={`flex-1 py-4 px-4 text-center ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      currentStep >= 2 ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                    }`}>2</span>
                    Date & Time
                  </div>
                  <div 
                    className={`flex-1 py-4 px-4 text-center ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      currentStep >= 3 ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                    }`}>3</span>
                    Location
                  </div>
                  <div 
                    className={`flex-1 py-4 px-4 text-center ${currentStep >= 4 ? 'text-white' : 'text-gray-500'}`}
                  >
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                      currentStep >= 4 ? 'bg-white text-black' : 'bg-gray-800 text-gray-500'
                    }`}>4</span>
                    Details
                  </div>
                </div>
                
                <div className="p-8">
                  <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                      <div className="animate-fade-in">
                        <h3 className="text-2xl font-light mb-6">Select Service(s)</h3>
                        <p className="text-gray-400 mb-8">Choose one or more services you're interested in booking.</p>
                        
                        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-8">
                          <p className="text-white text-sm text-center">
                            The service price excludes travel fees, content production time, studio rental and any other additional charges.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          {services.map(service => (
                            <div 
                              key={service.id}
                              onClick={() => toggleService(service.id)}
                              className={`p-6 rounded-lg cursor-pointer transition-all duration-300 ${
                                selectedServices.includes(service.id) 
                                  ? service.isPremium 
                                    ? 'bg-yellow-400/20 border-2 border-yellow-400' 
                                    : 'bg-white/10 border-2 border-white'
                                  : 'bg-gray-800/50 border border-gray-700 hover:bg-gray-800'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`p-3 rounded-lg mr-4 ${
                                  service.isPremium ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-700/50 text-white'
                                }`}>
                                  <span className="text-2xl">{service.icon}</span>
                                </div>
                                <div>
                                  <h4 className={`text-xl font-medium mb-2 flex items-center ${
                                    service.isPremium ? 'text-yellow-400' : 'text-white'
                                  }`}>
                                    {service.name}
                                    {service.isPremium && <Sparkles size={16} className="ml-2 text-yellow-400" />}
                                  </h4>
                                  <p className="text-gray-300 text-sm">{service.description}</p>
                                  <p className={`mt-2 text-sm font-medium ${
                                    service.isPremium ? 'text-yellow-400' : 'text-white'
                                  }`}>
                                    {service.price}
                                    {service.id === '360-booth' && (
                                      <span className="text-xs text-yellow-400 block">5hr+ is discounted</span>
                                    )}
                                  </p>
                                </div>
                                <div className="ml-auto">
                                  <div className={`w-6 h-6 rounded-full border ${
                                    selectedServices.includes(service.id)
                                      ? service.isPremium 
                                        ? 'bg-yellow-400 border-yellow-400' 
                                        : 'bg-white border-white'
                                      : 'border-gray-500'
                                  } flex items-center justify-center`}>
                                    {selectedServices.includes(service.id) && (
                                      <CheckCircle size={16} className={service.isPremium ? 'text-black' : 'text-black'} />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 2 && (
                      <div className="animate-fade-in">
                        <h3 className="text-2xl font-light mb-6">Select Date & Time</h3>
                        <p className="text-gray-400 mb-8">Choose your preferred date and time for the session.</p>
                        
                        <DaySelector 
                          onSelectDay={handleDateChange}
                          selectedDate={standardizedDate}
                        />
                        
                        {dateError && (
                          <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4">
                            <p className="text-white text-sm">{dateError}</p>
                          </div>
                        )}
                        
                        {standardizedDate && (
                          <div className="mt-8">
                            <TimeSlotGrid 
                              timeSlots={availableTimeSlots}
                              selectedTime={standardizedTime}
                              onSelectTime={handleTimeSlotSelect}
                              isLoading={isLoadingTimeSlots}
                             />
                            
                            {timeError && (
                              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mt-4">
                                <p className="text-white text-sm">{timeError}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {standardizedDate && standardizedTime && (
                          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mt-8">
                            <h4 className="text-lg font-medium mb-2">Your Selection</h4>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div className="flex items-center mb-2 md:mb-0">
                                <Calendar size={18} className="text-white mr-2" />
                                <span className="text-gray-300">
                                  Date: <span className="text-white font-medium">{formatDateForDisplay(standardizedDate)}</span>
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock size={18} className="text-white mr-2" />
                                <span className="text-gray-300">
                                  Time: <span className="text-white font-medium">{formatTimeForDisplay(standardizedTime)}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {currentStep === 3 && (
                      <div className="animate-fade-in">
                        <h3 className="text-2xl font-light mb-6">Specify Location</h3>
                        <p className="text-gray-400 mb-8">Let us know where you'd like the session to take place.</p>
                        
                        <div className="mb-6">
                          <label className="block text-white mb-2 flex items-center">
                            <MapPin size={18} className="mr-2" /> Location Details
                          </label>
                          <textarea
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Provide address or location details (e.g., your office, our studio, outdoor location)"
                            rows={4}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            required
                          />
                        </div>
                        
                        {/* Video Ideas Section - Only show if videography is selected */}
                        {isVideographySelected() && (
                          <div className="mb-6">
                            <label className="block text-white mb-2 flex items-center">
                              <FileText size={18} className="mr-2" /> Video Content Ideas
                            </label>
                            <textarea
                              value={videoIdeas}
                              onChange={(e) => setVideoIdeas(e.target.value)}
                              placeholder="Describe your video ideas, concepts, or specific shots you'd like us to capture"
                              rows={4}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                            />
                            <p className="text-gray-400 text-xs mt-1">
                              Sharing your ideas helps us prepare better for your shoot and ensures we capture exactly what you need.
                            </p>
                          </div>
                        )}

                        {/* Duration Selection for 360 Booth */}
                        {is360BoothSelected() && (
                          <div className="mb-6">
                            <label className="block text-white mb-2 flex items-center">
                              <Clock3 size={18} className="mr-2" /> Duration of Booth Rental
                            </label>
                            <select
                              value={boothDuration}
                              onChange={(e) => setBoothDuration(e.target.value)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-white transition-colors"
                            >
                              <option value="" className="bg-gray-900">Select Duration</option>
                              <option value="1 hour" className="bg-gray-900">1 hour</option>
                              <option value="2 hours" className="bg-gray-900">2 hours</option>
                              <option value="3 hours" className="bg-gray-900">3 hours</option>
                              <option value="4 hours" className="bg-gray-900">4 hours</option>
                              <option value="5 hours" className="bg-gray-900">5 hours (Discounted)</option>
                              <option value="6 hours" className="bg-gray-900">6 hours (Discounted)</option>
                              <option value="Full day (8 hours)" className="bg-gray-900">Full day - 8 hours (Discounted)</option>
                              <option value="Multiple days" className="bg-gray-900">Multiple days</option>
                            </select>
                            <p className="text-gray-400 text-xs mt-1">
                              This helps us allocate the right amount of time for your event. Bookings of 5+ hours receive special discounted rates.
                            </p>
                          </div>
                        )}
                        
                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-6">
                          <h4 className="text-lg font-medium mb-2">Location Options:</h4>
                          <ul className="space-y-2 text-gray-300">
                            <li className="flex items-start">
                              <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                              <span><strong>Touch Media Studio:</strong> Our professional studio equipped with lighting and backdrops.</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                              <span><strong>Your Location:</strong> We can come to your office, event venue, or preferred location.</span>
                            </li>
                            <li className="flex items-start">
                              <span className="w-2 h-2 bg-white rounded-full mt-2 mr-2"></span>
                              <span><strong>Outdoor Location:</strong> Specify any outdoor locations you have in mind.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {currentStep === 4 && (
                      <div className="animate-fade-in">
                        <h3 className="text-2xl font-light mb-6">Your Details</h3>
                        <p className="text-gray-400 mb-8">Provide your contact information so we can confirm your booking.</p>
                        
                        {submitError && (
                          <div className="bg-red-900/30 border border-red-800 text-white p-4 mb-6 rounded-md">
                            {submitError}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-white mb-2 flex items-center">
                              <User size={18} className="mr-2" /> First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Your first name"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-2 flex items-center">
                              <User size={18} className="mr-2" /> Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Your last name"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-white mb-2 flex items-center">
                              <Mail size={18} className="mr-2" /> Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Your email address"
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-2 flex items-center">
                              <Phone size={18} className="mr-2" /> Phone
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="08xxxxxxxx or 08x xxx xxxx"
                                className={`w-full bg-gray-800/50 border ${phoneError ? 'border-red-500' : 'border-gray-700'} rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors`}
                                required
                              />
                              {phoneError && (
                                <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                              )}
                              <p className="text-gray-400 text-xs mt-1">Format: 08xxxxxxxx or 08x xxx xxxx (Irish mobile number)</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Production Duration Dropdown */}
                        {(selectedServices.includes('videography') || selectedServices.includes('photography')) && (
                          <div className="mb-6">
                            <label className="block text-white mb-2 flex items-center">
                              <Clock3 size={18} className="mr-2" /> Duration of Production
                            </label>
                            <select
                              value={productionDuration}
                              onChange={(e) => setProductionDuration(e.target.value)}
                              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-white transition-colors"
                            >
                              <option value="" className="bg-gray-900">Select Duration</option>
                              <option value="1 hour" className="bg-gray-900">1 hour</option>
                              <option value="2 hours" className="bg-gray-900">2 hours</option>
                              <option value="3 hours" className="bg-gray-900">3 hours</option>
                              <option value="4 hours" className="bg-gray-900">4 hours</option>
                              <option value="5 hours" className="bg-gray-900">5 hours</option>
                              <option value="6 hours" className="bg-gray-900">6 hours</option>
                              <option value="Full day (8 hours)" className="bg-gray-900">Full day (8 hours)</option>
                              <option value="Multiple days" className="bg-gray-900">Multiple days</option>
                            </select>
                            <p className="text-gray-400 text-xs mt-1">
                              This helps us allocate the right amount of time for your project. Longer durations may require additional fees.
                            </p>
                          </div>
                        )}
                        
                        <div className="mb-8">
                          <label className="block text-white mb-2">Additional Information (Optional)</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Any specific requirements or questions?"
                            rows={4}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                          />
                        </div>
                        
                        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 mb-8">
                          <h4 className="text-lg font-medium mb-4">Booking Summary</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Services:</span>
                              <span className="text-white">
                                {selectedServices.map(id => 
                                  services.find(s => s.id === id)?.name
                                ).join(', ')}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Date:</span>
                              <span className="text-white">
                                {standardizedDate ? formatDateForDisplay(standardizedDate) : ''}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Time:</span>
                              <span className="text-white">{formatTimeForDisplay(standardizedTime)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Location:</span>
                              <span className="text-white">{location}</span>
                            </div>
                            {productionDuration && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Duration:</span>
                                <span className="text-white">{productionDuration}</span>
                              </div>
                            )}
                            {is360BoothSelected() && boothDuration && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Booth Duration:</span>
                                <span className="text-white">{boothDuration}</span>
                              </div>
                            )}
                            {isVideographySelected() && videoIdeas && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Video Ideas:</span>
                                <span className="text-white max-w-xs text-right">{videoIdeas.length > 50 ? `${videoIdeas.substring(0, 50)}...` : videoIdeas}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center px-6 py-3 bg-transparent border border-white text-white hover:bg-white/10 transition-colors duration-300 rounded-md"
                        >
                          <ArrowLeft size={18} className="mr-2" /> Back
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={isNextDisabled()}
                          className={`flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-md ${
                            isNextDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          Next <ArrowRight size={18} className="ml-2" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitDisabled()}
                          className={`flex items-center px-6 py-3 bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-md ${
                            isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Processing...' : 'Complete Booking'}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="py-8 bg-black border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">© {new Date().getFullYear()} Touch Media Ltd. All rights reserved.</p>
        </div>
      </footer>
      
      {showConfirmation && (
        <BookingConfirmation 
          onClose={handleCloseConfirmation} 
          status={bookingStatus} 
        />
      )}
    </div>
  );
};

export default Booking;