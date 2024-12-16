import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "../service/AuthService";
import { LogoutUser } from "../Store/Service/LogoutService";
import { useEffect, useState } from "react";
import SessionExpireAlert from "./SessionExpireAlert";

const ProtectedRoute = ({ redirectPath }) => {
  const location = useLocation();
  const decodedToken = AuthService.GetLoggedInUserData();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (decodedToken) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        setShowAlert(true);
        setTimeout(() => {
          LogoutUser();
          window.location.href = "/";
        }, 2000); // wait for 2 seconds before logging out
      }
    }
  }, [decodedToken]);

  if (!AuthService.getAuthtoken()?.isToken) {
    return <Navigate to={"/"} replace state={{ from: location }} />;
  }
  if (AuthService.GetLoggedInUserData().role !== 1) {
    return <Navigate to={"/Error"} />;
  }

  if (showAlert === true) {
    return <SessionExpireAlert />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
