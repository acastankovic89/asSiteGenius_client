import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdmin from "./components/SuperAdmin";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SuperAdmin />} />
      </Routes>
    </Router>
  );
};
