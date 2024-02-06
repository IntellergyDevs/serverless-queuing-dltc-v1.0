import { useState, ChangeEvent } from "react";
import AdminSidebar from "../../components/AdminSidebar";


type Option = 'Professional Driving Permit' | 'Driver Renewal License' | 'Motor Vehicle License' | 'Operating License';

const options: Option[] = [
  'Professional Driving Permit',
  'Driver Renewal License',
  'Motor Vehicle License',
  'Operating License',
];


const NewProduct = () => {

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);

  const [selectedValue, setSelectedValue] = useState<string>('');
  const [reason, setReason] = useState<Reason>({
    Professional_Driving_Permit: false,
    Driver_Renewal_License: false,
    Motor_Vehicle_License: false,
    Operating_License: false,
    checkAll: false,
  });
  const handleTagChange = (option) => {
    if (selectedTags.includes(option)) {
      // Remove the tag
      setSelectedTags(selectedTags.filter(tag => tag !== option));
    } else {
      // Add the tag
      setSelectedTags([...selectedTags, option]);
    }
  };

  const handleCheckAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedTags(options);
    } else {
      setSelectedTags([]);
    }
  };
  const handleChange = (event:any, isCheckAll = false) => {
    const { name, checked } = event.target;
    
    if (isCheckAll) {
      const newState = {};
      Object.keys(reason).forEach(key => {
        newState[key] = checked;
      });
      setReason(newState);
    } else {
      setReason({ ...reason, [name]: checked, checkAll: false }); // Uncheck 'Check All' if any individual checkbox is changed
    }
  };
  
  
 

  // const [name, setName] = useState<string>("");
  // const [price, setPrice] = useState<number>();
  // const [stock, setStock] = useState<number>();
  const [photo, setPhoto] = useState<string>();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") setPhoto(reader.result);
      };
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form>
            <h2>New User</h2>
            <div>
              <label>Name &</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Username</label>
              <input
                required
                type="text"
                placeholder="username"
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
              <label>Work station</label>
              <select value={selectedValue} onChange={(event) => setSelectedValue(event.target.value)}>
                <option value="1"> 1</option>
                <option value="2"> 2</option>
                <option value="3"> 3</option>
              </select>
            </div>
            <div>
      <label>
        Check All
        <input
          type="checkbox"
          name="checkAll"
          checked={selectedTags.length === options.length}
          onChange={(e) => handleCheckAll(e.target.checked)}
        />
      </label>
      
      {options.map((option: Option) => (
        <div key={option}>
          <label>
            {option}
            <input
              type="checkbox"
              name={option}
              checked={selectedTags.includes(option)}
              onChange={() => handleTagChange(option)}
            />
          </label>
        </div>
      ))}

      <div>
        <h3>Selected Tags:</h3>
        {selectedTags.map((tag: Option) => (
          <span key={tag} style={{ marginRight: '10px', padding: '5px', border: '1px solid black' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>

          
             

            <div>
              <label>Photo</label>
              <input required type="file" onChange={changeImageHandler} />
            </div>

            {photo && <img src={photo} alt="New Image" />}

            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
