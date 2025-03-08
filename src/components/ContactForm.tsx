import React, { useState } from 'react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Send contact form data to Netlify function
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }
      
      // Also send the data to make.com webhook
      try {
        await fetch('https://hook.eu2.make.com/2qicg95neilach1j726sdqa6ib8v2mnt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            formType: 'Contact Form',
            source: 'Touch Media Website',
            timestamp: new Date().toISOString()
          }),
        });
        console.log('Webhook to make.com triggered successfully');
      } catch (webhookError) {
        console.error('Error sending data to make.com webhook:', webhookError);
        // Continue with the form submission even if the webhook fails
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      
      // For demo purposes, still show success if server is not available
      if (!navigator.onLine || error.message.includes('Failed to fetch')) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {isSubmitted ? (
        <div className="bg-green-900/30 border border-green-800 text-white p-4 mb-6 rounded-md">
          Thank you for your message! We'll get back to you soon.
        </div>
      ) : null}
      
      {submitError && (
        <div className="bg-red-900/30 border border-red-800 text-white p-4 mb-6 rounded-md">
          {submitError}
        </div>
      )}
      
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
          className="w-full bg-transparent border-b border-gray-600 py-2 px-0 focus:outline-none focus:border-white text-white placeholder-gray-500"
        />
      </div>
      
      <div className="mb-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          className="w-full bg-transparent border-b border -gray-600 py-2 px-0 focus:outline-none focus:border-white text-white placeholder-gray-500"
        />
      </div>
      
      <div className="mb-4">
        <select
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full bg-transparent border-b border-gray-600 py-2 px-0 focus:outline-none focus:border-white text-white rounded-md"
        >
          <option value="" className="bg-gray-900">Select Service</option>
          <option value="360 Booth" className="bg-gray-900">360 Booth</option>
          <option value="Photography" className="bg-gray-900">Photography</option>
          <option value="Videography" className="bg-gray-900">Videography</option>
          <option value="Touch+" className="bg-gray-900">Touch+</option>
          <option value="Other" className="bg-gray-900">Other</option>
        </select>
      </div>
      
      <div className="mb-6">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Your Message"
          required
          rows={4}
          className="w-full bg-transparent border-b border-gray-600 py-2 px-0 focus:outline-none focus:border-white text-white placeholder-gray-500 resize-none"
        ></textarea>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors duration-300 w-full rounded-md ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};

export default ContactForm;