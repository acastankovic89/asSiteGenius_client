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
  const [imageForDelete, setImageForDelete] = useState();
  const [imageNameForItemDelete, setImageNameForItemDelete] = useState();
  const [deleteDialogDisplay, setDeleteDialogDisplay] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesFromFolder, setImagesFromFolder] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryItemsToatal, setGalleryItemsToatal] = useState([]);
  const [initialGalleryItemsToatal, setInitialGalleryItemsToatal] = useState(
    []
  );

  useEffect(() => {
    // Set the initial state of galleryItemsToatal with default captions
    const initialToatal = galleryItems.map((item, index) => ({
      ...item,
      imageUrl: imagesFromFolder[index]
        ? imagesFromFolder[index].itemImageName
        : "",
    }));
    setInitialGalleryItemsToatal(initialToatal);
    setGalleryItemsToatal(initialToatal);
  }, [galleryItems, imagesFromFolder]);

  const sortedImagesFromFolder = [...imagesFromFolder].sort((a, b) =>
    a.itemImageName.localeCompare(b.itemImageName)
  );

  // Sort galleryItems array
  const sortedGalleryItems = [...galleryItems].sort((a, b) =>
    a.itemImageName.localeCompare(b.itemImageName)
  );

  // const galleryItemsToatal = sortedGalleryItems.map((item, index) => ({
  //   ...item,
  //   imageUrl:
  //     sortedImagesFromFolder[index] &&
  //     sortedImagesFromFolder[index].itemImageName
  //       ? sortedImagesFromFolder[index].itemImageName
  //       : "",
  // }));

  console.log("galleryItemsToatal", galleryItemsToatal);

  const pageReload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const fetchImagesFromFolder = async () => {
    try {
      const fetchImages = await axios.get(
        `http://localhost:8080/file-upload/gallery/${galleryId.id}`
      );
      if (fetchImages) {
        setImagesFromFolder(fetchImages.data.response);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const fetchItems = await axios.get(
        `http://localhost:8080/gallery-items/${galleryId.id}`
      );
      if (fetchItems) {
        const sortedGalleryItems = [...fetchItems.data.response].sort((a, b) =>
          a.itemImageName.localeCompare(b.itemImageName)
        );
        setGalleryItems(sortedGalleryItems);
        const updatedGalleryItemsToatal = fetchItems.data.response.map(
          (item, index) => ({
            ...item,
            imageUrl: sortedImagesFromFolder[index]
              ? sortedImagesFromFolder[index].itemImageName
              : "",
          })
        );
        setGalleryItemsToatal(updatedGalleryItemsToatal);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchImagesFromFolder();
    fetchGalleryItems();
  }, []);

  const handleSelect = (selectedFiles) => {
    const fileNames = selectedFiles.files.map((file, index) => ({
      itemImageName: file.name,
      caption: "",
      galleryId: galleryId.id,
    }));
    setSelectedImages(fileNames);
  };

  const handleForm = async () => {
    const formData = selectedImages;
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
        setTimeout(() => {
          pageReload();
        }, 1500);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleDelete = (data, item) => {
    setImageForDelete(data);
    setImageNameForItemDelete(item);
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
        }, 800);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
    try {
      const deleteGalleryItem = await axios.delete(
        `http://localhost:8080/gallery-items/${galleryId.id}/${imageNameForItemDelete}`
      );
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const updateGallery = async () => {
    try {
      const formData = galleryItemsToatal;
      const updateGalleryItem = await axios.patch(
        `http://localhost:8080/gallery-items/`,
        formData
      );
      if (updateGalleryItem.data.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: updateGalleryItem.data.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        toast.current.show({
          severity: "error",
          detail: updateGalleryItem.data.message,
        });
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleInputCaption = (index, newValue) => {
    const updatedGalleryItemsToatal = [...galleryItemsToatal];
    updatedGalleryItemsToatal[index].caption = newValue;
    setGalleryItemsToatal(updatedGalleryItemsToatal);
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
              onUpload={handleForm}
              onSelect={handleSelect}
              accept="image/*"
              maxFileSize={2000000}
              emptyTemplate={
                <p className="m-0">Drag and drop files to here to upload.</p>
              }
            />
          </div>
        </div>
        <div className="formWrapper slider sliderItem">
          {galleryItemsToatal && galleryItemsToatal.length > 0 ? (
            galleryItemsToatal.map((element, index) => (
              <div className="galleryItemImgWrapper" key={index}>
                <img
                  src={`http://localhost:8080/uploads/gallery/${galleryId.id}/${element.imageUrl}`}
                  alt=""
                />
                <InputText
                  className={"p-inputtext-lg"}
                  value={galleryItemsToatal[index].caption || ""}
                  onChange={(e) => handleInputCaption(index, e.target.value)}
                />
                <p>Image caption</p>
                <Button
                  label="Delete image"
                  onClick={() =>
                    handleDelete(element.imageUrl, element.itemImageName)
                  }
                  severity="danger"
                />
              </div>
            ))
          ) : (
            <p>No images to display</p>
          )}
          <div className="input-wrapper button">
            <Button label="Update gallery" onClick={updateGallery} />
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
              onClick={() => setDeleteDialogDisplay(false)}
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
