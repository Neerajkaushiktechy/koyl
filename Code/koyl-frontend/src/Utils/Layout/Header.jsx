import React from "react";
import logo from "../../assets/images/logo-koyl-white.svg";
import avatar from "../../assets/images/avatar.png";
import { CgMenu } from "react-icons/cg";
import { Dropdown } from "flowbite-react";
import { LogoutUser } from "../../Store/Service/LogoutService";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";

function Header({ toggleSidebar }) {
  const navigate = useNavigate();
  const userData = AuthService.GetLoggedInUserData();

  const handleLogout = () => {
    LogoutUser();
    navigate("/");
    localStorage.removeItem("UserRole");
    localStorage.removeItem("authUser");
    localStorage.removeItem("userId");
    localStorage.removeItem("userData.role");
    localStorage.removeItem("authtoken");
  };
  return (
    <>
      {userData.role === 0 && (
        <>
          <div className="bg-primary flex justify-between items-center px-9 py-2">
            <img src={logo} className="w-28"></img>
            <div className="hidden md:flex items-center">
              <span className="text-white text-base mr-[10px]">
                {userData.firstName} {userData.lastName}
              </span>
              <Dropdown
                arrowIcon={false}
                label={<img src={avatar} className="cursor-pointer" />}
                inline={true}
                dismissOnClick={false}
                className="shadow-none border-neutral-border"
              >
                <Dropdown.Item>My Account</Dropdown.Item>
                <Dropdown.Item
                  onClick={handleLogout}
                  className="text-text-danger"
                >
                  Log out
                </Dropdown.Item>
              </Dropdown>
            </div>
            <CgMenu
              className="text-white visible md:hidden text-2xl"
              onClick={toggleSidebar}
            />
          </div>
        </>
      )}
      {userData.role === 1 && (
        <div className="bg-primary flex justify-between items-center px-9 py-2">
          <img src={logo} className="w-28"></img>
          <div className="hidden md:flex items-center">
            <span className="text-white text-base mr-[10px]">
              Welcome, Dr. {userData.firstName} {userData.lastName}!
            </span>
            <Dropdown
              arrowIcon={false}
              label={<img src={avatar} className="cursor-pointer" />}
              inline={true}
              dismissOnClick={false}
              className="shadow-none border-neutral-border"
            >
              <Dropdown.Item
                onClick={handleLogout}
                className="text-text-danger"
              >
                Log out
              </Dropdown.Item>
            </Dropdown>
          </div>
          <CgMenu
            className="text-white visible md:hidden text-2xl"
            onClick={toggleSidebar}
          />
        </div>
      )}
    </>
  );
}

export default Header;