import { Toast } from "primereact/toast";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import { useEffect, useRef, useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { useParams } from "react-router-dom";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const CreateGalleryItems = () => {
  const toast = useRef();
  const galleryId = useParams("id");
  const [allImageForGallery, setAllImageForGallery] = useState();
  const [captions, setCaptions] = useState();
  const [galleryItems, setGalleryItems] = useState();
  const [imageForDelete, setImageForDelete] = useState();
  console.log("imageForDelete", imageForDelete);
  const [deleteDialogDisplay, setDeleteDialogDisplay] = useState(false);
  console.log("galleryItems", galleryItems);
  console.log("captions", captions);

  const pageReload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  // TODO: create find galery item

  const findGalleryItem = () => {
    try {
    } catch (error) {}
  };

  const findAllForGallery = async () => {
    try {
      const getAllImages = await axios.get(
        `http://localhost:8080/file-upload/gallery/${galleryId.id}`
      );
      if (getAllImages) {
        setAllImageForGallery(getAllImages.data.response);
        setCaptions(new Array(getAllImages.data.response.length).fill(""));
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    findAllForGallery();
  }, []);

  useEffect(() => {
    if (allImageForGallery && allImageForGallery.length > 0) {
      const newGalleryItem = allImageForGallery.map((element, index) => ({
        itemImageName: element,
        caption: captions[index],
        galleryId: galleryId.id,
      }));
      setGalleryItems(newGalleryItem);
    }
  }, [allImageForGallery, captions]);

  const handleForm = async () => {
    const formData = galleryItems;
    console.log("formData", formData);
    try {
      const galleryItem = await axios.post(
        "http://localhost:8080/gallery-items",
        formData
      );
      if (galleryItem.data.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: galleryItem.data.message,
        });
        console.log("galleryItem sadsadad", galleryItem);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleDelete = (data) => {
    setImageForDelete(data);
    setDeleteDialogDisplay(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteImage = await axios.delete(
        `http://localhost:8080/file-upload/gallery/${galleryId.id}/${imageForDelete}`
      );
      if (deleteImage) {
        setDeleteDialogDisplay(false);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "The gallery item has been deleted.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
    try {
      const deleteGalleryItem = await axios.delete(
        `http://localhost:8080/gallery-items/${galleryId.id}/${imageForDelete}`
      );
      console.log("deleteGalleryItem", deleteGalleryItem);
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
            <FileUpload
              name="galleryImageUpload"
              url={`http://localhost:8080/file-upload/gallery/${galleryId.id}`}
              multiple
              onUpload={pageReload}
              accept="image/*"
              maxFileSize={2000000}
              emptyTemplate={
                <p className="m-0">Drag and drop files to here to upload.</p>
              }
            />
          </div>
        </div>
        <div className="formWrapper slider sliderItem">
          {allImageForGallery && allImageForGallery.length > 0 ? (
            allImageForGallery.map((element, index) => (
              <div className="galleryItemImgWrapper" key={index}>
                <img
                  src={`http://localhost:8080/uploads/gallery/${galleryId.id}/${element}`}
                  alt=""
                />
                <InputText
                  className={"p-inputtext-lg"}
                  value={captions[index]}
                  onChange={(e) => {
                    const updatedCaptions = [...captions];
                    updatedCaptions[index] = e.target.value;
                    setCaptions(updatedCaptions);
                  }}
                />
                <p>Image caption</p>
                <Button
                  label="Delete image"
                  onClick={() => handleDelete(element)}
                  severity="danger"
                />
              </div>
            ))
          ) : (
            <p>No images to display</p>
          )}
          <div className="input-wrapper button">
            <Button label="Update gallery" onClick={handleForm} />
          </div>
        </div>
      </div>
      <Dialog
        visible={deleteDialogDisplay}
        onHide={() => setDeleteDialogDisplay(false)}
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
        Are you sure you want to delete this image from gallery?
      </Dialog>
    </div>
  );
};
export default CreateGalleryItems;
