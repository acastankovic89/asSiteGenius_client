import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "./AdminLogIn.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

const AdminLogIn = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("password", password);
  console.log("email", email);

  const checkSession = () => {
    const adminCookie = Cookies.get("admin");
    if (
      adminCookie &&
      Object.keys(adminCookie).length > 0 &&
      adminCookie !== undefined
    ) {
      setIsLoggedIn(true);
      navigate("/adminHome");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      `http://localhost:8080/users/logInAdmin`,
      {
        email: email,
        password: password,
      }
    );
    console.log("response", response);
    if (response.data.status === 401) {
      setIsValid(false);
      setValidationMessage(response.data.message);
      if (toast.current) {
        toast.current.show({
          severity: "warn",
          summary: "Rejected",
          detail: response.data.message,
          life: 3000,
        });
      }
    }
    if (response.data.status === 200) {
      setIsValid(true);
      Cookies.set("admin", JSON.stringify(response.data.response));
      if (toast.current) {
        toast.current.show({
          severity: "info",
          summary: "Confirmed",
          detail: response.data.message,
          life: 3000,
        });
      }
      setTimeout(() => {
        checkSession();
      }, 2000);
    }
  };
  if (isLoggedIn === false) {
    return (
      <div className="adminLogIn">
        <div className="formWrapper">
          <Toast ref={toast} />
          <div className="title">
            <h1>Log in to Admin page</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <InputText
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              className={!isValid ? "p-invalid" : ""}
            />
            <Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              promptLabel="Type password"
              feedback={false}
              toggleMask
            />
            {!isValid && <small className="p-error">{validationMessage}</small>}
            <Button type="submit" label="Log In" />
          </form>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default AdminLogIn;
