import React, { useState, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import "./AdminHome.css";
import { Sidebar } from "primereact/sidebar";

const AdminHome = () => {
  const adminCheck = Cookies.get("admin");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const buttonEl = useRef(null);
  const [visibleMenu, setVisibleMenu] = useState(true);

  const logOut = () => {
    Cookies.remove("admin");
    navigate("/admin");
  };

  const accept = () => {
    toast.current.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
    setTimeout(() => {
      logOut();
    }, 2000);
  };

  const reject = () => {
    toast.current.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  return (
    <div className="adminHome">
      <div className="adminHomeWrapper">
        <div className="adminTopBar">
          <Toast ref={toast} />
          <ConfirmPopup
            target={buttonEl.current}
            visible={visible}
            onHide={() => setVisible(false)}
            message="Are you sure you want to proceed?"
            icon="pi pi-exclamation-triangle"
            accept={accept}
            reject={reject}
          />
          <Button
            ref={buttonEl}
            onClick={() => setVisible(true)}
            icon="pi pi-user"
            label="Log Out"
          />
        </div>
        <div className="sideBar">
          <div className="card flex justify-content-center">
            <Sidebar
              visible={visibleMenu}
              onHide={() => setVisibleMenu(false)}
              className="w-full md:w-20rem lg:w-30rem"
            >
              <h2>Sidebar</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </Sidebar>
            <Button
              icon="pi pi-arrow-right"
              onClick={() => setVisibleMenu(true)}
              label="SIde bar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
