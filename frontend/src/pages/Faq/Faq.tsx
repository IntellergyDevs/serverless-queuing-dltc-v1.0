import React, { useState } from 'react';
// import './FAQ.css'; 

type FAQProps = {};

type FAQItemProps = {
  question: string;
  answer: string;
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span className="faq-icon">Q.</span>
        <span className="faq-text">{question}</span>
      </div>
      {isOpen && (
        <div className="faq-answer">
          <span className="faq-icon">A.</span>
          <span className="faq-text">{answer}</span>
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC<FAQProps> = () => {
  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions (FAQs)</h1>
    <div className="faq-container">
       <FAQItem 
        question="Can I book a ticket in advance or do I need to get one on-site?" 
        answer="Currently, our ticketing system operates on a first-come, first-served basis on-site. We are exploring options for advance bookings and will update our customers when this feature becomes available." 
      />
      <FAQItem 
        question="How do I know when my number is coming up?" 
        answer="Your queue number will be displayed on the digital screens in the waiting area. Additionally, you may receive a notification via our mobile app if you have registered your number." 
      />
      <FAQItem 
        question="How do I get a queue number for my visit to the DLTC?" 
        answer="Upon arrival, please use our ticketing system to obtain a queue number by selecting the service you require. A ticket with your queue number will be generated for you." 
      />
      <FAQItem 
        question="How long is the ticket valid once it's issued?" 
        answer="Your ticket remains valid for the day it is issued. Please ensure to monitor the queue progress either on the display screens or through our mobile app." 
      />
      <FAQItem 
        question="What should I do if I accidentally select the wrong service on the ticketing kiosk?" 
        answer="If you've selected the wrong service, you can cancel the ticket at the kiosk and select the correct service, or ask a staff member for assistance." 
      />
     
     <FAQItem 
        question="What if I lose my ticket or my queue number?"
        answer="If you lose your ticket, please approach the information desk immediately. We can assist you in retrieving your queue number or reissuing a new ticket if necessary."
      />
      <FAQItem 
        question="What does Estimated service time mean?"
        answer="It's the time it takes from you scanning the QR code to reaching the serving desk."
      />
      <FAQItem 
        question="Are there any facilities or services while I wait for my turn?"
        answer="Yes, we have seating areas and refreshments available. We also provide informational material about driving safety and regulations while you wait."
      />
    </div>
    </div>
  );
};

export default FAQ;