import { RouterProvider } from "react-router-dom";
import Routes from "./routes";
import "./App.css";
import "./fonts.css";
import { axiosInstance } from "./Store/Axios/axiosInterceptor";

function App() {
  axiosInstance();
  return <Routes />;
}

export default App;
