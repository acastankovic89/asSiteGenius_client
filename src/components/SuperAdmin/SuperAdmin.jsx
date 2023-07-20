import React, { useEffect } from "react";
import { useState } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "./SuperAdmin.css";
import axios from "axios";
import * as bcrypt from "bcryptjs";

const SuperAdmin = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [nonHashpassword, setNonHashpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [repeatPasswordValidation, setRepeatPasswordValidation] =
    useState(true);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleForm = async (event) => {
    event.preventDefault();
    if (!repeatPasswordValidation) {
      return;
    }

    const response = await axios.post(`http://localhost:8080/users`, {
      password: password,
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: "admin",
    });
    console.log("response", response);
    console.log("tesssss", response);
  };

  useEffect(() => {
    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(nonHashpassword, salt);
    setPassword(hash);
  }, [nonHashpassword]);

  console.log("repeatPasswordValidation", repeatPasswordValidation);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  const validateEmail = (value) => {
    // Use regular expression to validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(value);
  };

  const hendlePassword = (e) => {
    const value = e.target.value;
    console.log("value", value);
    setRepeatPassword(value);
    if (nonHashpassword !== value) {
      setRepeatPasswordValidation(false);
    } else {
      setRepeatPasswordValidation(true);
    }
  };

  return (
    <div className="superAdminPage">
      <div className="title">
        <h1>Super admin register</h1>
      </div>
      <div className="formWrapper">
        <form onSubmit={handleForm}>
          <p>Email</p>
          <InputText
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className={!isValidEmail ? "p-invalid" : ""}
          />
          {!isValidEmail && (
            <small className="p-error">
              Please enter a valid email address
            </small>
          )}
          <p>Password</p>
          <Password
            value={nonHashpassword}
            onChange={(e) => setNonHashpassword(e.target.value)}
            promptLabel="Choose a password"
            weakLabel="Too simple"
            mediumLabel="Average complexity"
            strongLabel="Complex password"
            toggleMask
          />
          <p>Repeat Password</p>
          <Password
            value={repeatPassword}
            onChange={hendlePassword}
            promptLabel="Choose a password"
            feedback={false}
          />
          {!repeatPasswordValidation && (
            <small className="p-error">Password dosen't match!</small>
          )}
          <p>First Name</p>
          <InputText
            name={firstName}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <p>Last Name</p>
          <InputText
            name={lastName}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Button type="submit" label="Submit" />
        </form>
      </div>
    </div>
  );
};

export default SuperAdmin;
