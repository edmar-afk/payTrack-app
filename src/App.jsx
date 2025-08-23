import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import PTA from "./routes/PTA";
import Login from "./routes/Login";
import CF from "./routes/CF";
import LAC from "./routes/LAC";
import QAA from "./routes/QAA";
import RHC from "./routes/RHC";
import Register from "./routes/Register";
import StudentDashboard from "./routes/StudentDashboard";
import ComitteeTable from "./components/dashboard/ComitteeTable";
import Comittee from "./routes/Comittee";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/pta" element={<PTA />} />
        <Route path="/cf" element={<CF />} />
        <Route path="/lac" element={<LAC />} />
        <Route path="/qaa" element={<QAA />} />
        <Route path="/rhc" element={<RHC />} />
        <Route path="/comittee/:id/:name" element={<Comittee />} />

        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
