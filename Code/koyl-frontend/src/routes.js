import React from "react";
import Login from "./Components/Account/Login";
import Signup from "./Components/Account/Signup";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Sidebar from "./Utils/Layout/Sidebar";
import CompleteProfile from "./Views/Account/CompleteProfile";
import HomeRoutes from "./routes/Home";
import GroceryCheckList from "./Views/Dashboard/patient/GroceryChecklist";
import SpecialOffers from "./Views/Dashboard/patient/SpecialOffers";
import PatientDashboard from "./Views/Dashboard/patient/PatientDashboard";
import OpenEpicLaunch from "./Views/OpenEpicLaunch/OpenEpicLaunch";
import Feedback from "./Views/Account/Feedback";
import Thanks from "./Views/Account/ThanksForInfo";
import ErrorPage from "./Views/Account/ErrorPage";
import PatientProtectedRoute from "./routes/PatientProtectedRoutes";
import PatientRoutes from "./routes/patientroutes";
import VerifyEmail from "./Views/Account/VerifyEmail";
import ForgotPassword from './Views/Account/ForgotPassword'


const router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password/:id/:token" element={<ForgotPassword/>} />

        <Route path="/" element={<PatientProtectedRoute/>}>
          <Route path="/patient" element={<Sidebar />}>
            <Route path="*" element={<PatientRoutes />} />
          </Route>
        </Route>

        <Route path="/recommendations" element={<PatientDashboard />} />
        <Route path="/grocerychecklist" element={<GroceryCheckList />} />
        <Route path="/specialoffers" element={<SpecialOffers />} />
        <Route path="/feedback/:id" element={<Feedback />} />
        <Route path="/Thank-You" element={<Thanks />} />

        <Route path="/open-epic-launch" element={<OpenEpicLaunch />} />

        <Route path="/" element={<ProtectedRoute/>}>
          <Route path="/doctor" element={<Sidebar />}>
            <Route path="*" element={<HomeRoutes />} />
          </Route>
        </Route>

        <Route path="/Error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default router;
