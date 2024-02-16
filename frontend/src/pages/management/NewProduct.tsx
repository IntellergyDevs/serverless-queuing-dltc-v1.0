import { useState, FormEvent } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';




type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Professional Driving Permit", value: "Professional_Driving_Permit" },
  { label: "Driver Renewal License", value: "Driver_Renewal_License" },
  { label: "Motor Vehicle License", value: "Motor_Vehicle_License" },
  { label: "Operating License", value: "Operating_License" },
];
interface Reason {
  Professional_Driving_Permit: boolean;
  Driver_Renewal_License: boolean;
  Motor_Vehicle_License: boolean;
  Operating_License: boolean;
  [key: string]: boolean;
}
interface UserRoleProps {
  userRole: string;
}


const NewUser = ({ userRole }: UserRoleProps) => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("1");
  const [selectedRole, setSelectedRole] = useState<string>("examiner");
  // const [password, setPassword] = useState<string>('');
  const [reason, setReason] = useState<Reason>({
    Professional_Driving_Permit: false,
    Driver_Renewal_License: false,
    Motor_Vehicle_License: false,
    Operating_License: false,
    
  });


  const handleTagChange = (option: string) => {
    const updatedTags = [...selectedTags];
    const index = updatedTags.indexOf(option);
  
    if (index > -1) {
      updatedTags.splice(index, 1); // Remove the tag
    } else {
      updatedTags.push(option); // Add the tag
    }
  
    setSelectedTags(updatedTags);
  
    const updatedReason = {
      ...reason,
      [option]: !reason[option], // Toggle the value of the selected option
    };
    setReason(updatedReason);
  };
 

  const submitHandler = async(e: FormEvent) => {
    e.preventDefault();
    let registerUrl = "https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/register";
    const requestConfig: AxiosRequestConfig = {
      headers: {
        'x-api-key': 'gNzOqOhI5771BmV6rw2962Usc4rpTtnPvxlWzVf4'
      }
    }
    const requestBody = {
      name: name,
      username: username,
      email: email,
      password: "password",
      option: reason,
      station: selectedValue,
      userRole: selectedRole
    }
    
   
  
    await axios.post(registerUrl, requestBody, requestConfig)
      .then(response => {
        console.log(requestBody)
        // Check for a successful response status (e.g., 200)
        if (response.status === 200) {
          Swal.fire({
            title: 'Success',
            text: 'Registration successful!',
            icon: 'success',
          });
          console.log(response);
          navigate("/admin/user")
        } else {
          // Swal.fire({
          //   title: 'Error',
          //   text: 'Registration failed. Please try again later.',
          //   icon: 'error',
          // });
          // console.error('Registration failed:', response);
        }
      }
      )
      .catch(error => {
        Swal.fire({
          title: 'Error',
          text: 'Registration failed. Please try again later.',
          icon: 'error',
        });
        console.error('Registration failed:', error);
      });
  };
  

  return (
    <div className="admin-container">
     <AdminSidebar userRole={userRole}/>
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2 >New User</h2>
        
            <div>
              <label>Name & Surname</label>
              <input
                required
                type="text"
                placeholder="Name & Surname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Username</label>
              <input
                required
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Email Address</label>
              <input
                required
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>User Role</label>
              <select
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
              >
                <option value="examiner">examiner</option>
                <option value="finance">finance</option>
                <option value="admin">admin</option>
                <option value="sAdmin">sAdmin</option>
              </select>
            </div>
            <div>
              <label>Work station</label>
              <select
                value={selectedValue}
                onChange={(event) => setSelectedValue(event.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label>Service Option</label>
              
              
              {options.map((option: Option) => (
                <div key={option.value}>
                  <label>
                    {option.label}
                    <input
                      type="checkbox"
                      name={option.value}
                      checked={selectedTags.includes(option.value)}
                      onChange={() => handleTagChange(option.value)}
                    />
                  </label>
                </div>
              ))}
              <div>
                <h3>Selected Tags:</h3>
                {selectedTags.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      marginRight: "10px",
                      padding: "5px",
                      border: "1px solid black",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* <div>
              <label>Photo</label>
              <input required type="file" onChange={changeImageHandler} />
            </div> */}

            <button type="submit">Add user</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewUser;
