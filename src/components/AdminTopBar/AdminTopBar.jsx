import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import Cookies from "js-cookie";
import "./AdminTopBar.css";

const AdminTopBar = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const buttonEl = useRef(null);

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
  );
};

export default AdminTopBar;
