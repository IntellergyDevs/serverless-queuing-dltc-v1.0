import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState,useEffect } from "react";
import Loader from "./components/Loader";
import useSessionStorage from "../src/service/AuthService";
//import Forgot from "./pages/forgot/Forgot";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const FAQ = lazy(() => import("./pages/faq/Faq"));
const WaitingArea = lazy(() => import("./pages/waitingarea/WaitingArea"));
const Login = lazy(() => import("./pages/login/Login"));
const Forgot = lazy(() => import("./pages/forgot/Forgot"));
const  Restpassword= lazy(() => import("./pages/restpassword/Restpassword"));
const Tickets = lazy(() => import("./pages/ticket/Ticket"));
const Reason = lazy(() => import("./pages/reason/Reason")); 
const Agent = lazy(() => import("./pages/agent/Agent"));
const Products = lazy(() => import("./pages/Products"));
const Transaction = lazy(() => import("./pages/Transaction"));
const Customers = lazy(() => import("./pages/Customers"));
const NewProduct = lazy(() => import("./pages/management/NewProduct"));
const ProductManagement = lazy(() => import("./pages/management/ProductManagement"));

const App = () => {
  const { getUser } = useSessionStorage();
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    if (getUser()?.user) {
      setUserRole(getUser().user);
    } else {
      console.log("User role not found or not authenticated.");
    }
  }, []); 

  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<WaitingArea />} />
          <Route path="/ticket/reason" element={<Reason />} />
          <Route path="/ticket/ticket" element={<Tickets />} />
          <Route path="/ticket/faq" element={<FAQ />} />
          <Route path="/admin/forgot" element={<Forgot />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/restpassword" element={<Restpassword />} />

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/agent" element={<Agent userRole={userRole} />} />
          <Route path="/admin/user" element={<Products userRole={userRole} />} />
          <Route path="/admin/customer" element={<Customers userRole={userRole} />} />
          <Route path="/admin/transaction" element={<Transaction userRole={userRole} />} /> 
          <Route path="/admin/user/new" element={<NewProduct userRole={userRole} />} />
          <Route path="/admin/product/:id" element={<ProductManagement userRole={userRole} />} />
          <Route path="*" element={<WaitingArea />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
