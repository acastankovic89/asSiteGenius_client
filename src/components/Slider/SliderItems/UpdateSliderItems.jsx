import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";

const UpdateSliderItems = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [sliderItemName, setSliderItemName] = useState("");
  const [sliderItemId, setSliderItemId] = useState();
  const [sliderItemCaption1, setSliderItemCaption1] = useState("");
  const [sliderItemCaption2, setSliderItemCaption2] = useState("");
  const [sliderImageName, setSliderImageName] = useState("");
  const [sliderData, setSliderData] = useState();

  const onUpload = (e) => {
    setSliderImageName(e.files[0].name);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const fetchSliderItem = async () => {
    try {
      const findSliderItem = await axios.get(
        `http://localhost:8080/slider-items/${id}`
      );
      if (findSliderItem) {
        setSliderData(findSliderItem.data.response);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchSliderItem();
  }, []);

  useEffect(() => {
    if (sliderData) {
      setSliderItemName(sliderData.name);
      setSliderItemCaption1(sliderData.caption);
      setSliderItemCaption2(sliderData.caption2);
      setSliderImageName(sliderData.image);
      setSliderItemId(sliderData.id);
    }
  }, [sliderData]);

  const handleForm = async () => {
    const formData = {
      name: sliderItemName,
      caption: sliderItemCaption1,
      caption2: sliderItemCaption2,
      sliderId: id,
      image: sliderImageName,
    };
    try {
      const updateSliderItem = await axios.patch(
        `http://localhost:8080/slider-items/${sliderItemId}`,
        formData
      );
      if (updateSliderItem) {
        if (updateSliderItem.data.status === 200) {
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: updateSliderItem.data.message,
          });
        }
        setTimeout(() => {
          navigate(`/slider/createSliderItems/${sliderData.sliderId}`);
        }, 2000);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper slider-items">
        <Toast ref={toast}></Toast>
        <div className="formWrapper slider">
          <div className="form menu-input">
            <div className="input-wrapper">
              <label htmlFor="name">Slider item name</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setSliderItemName(event.target.value)}
                value={sliderItemName}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="name">Slider item caption 1</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setSliderItemCaption1(event.target.value)}
                value={sliderItemCaption1}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="name">Slider item caption 2</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setSliderItemCaption2(event.target.value)}
                value={sliderItemCaption2}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="name">Slider image</label>
              <FileUpload
                name="sliderImage"
                url="http://localhost:8080/file-upload/sliderImage"
                accept="image/*"
                maxFileSize={1000000}
                onUpload={onUpload}
                emptyTemplate={
                  sliderImageName ? (
                    <img
                      src={`http://localhost:8080/uploads/sliders/${sliderImageName}`}
                    />
                  ) : (
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  )
                }
              />
            </div>
          </div>
        </div>
        <div className="rightSideBar menu">
          <div className="buttonWrapper">
            <Button label="Update slider item" onClick={handleForm} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateSliderItems;
