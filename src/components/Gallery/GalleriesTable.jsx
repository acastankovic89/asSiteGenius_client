import { Toast } from "primereact/toast";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import axios from "axios";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";

const GalleriesTable = () => {
  const toast = useRef();
  const [allGalleries, setAllGaleries] = useState();
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [galleryId, setGalleryId] = useState(false);
  const navigate = useNavigate();
  console.log("galleryId", galleryId);

  const getAllGaleries = async () => {
    try {
      const galleries = await axios.get(`http://localhost:8080/gallery`);
      if (galleries.data.status === 200) {
        setAllGaleries(galleries.data.response);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={() => redirectToUpdate(rowData.id)}
          // Define your edit action function
        />
        <Button
          icon="pi pi-fw pi-plus-circle"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={() => addSliderItem(rowData.id)}
          // Define your edit action function
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => handleDelete(rowData.id)} // Define your delete action function
        />
      </div>
    );
  };

  const redirectToUpdate = (data) => {
    navigate(`/gallery/updateGallery/${data}`);
  };

  const addSliderItem = (data) => {
    navigate(`/gallery/createGalleryItems/${data}`);
  };

  const handleDelete = (data) => {
    setGalleryId(data);
    setDisplayDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteGalery = await axios.delete(
        `http://localhost:8080/gallery/${galleryId}`
      );
      if (deleteGalery) {
        console.log("deleteGalery", deleteGalery);
        setDisplayDeleteDialog(false);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    getAllGaleries();
  }, []);

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper">
        <div className="formWrapper menu">
          <Toast ref={toast}></Toast>
          <div className="title">
            <h2>Menus Table</h2>

            <div className="card">
              <DataTable
                value={allGalleries}
                paginator
                rows={5}
                rowsPerPageOptions={(5, 10, 15, 20)}
              >
                <Column field="name" header="Name" style={{ width: "33%" }} />
                <Column
                  field="createdAt"
                  header="CreatedAt"
                  style={{ width: "33%" }}
                />
                <Column
                  field="createdAt"
                  header="Action"
                  body={actionTemplate}
                  style={{ width: "33%" }}
                />
              </DataTable>
            </div>
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
        Are you sure you want to delete this menu?
      </Dialog>
    </div>
  );
};
export default GalleriesTable;
