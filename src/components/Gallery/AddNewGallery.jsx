import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import moment from "moment/moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddNewGallery = () => {
  const toast = useRef(null);
  const [name, setName] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [createdAt, setCreatedAt] = useState();
  const navigate = useNavigate();
  const [required, setRequired] = useState(true);

  useEffect(() => {
    if (!name || !selectedLanguage) {
      setRequired(false);
    }
    setCreatedAt(moment().format("DD-MM-YYYY H"));
  }, []);

  useEffect(() => {
    if (name && selectedLanguage) {
      setRequired(true);
    }
  }, [name, selectedLanguage]);

  const languages = [
    { language: "Srpski", id: 1 },
    { language: "Engleski", id: 2 },
    { language: "Nemacki", id: 3 },
    { language: "Francuski", id: 4 },
    { language: "Ruski", id: 5 },
  ];

  const handleForm = async () => {
    if (!required) {
      toast.current.show({
        severity: "error",
        detail: "Fill required fields!",
      });
    } else {
      const formData = {
        name: name,
        createdAt: createdAt,
        language: selectedLanguage.id,
      };
      try {
        const createGallery = await axios.post(
          `http://localhost:8080/gallery`,
          formData
        );
        if (createGallery.data.status === 200) {
          toast.current.show({
            severity: "success",
            detail: createGallery.data.message,
          });
          setTimeout(() => {
            navigate("/gallery/galleriesTable");
          }, 1500);
        } else {
          toast.current.show({
            severity: "error",
            detail: createGallery.data.message,
          });
        }
      } catch (error) {
        if (error) {
          console.log("Error", error);
        }
      }
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
              <p>Gallery name</p>
              <InputText
                className={
                  !required ? "p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!required ? <small>Required field</small> : <small></small>}
            </div>
            <div className="input-wrapper">
              <p>Gallery language</p>
              <Dropdown
                value={selectedLanguage}
                options={languages}
                optionLabel="language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={
                  !required ? "p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
              />
              {!required ? <small>Required field</small> : <small></small>}
            </div>

            <div className="input-wrapper button">
              <Button label="Add new gallery" onClick={handleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewGallery;
