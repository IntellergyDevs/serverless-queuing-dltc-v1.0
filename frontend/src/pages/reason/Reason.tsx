import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
import './Reason.css';
import { sendRequest } from '../../service/Requests';

interface ReasonProps {
}

const Reason: React.FC<ReasonProps> = () => {
    const navigate = useNavigate();
    
    const options: string[] = [
        'Professional_Driving_Permit',
        'Driver_Renewal_License',
        'Motor_Vehicle_License',
        'Operating_License'
    ];
    const [selectedOption, setSelectedOption] = useState<string>('');


    const storeInLocalDatabase = (data: any): void => {
        localStorage.setItem('requestDetails', JSON.stringify(data));
    };

    // const sendRequest = async (payload: any): Promise<void> => {
         
    //     try {
    //         Swal.fire({
    //             title: 'Processing...',
    //             text: 'Please wait.',
    //             icon: 'info',
    //             allowOutsideClick: false,
    //             didOpen: () => {
    //                 Swal.showLoading();
    //             }
    //         });
    //         const response = await fetch('https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/ticket', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',                    
    //             },
    //             body: JSON.stringify(payload),
    //         });
    
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! Status: ${response.status}`);
    //         }
    
    //         const data = await response.json();
    
    //         if (data.success === true) {
    //             storeInLocalDatabase(data); // Storing data in local database
    //             Swal.fire({
    //                 title: 'Success!',
    //                 text: 'Your request has been processed.',
    //                 icon: 'success',
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             });
    //             navigate('/ticket/ticket');
    //         }
    //         console.log('Response:', data);
    //     } catch (error) {
    //         Swal.close();
    //         Swal.fire({
    //             title: 'Error!',
    //             text: 'Something went wrong: ' + error,
    //             icon: 'error',
    //             confirmButtonText: 'OK'
    //         });
    //         console.error('Error making API request:', error);
    //     }
    // };

    const handleSelect = (option: string): void => {
 
        setSelectedOption(option);
        sendRequest(
            'https://bbkzcze7c3.execute-api.us-east-1.amazonaws.com/Dev/ticket',
            'POST',
            {
              option: option,
              state: 'in Queue',
            },
            'Your request is being processed.',
            'success'
          )
            .then(data => {
              storeInLocalDatabase(data); // Storing data in local database
              navigate('/ticket/ticket');
            })
            .catch(error => {
              console.error('Error making API request:', error);
            }); 
          };
    
    return (
        <div className='container-grid'>
            <div className="header">
                <img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" loading='lazy' />
                <h1>Smart Licencing</h1>
            </div>
            {/* <Link to="/ticket/faq" className="create-product-btn">
                FAQ
            </Link> */}
            <p>Choose from the below options:</p>
            <div className="grid-container">
                {options.map((option: string, index: number) => (
                    <div
                        key={index}
                        className={`grid-item ${selectedOption === option ? 'selected' : ''}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Reason;