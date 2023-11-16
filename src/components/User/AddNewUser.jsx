import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Password } from "primereact/password";
import * as bcrypt from "bcryptjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNewUser = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [nonHashpassword, setNonHashpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState();
  const [repeatPasswordValidation, setRepeatPasswordValidation] =
    useState(true);
  const handleForm = async () => {
    if (
      !password ||
      !repeatPassword ||
      !firstName ||
      !lastName ||
      !email ||
      !selectedRole
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Fill all required fields",
      });
    } else if (!isValidEmail) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Email addres are not valid!",
      });
    } else if (!repeatPasswordValidation) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password doesent match!",
      });
    } else {
      const formData = {
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: selectedRole,
      };
      const response = await axios.post(
        `http://localhost:8080/users`,
        formData
      );

      if (response) {
        toast.current.show({
          severity: "success",
          detail: response.data.message,
        });
        setTimeout(() => {
          navigate("/users/usersTable");
        }, 2000);
      }
    }
  };

  const hendleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  useEffect(() => {
    var salt = bcrypt.genSaltSync(10);
    if (nonHashpassword) {
      const hash = bcrypt.hashSync(nonHashpassword, salt);
      setPassword(hash);
    } else {
      setPassword("");
    }
  }, [nonHashpassword]);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const roles = [
    {
      label: "Admin",
      value: "Admin",
    },
    {
      label: "Editor",
      value: "Editor",
    },
  ];

  const handlePassword = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    if (nonHashpassword !== value) {
      setRepeatPasswordValidation(false);
    } else {
      setRepeatPasswordValidation(true);
    }
  };

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper">
        <div className="formWrapper menu">
          <Toast ref={toast}></Toast>
          <div className="form">
            <div className="input-wrapper">
              <label htmlFor="name">User first name</label>
              <InputText
                id="name"
                placeholder={!firstName ? "* required field" : ""}
                aria-describedby="username-help"
                onChange={(event) => setFirstName(event.target.value)}
                className={
                  !firstName ? " p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
                value={firstName}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="name">User last name</label>
              <InputText
                id="name"
                placeholder={!lastName ? "* required field" : ""}
                aria-describedby="username-help"
                onChange={(event) => setLastName(event.target.value)}
                className={
                  !lastName ? " p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
                value={lastName}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="role">Select role for user.</label>
              <Dropdown
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                placeholder={!selectedRole ? "* required field" : ""}
                className={
                  !selectedRole ? " p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
                options={roles}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="name">User email</label>
              <InputText
                id="email"
                placeholder={!email ? "*required field" : ""}
                onChange={hendleEmail}
                value={email}
                autoComplete="off"
                className={
                  !isValidEmail || !email
                    ? " p-invalid p-inputtext-lg"
                    : "p-inputtext-lg"
                }
              />
              {!isValidEmail ? (
                <small className="p-error">
                  Please enter a valid email address
                </small>
              ) : (
                ""
              )}
            </div>
            <div className="input-wrapper">
              <p>Password</p>
              <Password
                className={
                  !nonHashpassword
                    ? " p-invalid p-inputtext-lg"
                    : "p-inputtext-lg"
                }
                onChange={(e) => setNonHashpassword(e.target.value)}
                value={nonHashpassword}
                promptLabel="Choose a password"
                weakLabel="Too simple"
                mediumLabel="Average complexity"
                strongLabel="Complex password"
                autoComplete="new-password"
                autoFocus
                toggleMask
              />
            </div>
            <div className="input-wrapper">
              <p>Repeat Password</p>
              <Password
                value={repeatPassword}
                onChange={handlePassword}
                promptLabel="Choose a password"
                feedback={false}
                className={
                  !repeatPasswordValidation || !repeatPassword
                    ? " p-invalid p-inputtext-lg"
                    : "p-inputtext-lg"
                }
              />
              {!repeatPasswordValidation ? (
                <small className="p-error">Password dosen't match!</small>
              ) : (
                ""
              )}
            </div>
            <div className="input-wrapper button">
              <Button label="Save Menu" onClick={handleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewUser;
