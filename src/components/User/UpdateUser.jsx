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
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const userId = useParams("id");
  const [user, setUser] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [displayPasswordUpdate, setDisplayPasswordUpdate] = useState("none");
  const [displayPasswordUpdateButtonText, setDisplayPasswordUpdateButtonText] =
    useState("Update Password");
  const [displayPasswordUpdateState, setDisplayPasswordUpdateState] =
    useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [nonHashpassword, setNonHashpassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState();
  const [repeatPasswordValidation, setRepeatPasswordValidation] =
    useState(true);

  const getUserForUpdate = async () => {
    try {
      const user = await axios.get(`http://localhost:8080/users/${userId.id}
      `);
      if (user) {
        setUser(user.data.response);
      } else {
        console.log(user.data.message);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      console.log("user", user.firstName);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setSelectedRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    getUserForUpdate();
  }, []);

  const handleForm = async () => {
    if (!firstName || !lastName || !email || !selectedRole) {
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
    } else {
      if (displayPasswordUpdateState) {
        if (!password || !repeatPassword) {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Fill all required fields",
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
          const response = await axios.patch(
            `http://localhost:8080/users/${userId.id}`,
            formData
          );
          console.log("response", response);

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
      } else {
        const formData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          role: selectedRole,
        };
        const response = await axios.patch(
          `http://localhost:8080/users/${userId.id}`,
          formData
        );
        console.log("response 2", response);
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
    }
  };

  useEffect(() => {
    if (displayPasswordUpdateState === true) {
      setDisplayPasswordUpdateButtonText("Close button update modal");
      setDisplayPasswordUpdate("block");
    } else {
      setDisplayPasswordUpdate("none");
      setDisplayPasswordUpdateButtonText("Update password");
    }
  }, [displayPasswordUpdateState]);

  const hendleEmail = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  useEffect(() => {
    var salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(nonHashpassword, salt);
    setPassword(hash);
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

  console.log("dissss", displayPasswordUpdateState);

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
            <div className="input-wrapper"></div>
            <div className="input-wrapper button">
              <Button
                label={displayPasswordUpdateButtonText}
                onClick={() =>
                  setDisplayPasswordUpdateState(!displayPasswordUpdateState)
                }
              />
            </div>
            <div
              className="form update-password"
              style={{ display: displayPasswordUpdate }}
            >
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
                {!repeatPasswordValidation ||
                  (!repeatPassword && (
                    <small className="p-error">Password dosen't match!</small>
                  ))}
              </div>
            </div>
            <div className="input-wrapper button">
              <Button label="Update user" onClick={handleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateUser;
