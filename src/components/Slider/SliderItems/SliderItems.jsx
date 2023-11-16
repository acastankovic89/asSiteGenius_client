import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";

const SliderItems = () => {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [sliderItemName, setSliderItemName] = useState("");
  const [sliderId, setSliderId] = useState();
  const [sliderItemCaption1, setSliderItemCaption1] = useState("");
  const [sliderItemCaption2, setSliderItemCaption2] = useState("");
  const [allSliderItems, setAllSliderItems] = useState("");
  const [sliderImageName, setSliderImageName] = useState("");
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [sliderImage, setSliderImage] = useState();

  const onUpload = (e) => {
    setSliderImageName(e.files[0].name);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const handleForm = async () => {
    const formData = {
      name: sliderItemName,
      caption: sliderItemCaption1,
      caption2: sliderItemCaption2,
      sliderId: id,
      image: sliderImageName,
    };
    try {
      const createSliderItem = await axios.post(
        "http://localhost:8080/slider-items",
        formData
      );
      if (createSliderItem) {
        if (createSliderItem.data.status === 200) {
          toast.current.show({
            severity: "info",
            summary: "Success",
            detail: createSliderItem.data.message,
          });
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const fetchAllSliderItems = async () => {
    try {
      const sliderItems = await axios.get(
        `http://localhost:8080/slider-items/current-slider/${id}`
      );
      setAllSliderItems(sliderItems.data.response);
    } catch (error) {}
  };

  const redirectToUpdate = (data) => {
    navigate(`/slider/updateSliderItems/${data}`);
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={() => redirectToUpdate(rowData.id)} // Define your edit action function
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData.id, rowData.image)} // Define your delete action function
        />
      </div>
    );
  };

  const handleDelete = (data, image) => {
    setSliderImage(image);
    setDisplayDeleteDialog(true);
    setSliderId(data);
  };

  const confirmDelete = async () => {
    try {
      const deleteSliderItem = await axios.delete(
        `http://localhost:8080/slider-items/${sliderId}`
      );
      const deleteSliderImage = await axios.delete(
        `http://localhost:8080/file-upload/slider-image/${sliderImage}`
      );
      setDisplayDeleteDialog(false);
      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "The slider item and slider image have been removed.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllSliderItems();
  }, []);

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
            <Button label="Save Menu item" onClick={handleForm} />
          </div>
        </div>
      </div>
      <div className="adminWrapper menuItemsWrapper">
        <div className="formWrapper slider">
          <div className="card">
            <DataTable
              value={allSliderItems}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="name"
                header="Slider name"
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="caption"
                header="Caption"
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="caption2"
                header="Caption2"
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="image"
                header="Image"
                style={{ width: "20%" }}
              ></Column>
              <Column
                field="id"
                header="Actions"
                value={"id"}
                body={actionTemplate}
                style={{ width: "20%" }}
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <Dialog
        visible={displayDeleteDialog}
        onHide={() => setDisplayDeleteDialog(false)}
        header="Confirm Deletion"
        footer={
          <div>
            <Button
              label="Yes"
              icon="pi pi-check"
              onClick={confirmDelete}
              className="p-button-danger"
            />
            <Button
              label="No"
              icon="pi pi-times"
              onClick={() => setDisplayDeleteDialog(false)}
              className="p-button-secondary"
            />
          </div>
        }
      >
        Are you sure you want to delete this slider item?
      </Dialog>
    </div>
  );
};
export default SliderItems;
