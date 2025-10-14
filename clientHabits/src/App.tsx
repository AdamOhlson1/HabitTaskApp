import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import TaskList from "./pages/TaskList";
import Login from "./pages/LoginPage";
import Calender from "./pages/Calender";
import CreateAcc from "./pages/CreateAccPage";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasklist" element={<TaskList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calender" element={<Calender />} />
        <Route path="/createaccount" element={<CreateAcc />} />
      </Routes>
    </>
  );
};

export default App;
