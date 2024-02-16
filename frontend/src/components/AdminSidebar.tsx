import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import { RiDashboardFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { Location } from 'history';

interface UserRoleProps {
  userRole: string;
}

const AdminSidebar = ({ userRole }: UserRoleProps) => {
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [roleBasedTabs, setRoleBasedTabs] = useState<{ url: string; text: string; Icon: IconType }[]>([]);

  useEffect(() => {
    const resizeHandler = () => {
      setShowDrawer(false); // Close the drawer when resizing
    };

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    // Define role-based tabs based on the user's role
    let tabs: { url: string; text: string; Icon: IconType }[] = [];
    switch (userRole) {
      case "examiner":
        tabs = [
          { url: "/admin/dashboard", text: "Dashboard", Icon: RiDashboardFill },
          { url: "/admin/agent", text: "Ticket Management", Icon: RiDashboardFill },
          { url: "/admin/user", text: "Examiners", Icon: IoIosPeople },
        ];
        break;
      case "admin":
        tabs = [
          { url: "/admin/dashboard", text: "Dashboard", Icon: RiDashboardFill },
          { url: "/admin/agent", text: "Ticket Management", Icon: RiDashboardFill },
          { url: "/admin/user", text: "Examiners", Icon: IoIosPeople },
        ];
        break;
      case "sAdmin":
        tabs = [
          { url: "/admin/dashboard", text: "Dashboard", Icon: RiDashboardFill },
          { url: "/admin/agent", text: "Ticket Management", Icon: RiDashboardFill },
          { url: "/admin/user", text: "Examiners", Icon: IoIosPeople },

        ];
        break;
      case "finance":
        tabs = [
          { url: "/admin/dashboard", text: "Dashboard", Icon: RiDashboardFill },
          // { url: "/admin/agent", text: "Ticket Management", Icon: RiDashboardFill },
          // { url: "/admin/user", text: "Examiners", Icon: IoIosPeople },
        ];
        break;
      default:
        break;
    }
    setRoleBasedTabs(tabs);
  }, [userRole]);

  return (
    <>
      <button id="hamburger" onClick={() => setShowDrawer(true)}>
        <HiMenuAlt4 />
      </button>

      {showDrawer && (
        <div className="overlay" onClick={() => setShowDrawer(false)}></div>
      )}

      <aside
        className={showDrawer ? "open" : ""}
        style={{
          width: "20rem",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: showDrawer ? "0" : "-20rem",
          transition: "all 0.5s",
        }}
      >
        <h2><img src="https://dltccoffeeimages.s3.amazonaws.com/new_logo_dltc.png" alt="Logo" className="logo" loading='lazy' width={80} height={80} /></h2>
        
        <DivOne location={location} roleBasedTabs={roleBasedTabs} />

        {showDrawer && (
          <button id="close-sidebar" onClick={() => setShowDrawer(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

const DivOne = ({ location, roleBasedTabs }: { location: Location; roleBasedTabs: { url: string; text: string; Icon: IconType }[] }) => (
  <div>
    <h5>Dashboard</h5>
    <ul>
      {roleBasedTabs.map(tab => (
        <Li key={tab.url} url={tab.url} text={tab.text} Icon={tab.Icon} location={location} />
      ))}
    </ul>
  </div>
);

interface LiProps {
  url: string;
  text: string;
  location: Location;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url)
        ? "rgba(0,115,255,0.1)"
        : "white",
    }}
  >
    <Link
      to={url}
      style={{
        color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
      }}
    >
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;
