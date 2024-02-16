import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

interface DataType {

service: string;

}

const columns: Column<DataType>[] = [
  
  {
    Header: "Services",
    accessor: "service",

  }
  
 
];
interface UserRoleProps {
  userRole: string;
}




const Services = ({ userRole }: UserRoleProps) => {
//  const [data] = useState<DataType[]>(arr);
const [data, setData] = useState<DataType[]>([]);

useEffect(() => {
  // Fetch data from API when component mounts
  const fetchData = async () => {
    try {
      const response = await axios.post('https://vo6x6vec69.execute-api.us-east-1.amazonaws.com/prod/services');
    //   console.log(response)
      const respData =JSON.parse(response.data.body)
      console.log(respData);
      setData(respData);
      // respData.forEach(item => console.log(item));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
  // Clean-up function to cancel any pending requests if component unmounts
  return () => {
    
    // Cancel any pending requests or clean-up operations
  };
}, []); // 


  const Table = useCallback(
    TableHOC<DataType>(
      columns,
      data,
      "dashboard-product-box",
      "Services",
      true
    ),
    [data]
  );

  return (
    <div className="admin-container">
     <br/>      <AdminSidebar userRole={userRole}/>

      <main>{Table()}</main>
      <Link to="/admin/user/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Services;
