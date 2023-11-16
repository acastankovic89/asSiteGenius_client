import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import moment from "moment/moment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateGallery = () => {
  const galleryId = useParams("id");
  const toast = useRef(null);
  const [name, setName] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [createdAt, setCreatedAt] = useState();
  const [updatedAt, setUpdatedAt] = useState();
  const navigate = useNavigate();
  const [required, setRequired] = useState(true);
  const [currentGallery, setCurrentGallery] = useState(null);

  const languages = [
    { language: "Srpski", id: 1 },
    { language: "Engleski", id: 2 },
    { language: "Nemacki", id: 3 },
    { language: "Francuski", id: 4 },
    { language: "Ruski", id: 5 },
  ];

  useEffect(() => {
    if (!name || !selectedLanguage) {
      setRequired(false);
    }
    setUpdatedAt(moment().format("DD-MM-YYYY"));
    getCurrentGallery();
  }, [galleryId.id]);

  useEffect(() => {
    if (currentGallery) {
      setName(currentGallery.name);
      setCreatedAt(currentGallery.createdAt);

      const selectedlanguageObj = languages.find(
        (lang) => lang.id === parseInt(currentGallery.language, 10)
      );

      setSelectedLanguage(selectedlanguageObj || null);
    }
  }, [currentGallery]);

  useEffect(() => {
    if (name && selectedLanguage) {
      setRequired(true);
    }
  }, [name, selectedLanguage]);

  const getCurrentGallery = async () => {
    try {
      const currentGallery = await axios.get(
        `http://localhost:8080/gallery/${galleryId.id}`
      );
      if (currentGallery.data.status === 200) {
        setCurrentGallery(currentGallery.data.response);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

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
        language: selectedLanguage.id.toString(),
        updatedAt: updatedAt,
      };
      console.log("formData", formData);
      try {
        const updateGallery = await axios.patch(
          `http://localhost:8080/gallery/${galleryId.id}`,
          formData
        );
        console.log("updateGallery", updateGallery);
        if (updateGallery.data.status === 200) {
          toast.current.show({
            severity: "success",
            detail: updateGallery.data.message,
          });
          setTimeout(() => {
            navigate("/gallery/galleriesTable");
          }, 1500);
        } else {
          toast.current.show({
            severity: "error",
            detail: updateGallery.data.message,
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
                onChange={(e) => setSelectedLanguage(e.value)}
                className={
                  !required ? "p-invalid p-inputtext-lg" : "p-inputtext-lg"
                }
              />
              {!required ? <small>Required field</small> : <small></small>}
            </div>

            <div className="input-wrapper button">
              <Button label="Update gallery" onClick={handleForm} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateGallery;
