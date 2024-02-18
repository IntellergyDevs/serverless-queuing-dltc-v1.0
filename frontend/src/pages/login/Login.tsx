import React, { useState } from 'react';
import  useSessionStorage  from '../../service/AuthService';
import axios from 'axios';
import './Login.css'; 
import {useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import GautengDept from '../../assets/images/Gauteng Department.png';


function Login() {
  const navigate = useNavigate();
  const { setUserSession } = useSessionStorage();
  const [password, setPassword]= useState<string>('');
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
  const submitHandler =(e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    let loginUrl ="https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/login"; //"https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/resetPassword"; //"https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/login";//;
    const requestConfig = {
      headers: {
      'x-api-key': 'gNzOqOhI5771BmV6rw2962Usc4rpTtnPvxlWzVf4'
      }
    }
    const requestBody ={
      email:email,
      password:password,  
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
     //   Swal.fire('Error', 'Server error.', 'error');
      }
      console.log(error);
    });
  }

  const handleForgotPassword = () => {
    // Implement your logic here for handling the forgot password action
    // For example, you might show a modal or navigate to a forgot password page
    navigate('/admin/restpassword');
    console.log("Forgot Password clicked");
    // You can replace the console.log with your actual implementation
  };
  
  return (

<div className="registration-form">
  <form onSubmit={submitHandler}>
    <div className="welcome-area">
      <h2>Please Login to Continue!</h2>
      <img src={GautengDept} alt="Gauteng Department" className='welcome-image' />
    </div>
    <div className="form-group">
      <input type="text" className="form-control item"  value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="Email" required/>
    </div>
    <div className="form-group">
      <input type="password" className="form-control item" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
    </div>
    <div className="form-group">
      <input type="checkbox" className="form-control item" id="tandc"  placeholder="Termd and Conditions" required/>
      <a href='#'>  Terms and Conditions</a>
    </div>
    <div className="form-group">
      <input type="submit" className="btn btn-block create-account" value="Login" />
    </div>
    <div className="form-group"><br/>
      <button className="btn forgot-password" onClick={handleForgotPassword}>Forgot Password?</button>
    </div>
    </form>
    

</div>

  );
}

export default Login;