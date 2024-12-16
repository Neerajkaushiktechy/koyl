import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../Views/Dashboard/Docter/Dashboard";
import PatientList from "../Views/Account/PatientList";
import PatientDetails from "../Views/Account/PatientDetails";
import PatientAccount from "../Views/Account/PatientAccount";
import Recommendations from "../Views/Dashboard/Docter/Recommendations";
import SendCreateAccountLink from "../Views/Account/send-registeration-link";


const Home = (props) => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="patients" element={<PatientList />} />
      <Route path="patient-details/:id" element={<PatientDetails />} />
      <Route path="account" element={<PatientAccount />} />
      <Route path="doctor-recommendations" element={<Recommendations />} />
      <Route path="send-registeration-link" element={<SendCreateAccountLink />} />
    </Routes>
  );
};

export default Home;