import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import axios from "axios";

interface DataType {
  email: string;
  name: string;
  option: string[]; // Change to array type
  password: any;
  station: string;
  userRole: string;
  username: string;
}

const columns: Column<DataType>[] = [
  {
    Header: "Name and Surname",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  // {
  //   Header: "Service Option",
  //   accessor: (row: DataType) => row.option.filter(opt => opt).join(', '), // Only display truthy options
  // },
  {
    Header: "Work station",
    accessor: "station",
  },
  {
    Header: "userRole",
    accessor: "userRole",
  },
];

interface UserRoleProps {
  userRole: string;
}

const Products = ({ userRole }: UserRoleProps) => {
  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    // Fetch data from API when component mounts
    const fetchData = async () => {
      try {
        const response = await axios.post(
          "https://hps0z6b4xb.execute-api.us-east-1.amazonaws.com/prod/users"
        );
        const respData = JSON.parse(response.data.body);
        console.log(respData);
        setData(respData.map((item: any) => ({
          ...item,
          // Filter and extract keys with value true
          option: Object.entries(item.option)
            .filter(([_, value]) => value === true)
            .map(([key, _]) => key),
        })));
        // setData(respData.map((item: any) => ({
        //   ...item,
        //   option: typeof item.option === 'string' ? item.option.split(',') : [], // Check if option is a string before splitting
        // })));
        // setData(respData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // Clean-up function to cancel any pending requests if component unmounts
    return () => {
      // Cancel any pending requests or clean-up operations
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  const modifiedColumns: Column<DataType>[] = [
    ...columns,
    {
      Header: "Service Option",
      accessor:(row: DataType) => row.option.join(', '), 
    },
  ];

  const Table = useCallback(
    TableHOC<DataType>(modifiedColumns, data, "dashboard-product-box", "Users", true),
    [data]
  );

  return (
    <div className="admin-container">
      <br />
      <AdminSidebar userRole={userRole} />
      <main>{Table()}</main>
      <Link to="/admin/user/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;

