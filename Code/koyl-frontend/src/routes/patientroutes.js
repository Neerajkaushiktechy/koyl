import React from "react";
import { Route, Routes } from "react-router-dom";
import GroceryCheckList from "../Views/Dashboard/patient/GroceryChecklist";
import SpecialOffers from "../Views/Dashboard/patient/SpecialOffers";
import PatientDashboard from "../Views/Dashboard/patient/PatientDashboard";
import PatientAccount from "../Views/Account/PatientAccount";

const PatientRoutes = (props) => {
  return (
    <Routes>
      <Route path="account" element={<PatientAccount />} />
      <Route path="recommendations" element={<PatientDashboard />} />
      <Route path="grocerychecklist" element={<GroceryCheckList />} />
      <Route path="specialoffers" element={<SpecialOffers />} />
    </Routes>
  );
};

export default PatientRoutes;
