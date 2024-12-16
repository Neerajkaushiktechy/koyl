"use client";

import { Spinner } from "flowbite-react";

const SpinnerComponent = (props) => {
  return <Spinner aria-label="Loading..." {...props}/>;
};

export default SpinnerComponent;