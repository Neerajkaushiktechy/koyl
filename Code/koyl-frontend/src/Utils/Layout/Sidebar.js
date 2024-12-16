import React, { useState } from "react";
import { Link, useLocation, Outlet} from "react-router-dom";
import { BsXLg, BsTelephone, BsSend } from "react-icons/bs";
import avatar from "../../assets/images/avatar.png";
import AuthService from "../../service/AuthService";
import Header from "./Header";

function Sidebar() {
  const location = useLocation();
  const userData = AuthService.GetLoggedInUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex">
        <div
          className={`bg-secondary sm:p-0 md:p-9 w-[0] md:w-[268px] min-h-[calc(100vh-57px)] ${
            isSidebarOpen ? "fixed-sidebar" : ""
          }`}
        >
          <div className="sidebar-menu-items">
            <BsXLg
              onClick={toggleSidebar}
              className="text-white text-xl absolute top-4 right-4"
            />
            <div className="flex items-center bg-primary rounded-lg px-4 py-2 mb-6">
              <span className="text-white text-base  mr-4">
                Welcome, Bertha!
              </span>
              <img src={avatar}></img>
            </div>
          </div>
          <ul>
            {userData.role === 1 && (
              <>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/doctor/dashboard" ? "active" : ""
                  }`}
                >
                  <Link to="/doctor/dashboard">Dashboard</Link>
                </li>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/doctor/patients" ? "active" : ""
                  }`}
                >
                  <Link to="/doctor/patients">Patients</Link>
                </li>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/doctor/account" ? "active" : ""
                  }`}
                >
                  <Link to="/doctor/account">My Account</Link>
                </li>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/doctor/send-registeration-link"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/doctor/send-registeration-link">
                    Send Registeration Link
                  </Link>
                </li>
                <li className="sidebar-menu">
                  <Link to="#">Support</Link>
                </li>
              </>
            )}

            {userData.role === 0 && (
              <>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/patient/account" ? "active" : ""
                  }`}
                >
                  <Link to="/patient/account">My Account</Link>
                </li>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/patient/recommendations"
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/patient/recommendations">My Recommendations</Link>
                </li>
                <li
                  className={`sidebar-menu ${
                    location.pathname === "/Support" ? "active" : ""
                  }`}
                >
                  <Link to="#">Support</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Home Routes render section */}
        <Outlet />
      </div>
      
    </div>
  );
}

export default Sidebar;
