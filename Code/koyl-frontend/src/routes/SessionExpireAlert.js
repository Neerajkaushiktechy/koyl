import React from 'react'
import { Alert } from "flowbite-react";
import { Outlet } from 'react-router-dom';

const SessionExpireAlert = () => {
  return (
    <div>
      <Alert color="failure">
        <span className="font-medium">
          Your session has expired. You will be logged out.
        </span>
      </Alert>
    <Outlet />
  </div>
  )
}

export default SessionExpireAlert
