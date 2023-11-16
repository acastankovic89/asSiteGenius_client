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

const AddNewSlider = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState({
    name: "Srpski",
    id: 1,
  });

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
      const addSlider = await axios.post(
        "http://localhost:8080/slider",
        formData
      );
      if (addSlider.data.status === 200) {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "Slider Created",
        });
        setTimeout(() => {
          navigate("/slider/slidersTable");
        }, 2000);
      } else {
        toast.current.show({
          severity: "info",
          summary: "Warnning",
          detail: "Error creating slider.",
        });
      }
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
              <label htmlFor="name">Slider name</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="languageSelector">Slider Language</label>
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
              <Button label="Save Slider" onClick={handleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewSlider;
