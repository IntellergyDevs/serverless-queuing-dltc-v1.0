import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './WaitingArea.css';

// Define the structure of a ticket object.
interface Ticket {
  ticket_number: string;
  station: string;
  state: 'Serving' | 'in Queue';
  id: string;
  option:string;
}

function WaitingArea() {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [upcomingTickets, setUpcomingTickets] = useState<Ticket[]>([]);

  const prevCurrentTicketRef = useRef<Ticket | null>(null);
  const prevUpcomingTicketsRef = useRef<Ticket[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const result = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
        console.log(result.data);
        const servingTask = result.data.find((task: Ticket) => task.state === 'Serving');
        const queueTasks = result.data.filter((task: Ticket) => task.state === 'in Queue');

        if (servingTask && (!prevCurrentTicketRef.current || prevCurrentTicketRef.current.id !== servingTask.id)) {
          speakText(`Now serving ${servingTask.ticket_number} at station ${servingTask.station}`);
          console.log(servingTask);
        }

        setCurrentTicket(servingTask);
        setUpcomingTickets(queueTasks);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    prevCurrentTicketRef.current = currentTicket;
    prevUpcomingTicketsRef.current = upcomingTickets;
  }, [currentTicket, upcomingTickets]);

  // Modified speakText function for Chrome
  const speakText = (text: string) => {
    const synth = window.speechSynthesis;
    let voiceFound = false;

    const attemptSpeak = () => {
      const voices = synth.getVoices();
      let selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female'));

      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }

      if (selectedVoice) {
        voiceFound = true;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = 1.0; // Adjust rate here; 1.0 is normal, lower is slower
        synth.speak(utterance);
      } else if (!voiceFound) {
        console.log("No suitable voice found. Trying again...");
        setTimeout(attemptSpeak, 250); // Retry after a short delay
      }
    };

    if (synth.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', attemptSpeak);
    } else {
      attemptSpeak();
    }
  };

  return (
    <div className="waiting-area">
      <div className='waiting-area-left'>
        {currentTicket && (
          <>
            <p className='ticket-numbering'>{currentTicket.ticket_number}</p>
            <p className='service-station'>is now being served at Station: <span className='text-color'>{currentTicket.station}</span></p>
          </>
        )}
      </div>
      <div className='waiting-area-right'>
        <h2>Upcoming Tickets</h2>
        {upcomingTickets.slice(0, 3).map((ticket, index) => (
          <div key={index} className='waiting-ticket-side'>
            <p>{ticket.ticket_number}</p>
            <small>{ticket.option}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WaitingArea;
