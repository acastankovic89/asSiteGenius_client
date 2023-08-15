import Cookies from "js-cookie";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import "./AdminHome.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";

const AdminHome = () => {
  const adminCheck = Cookies.get("admin");

  return (
    <div className="adminHome">
      <div className="adminHomeWrapper">
        <AdminTopBar />
        <AdminSidebar />
      </div>
    </div>
  );
};

export default AdminHome;
