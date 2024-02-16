import React, { useState } from 'react';
import  useSessionStorage  from '../../service/AuthService';
import axios from 'axios';
import './Restpassword.css';
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import GautengDept from '../../assets/images/Gauteng Department.png';


function Login() {
  const navigate = useNavigate();
  const { setUserSession } = useSessionStorage();

  const []= useState<string>('');
  const [email, setEmail]= useState<string>('');
  const showLoading = function() {
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
  const ForgotHandler =(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    let loginUrl = "https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/resetpassword"; //"https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/login";//;
    const requestConfig = {
      headers: {
      'x-api-key': 'gNzOqOhI5771BmV6rw2962Usc4rpTtnPvxlWzVf4'
      }
    }
    const requestBody ={
      email:email
      
    }
    showLoading()
    axios.post(loginUrl, requestBody, requestConfig)
    .then(response => {
      Swal.close();
      if (response.status === 200) {
        const userRole = response.data.user.user;
        if (userRole === 'admin' || userRole === 'sAdmin' || userRole === 'examiner' ) {
          setUserSession(response.data.user, response.data.token);
          navigate('/admin/dashboard')

          // showOptions();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'User does not have the right permissions.',
            icon: 'error',
          });
        }
      }

      console.log(response);
    })
    .catch(error => {
      // Hide SweetAlert Loader
      Swal.close();

      if (error.response && error.response.status) {
        console.log(error.response.data)
        Swal.fire('Error', error.response.data.message, 'error');
      } else {
        Swal.fire('Error', 'Server error.', 'error');
      }
      console.log(error);
    });
  }


  return (

<div className="registration-form">
  <form onSubmit={ForgotHandler}>
    <div className="welcome-area">
      <h2>Rest Password</h2>
      <img src={GautengDept} alt="Gauteng Department" className='welcome-image' />
    </div>
    <div className="form-group">
      <input type="text" className="form-control item"  value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" required/>
    </div>

    <div className="form-group">
      <input type="submit" className="btn btn-block create-account" value="Rest Password" />
    </div>
    <div className="form-group"><br/>
  
    </div>
  </form>
</div>

  );
}

export default Login;