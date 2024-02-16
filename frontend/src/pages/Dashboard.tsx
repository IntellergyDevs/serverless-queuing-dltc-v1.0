
import AdminSidebar from "../components/AdminSidebar";
import { BsSearch } from "react-icons/bs";
import userImg from "../assets/userpic.png";
import axios from 'axios';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useSessionStorage from "../service/AuthService";



interface Ticket {
  state: string;
  ticketNumber: number;
  datetime: string;
  user: string;
  ticket_number: number;
}


const dashboard = () => {

  const [tickets] = useState<Ticket[]>([]);
  const [ticketCount, setTicketCount] = useState(0);

  const [ticketServingCount, setTicketServingCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [ticketDoneCount, setTicketDoneCount] = useState(0);


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { resetUserSession } = useSessionStorage();
  const navigate = useNavigate();


  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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



  const handleLogout = (): void => {
    resetUserSession();
    showLoading();
    
    navigate('/admin/login');
}


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };
  const handleTicketSelect = (ticket: Ticket): void => {
    Swal.fire({
      title: `Ticket NO ${ticket.ticketNumber}`,
      html: `<strong>Status:</strong> ${ticket.state}<br/><strong>Description:</strong> ${ticket.user}`,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  };
  const filteredTickets = tickets.filter(ticket => ticket.ticketNumber && ticket.ticketNumber.toString().includes(searchQuery));
  useEffect(() => {
    axios.post('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/list_tickets')
      .then((response:any) => {
          console.log(response.data)
          setTicketCount(response.data.length);
          setTicketServingCount(response.data.filter((ticket: {
            state: string; status: string;
          }) => ticket.state === "Cancel").length);

          setTicketDoneCount(response.data.filter((ticket: {
            state: string; status: string;
          }) => ticket.state === "Done").length);
        }
      ).catch((error:any) => {
        console.error('Error fetching data:', error);
      });
      var session:any = sessionStorage.getItem('user');
      const sessionData = JSON.parse(session);
      
      console.log(sessionData)
      setUserRole(sessionData.user)
  
      setName(sessionData.name)
      

  }, []);


  return (
    <div className="admin-container">
      <AdminSidebar userRole={userRole}/>
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for User " value={searchQuery} onChange={handleSearchChange} />
          {searchQuery && (
            <div className="list-group">
              {filteredTickets.map(ticket => (
                <button
                  key={ticket.ticket_number}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleTicketSelect(ticket)}
                >
                  Ticket NO {ticket.ticketNumber}
                </button>
              ))}
            </div>
          )}
          
<div className='profile'>
      <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
        <img src={userImg} alt="User" />
        <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
          <a >About</a>
          <a >Settings</a>
          <a  onClick={handleLogout}>Sign Out</a>          
        </div>
      </div>
      <p>{name}</p>
    </div>
        </div>
        <section className="widget-container">
          <WidgetItem
            percent={ticketCount / 100}
            amount={true}
            value={ticketCount}
            heading="Total Tickets"
            color="rgb(0,115,255)"
          />
          <WidgetItem
            percent={(Math.round((ticketServingCount / ticketCount) * 100))}
            value={ticketServingCount}
            heading="Tickets Cancelled"
            color="rgb(0 198 202)"

          />
          <WidgetItem
            percent={(Math.round((ticketDoneCount / ticketCount) * 100))}
            value={ticketDoneCount}
            heading="Tickets Completed"
            color="rgb(255 196 0)"
          />
          
        </section>


        <section className="transaction-container">
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}


const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `${value}` : value}</h4>
    </div>

    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
        ${color} ${(Math.abs(percent) / 100) * 360}deg,
        rgb(255, 255, 255) 0
      )`,
      }}
    >
      <span
        style={{
          color,
        }}
      >
        {percent}%
      </span>
    </div>
  </article>
);

export default dashboard;
