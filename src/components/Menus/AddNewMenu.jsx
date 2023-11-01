import React, { useState, useRef } from "react";
import "../Articles/AddNewArticle/AddNewArticle.css";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";

const AddNewMenu = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  console.log("name", name);
  console.log("selectedLanguage", selectedLanguage);

  const languages = [
    { language: "Srpski", id: 1 },
    { language: "Engleski", id: 2 },
    { language: "Nemacki", id: 3 },
    { language: "Francuski", id: 4 },
    { language: "Ruski", id: 5 },
  ];

  const handleForm = async () => {
    const formData = {
      name: name,
      languageId: selectedLanguage.id,
    };
    try {
      const addMenu = await axios.post("http://localhost:8080/menus", formData);
      console.log("addMenu", addMenu.data.status);
      if (addMenu.data.status === 200) {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "Menu Created",
        });
        setTimeout(() => {
          navigate("/menus/menusTable");
        }, 2000);
      } else {
        toast.current.show({
          severity: "info",
          summary: "Warnning",
          detail: "Error creating menu.",
        });
      }
      console.log("addMenu", addMenu);
    } catch (error) {
      if (error) console.log("Error:", error);
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
              <label htmlFor="name">Menu name</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="languageSelector">Menu lLanguage</label>
              <Dropdown
                id="languageSelector"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.value)}
                options={languages}
                optionLabel="language"
                placeholder="Select Language"
                className="w-full md:w-14rem"
              />
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
export default AddNewMenu;
