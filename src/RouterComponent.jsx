import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdmin from "./components/SuperAdmin/SuperAdmin";
import AdminLogIn from "./components/AdminLogIn/AdminLogIn";
import AdminHome from "./components/AdminHome/AdminHome";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogIn />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/super_admin" element={<SuperAdmin />} />
      </Routes>
    </Router>
  );
};
