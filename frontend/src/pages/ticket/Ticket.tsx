import React, { useEffect, useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import './Ticket.css';

const Ticket: React.FC = () => {
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [numberInQueue, setNumberInQueue] = useState<number>(0);
  const [estimatedServiceTime, setEstimatedServiceTime] = useState<string>('');
  const [staticEstimatedTime, setStaticEstimatedTime] = useState<string>('');

  const [serviceTime, setServiceTime] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [ticketId, setTicketId] = useState<string>('');

  const calculateNumberInQueue = useCallback(async (dateTime: string, option: string) => {
    try {
      const response = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
      const tickets: any[] = response.data;
      const numberBefore: number = countTicketsBefore(tickets, dateTime, option);
      const foundTicketId: string | null = findTicketId(tickets, dateTime, option);
      setNumberInQueue(numberBefore);
      setTicketId(foundTicketId);
      calculateEstimatedServiceTime(numberBefore);
    } catch (error) {
      Swal.fire("Error", "Error fetching tickets: " + error.message, "error");
    }
  }, []);

  useEffect(() => {
    const updateQueue = async () => {
      const storedTicketData = localStorage.getItem('requestDetails');
      if (storedTicketData) {
        const ticketDetails = JSON.parse(storedTicketData);
        let resdata = ticketDetails.data;
        await calculateNumberInQueue(resdata.datetime, resdata.option);
        setTicketNumber(resdata.ticket_number);
        setReason(resdata.option);
      }
    };
    updateQueue();

    const intervalId = setInterval(updateQueue, 10000); // Update queue every 10 seconds
    return () => clearInterval(intervalId);
  }, [calculateNumberInQueue]);

  const startServiceTimer = useCallback(() => {
    setTimer(setInterval(() => {
      setServiceTime(time => time + 1);
    }, 1000));
  }, []);

  const stopServiceTimer = useCallback(() => {
    clearInterval(timer!);
    setTimer(null);
    Swal.fire({
      title: 'Rate Our Service',
      text: 'Please rate the service you received.',
      icon: 'question',
      input: 'range',
      inputAttributes: {
        min: 1,
        max: 5,
        step: 1
      },
      inputLabel: 'Rating',
      confirmButtonText: 'Submit'
    }).then(result => {
      if (result.value) {
        updateTicketWithTimeAndRating(serviceTime, result.value);
        setServiceTime(0);
      }
    });
  }, [timer, serviceTime]);

  useEffect(() => {
    if (numberInQueue === 1 && !timer) {
      startServiceTimer();
      Swal.fire({
        title: 'Rate Our Service',
        text: 'Please rate the service you received.',
        icon: 'question',
        input: 'range',
        inputAttributes: {
          min: 1,
          max: 5,
          step: 1
        },
        inputLabel: 'Rating',
        confirmButtonText: 'Submit'
      }).then(result => {
        if (result.value) {
          updateTicketWithTimeAndRating(serviceTime, result.value);
          setServiceTime(0);
        }
      });
    } else if (numberInQueue < 1 && timer) {
      stopServiceTimer();
    }
  }, [numberInQueue, timer, startServiceTimer, stopServiceTimer]);

  const updateTicketWithTimeAndRating = async (time: number, rating: number) => {
    try {
      await axios.put(`https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket`, {
        serviceTime: time,
        serviceRating: rating
      });
    } catch (error) {
      Swal.fire("Error", "Error updating ticket: " + error.message, "error");
    }
  };

  const findTicketId = (tickets: any[], dateTime: string, option: string): string | null => {
    try {
      const ticket = tickets.find(ticket =>
        new Date(ticket.datetime).toISOString() === dateTime &&
        ticket.option === option
      );
      return ticket ? ticket.ticket_number : null;
    } catch (error) {
      console.error("Error finding ticket:", error);
      return null;
    }
  };

  const countTicketsBefore = (tickets: any[], currentTicketDateTime: string, option: string): number => {
    try {
      const count = tickets.filter(ticket =>
        new Date(ticket.datetime) < new Date(currentTicketDateTime) &&
        ticket.option === option &&
        ticket.state === 'in Queue'
      ).length;

      return count + 1;
    } catch (error) {
      console.error("Error counting tickets:", error);
      return 0;
    }
  };

  const calculateEstimatedServiceTime = (numberBefore: number) => {
    if (staticEstimatedTime === '') {
      const averageWaitTimePerPerson = 15;
      const totalWaitTime = numberBefore * averageWaitTimePerPerson;
      const currentTime = new Date();
      currentTime.setMinutes(currentTime.getMinutes() + totalWaitTime);
      const newEstimatedTime = currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour24: true });
      setEstimatedServiceTime(newEstimatedTime);
      setStaticEstimatedTime(newEstimatedTime);
    }
  };

  const queueMessage = () => {
    if (numberInQueue === 1) {
      console.log(numberInQueue)
      return "Move closer, you're first in line";
    } else if (numberInQueue === 2) {
      console.log(numberInQueue)

      return "Move closer, you're second in line!";
    } else if (numberInQueue === 0) {
      console.log(numberInQueue)
      return "---";
    } else {
      return <span className='ticket-number-color-fontSize'>{numberInQueue}</span>;
    }
  };

  return (
    <div className="ticket-container">
      <div className="header">
        <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" />
        <h1 className="welcome-text">Welcome to SMART LICENSING</h1>

      </div>
      <div className="ticket-info">
        <div className="ticket-number-container">
          <p className="ticket-number">Ticket NO: <span className='ticket-number-color'>{ticketNumber}</span></p>
          <p>Number in Queue: <span className='ticket-number-color-fontSize'>{queueMessage()}</span></p>
          <p>Estimated Service Time: <span className='ticket-number-color-fontSize'>{staticEstimatedTime}</span></p>
          <p>Reason for visit: <span className='ticket-number-color-bold'>{reason}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;