import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsSearch } from "react-icons/bs";
import userImg from "../../assets/userpic.png";
import { useNavigate } from "react-router-dom";
import useSessionStorage from '../../service/AuthService';
import AdminSidebar from '../../components/AdminSidebar';

interface Ticket {
    state: string;
    ticketNumber: number;
    datetime: string;
    user: string;
    ticket_number: number;
    option:any;
    served_by:string;
}
interface UserRoleProps {
    userRole: string;
  }
function Agent({ userRole }: UserRoleProps) {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [, setServedCount] = useState<number>(0);
    const [doneCount, setDoneCount] = useState<number>(0);
    const [qCount, setQCount] = useState<number>(0);
    const { resetUserSession } = useSessionStorage();
    const [name, setName] = useState<string>('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    const handleLogout = (): void => {
        resetUserSession();
        showLoading();
        navigate('/admin/login');
    }

    useEffect(() => {
        // Fetch user data
        var session:any = sessionStorage.getItem('user');
        const sessionData = JSON.parse(session);
        const userOptions = sessionData.option;
        console.log(userOptions)
        const fetchData = async (): Promise<void> => {
            let userOptionSelected;
            try {
                
                if (typeof userOptions === 'string') {
                    userOptionSelected = userOptions
                    // console.log(userOptions);
                } else if (Array.isArray(userOptions)) {
                    userOptions.forEach(option => {
                        if (option === true) {
                            userOptionSelected = userOptions
                        }
                    });
                } else if (typeof userOptions === 'object') {
                    for (const key in userOptions) {
                        if (userOptions.hasOwnProperty(key) && userOptions[key] === true) {
                            userOptionSelected = key                            
                        }
                    }
                }
                // Fetch tickets
                const ticketResponse = await axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets');
                let data: Ticket[] = ticketResponse.data;
                data = data.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
                let processedTickets;
                switch (userOptionSelected) {
                    case "Professional_Driving_Permit":
                        processedTickets = data.filter(ticket=> ticket?.option ==='Professional_Driving_Permit' );
                        setTickets(processedTickets)
                        break;
                    case "Motor_Vehicle_License":
                        processedTickets = data.filter(ticket=> ticket?.option ==='Motor_Vehicle_License' );
                        setTickets(processedTickets) 
                        break;
                    case "Driver_Renewal_License":
                        processedTickets = data.filter(ticket=> ticket?.option ==='Driver_Renewal_License' );
                        setTickets(processedTickets) 
                        break;
                    case "Operating_License":
                        processedTickets = data.filter(ticket=> ticket?.option ==='Operating_License' );
                        setTickets(processedTickets) 
                        break;
                
                    default:
                        break;
                }      
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        setName(sessionData.name)
        updateCounters();
        const intervalId = setInterval(() => {
            fetchData();

        }, 1000); // Fetch every 10 seconds
        

    
        return () => clearInterval(intervalId); // Cleanup interval
        
    }, []);
    
    

    const updateCounters = (): void => {
        setServedCount(tickets.filter(ticket => ticket.state === 'Serving').length);
        setQCount(tickets.filter(ticket => ticket.state === 'in Queue').length);
        setDoneCount(tickets.filter(ticket => ticket.state === 'Done').length);
        
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchQuery(event.target.value);
    };
    const showLoading = function (): void {
        Swal.fire({
            title: 'Now loading',
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 2000,
            didOpen: () => {
                Swal.showLoading();
            }
        }).then((result:any) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('closed by timer!!!!');
                Swal.fire({
                    title: 'Finished!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleTicketSelect = (ticket: Ticket): void => {
        console.log(ticket)
        Swal.fire({
            title: `Ticket NO ${ticket.ticket_number}`,
            html: `<strong>Status:</strong> ${ticket.state}<br/><strong>Description:the Ticket was served for </strong> ${ticket.option}<br/>Ticket Served by : ${ticket.served_by}`,
            icon: 'info',
            confirmButtonText: 'Close'
        });
    };

  
    const handleAction = async (ticketNumber: number, action: string): Promise<void> => {
        console.log(ticketNumber)
        var session : any = sessionStorage.getItem('user');
        const sessionData = JSON.parse(session);
        console.log(sessionData)
        const myEmail = sessionData.email
        const station = sessionData.station
        console.log(station)
        let updatedTickets = [...tickets];

        if (action === 'Serving') {
            const currentlyServingTicket = updatedTickets.find(ticket => ticket.state === 'Serving');

            if (currentlyServingTicket) {
                updatedTickets = updatedTickets.map(ticket =>
                    ticket.state === 'Serving' ? { ...ticket, state: 'Done' } : ticket
                );
                 await updateTicketState('Done', currentlyServingTicket.ticket_number, myEmail, station);
            }

            updatedTickets = updatedTickets.map(ticket =>
                ticket.ticket_number === ticketNumber ? { ...ticket, state: 'Serving' } : ticket
            );

           
        } else {
            updatedTickets = updatedTickets.map(ticket => {
                if (ticket.ticket_number === ticketNumber) {
                    return { ...ticket, state: action };
                }
                return ticket;
            });
        }

        setTickets(updatedTickets);
        updateCounters();
        await updateTicketState(action, ticketNumber, myEmail, station );
    };

    const updateTicketState = async (newState: string, ticketNumber: number, userEmail:string, stationNumber:string): Promise<void> => {
        // console.log('Updating ticket state:', newState, 'Ticket number:', ticketNumber);
        console.log(userEmail)

        try {
            const response = await axios.put(`https://u9qok0btf1.execute-api.us-east-1.amazonaws.com/Dev/ticket`, {
                ticket_number: ticketNumber,
                state: newState,
                served_by: userEmail,
                station:stationNumber

            });
            console.log(userEmail)
            console.log('Update response:', response);
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };

    const handleReview = (ticketNumber: number): void => {
        Swal.fire({
            title: `Ticket No ${ticketNumber}`,
            text: `Review for Ticket NO ${ticketNumber}`,
            icon: 'info',
            confirmButtonText: 'Done'
        });
    };

    const filteredTickets = tickets.filter(ticket => ticket.ticket_number && ticket.ticket_number.toString().includes(searchQuery));

    return (
        <>
            
            <div className='admin-container'>
            <AdminSidebar userRole={userRole}/>
                <main className="dashboard">
                    <div className="bar">
                        <div className='search-bar'>
                            <BsSearch  />
                            <input type="text" placeholder="Search for Ticket " value={searchQuery} onChange={handleSearchChange} />
                            {searchQuery && (
                            <div className="list-group">
                                {filteredTickets.map(ticket => (
                                    <button
                                        key={ticket.ticket_number}
                                        className="list-group-item list-group-item-action"
                                        onClick={() => handleTicketSelect(ticket)}
                                    >
                                        Ticket No {ticket.ticket_number}
                                    </button>
                                ))}
                            </div>
                        )}
                        </div>
                        
                        <div className='ticketCounters'>
                            <p className='ticketCounters-para'>Done: <span className='done'>{doneCount}</span></p>
                            <p className='ticketCounters-para'>Queue: <span className='que'>{qCount}</span> </p>
                        </div>
                        <div className='profile'>
                            <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
                                <img src={userImg} alt="User" />
                                <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                                <a href="#home">About</a>
                                <a href="#home">Settings</a>
                                <a  onClick={handleLogout}>Sign Out</a>

                                
                                </div>
                            </div>
                            <p>{name}</p>
                        </div>
                    </div>
                    <br />
                    <div className="task-statuses">
                        <span>in Queue</span>
                        <span>Serving</span>
                        <span>Done</span>
                        <span>Cancel</span>
                    </div>
                    <div className='container-agent mt-4'>
                        {['in Queue', 'Serving', 'Done', 'Cancel'].map((section) => (
                            <div key={section} className="section mb-3 lane" style={{ maxHeight: '580px', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', position: 'relative' }}>

                                <h2 style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0 }}>{section}</h2> {/* Hide the section text */}
                                <div className="d-flex flex-wrap">
                                    {tickets.filter(ticket => ticket.state === section).map(ticket => (
                                        <div className='card m-2' style={{ width: '18rem' }} key={ticket.ticket_number}>
                                            <div className='card-body'>
                                                <h5 className='card-title'>Ticket NO {ticket.ticket_number}</h5>
                                                <div className="d-flex justify-content-between">
                                                    {section === 'Cancel' ? (
                                                        <button className='btn btn-primary' onClick={() => handleAction(ticket.ticket_number, 'in Queue')}>Reinstate</button>
                                                    ) : (
                                                        <button className='btn btn-danger' onClick={() => handleAction(ticket.ticket_number, 'Cancel')}>Cancel</button>
                                                    )}
                                                    {ticket.state === 'in Queue' && (
                                                        <button className='btn btn-success' onClick={() => handleAction(ticket.ticket_number, 'Serving')}>Serve</button>
                                                    )}
                                                    {section === 'Done' && (
                                                        <button className='btn btn-info' onClick={() => handleReview(ticket.ticket_number)}>Review</button>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Agent;