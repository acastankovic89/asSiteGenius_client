import React, { useEffect, useRef, useState } from "react";
import "../Articles/AddNewArticle/AddNewArticle.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import AdminTopBar from "../AdminTopBar/AdminTopBar";
import { Tooltip } from "primereact/tooltip";

const MenusTable = () => {
  const [menusAll, setMenusAll] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  const getAllMenus = async () => {
    try {
      const findAllMenus = await axios.get("http://localhost:8080/menus");
      setMenusAll(findAllMenus.data.response);
    } catch (error) {}
  };

  const setMenusData = (data) => {
    return data.map((menu) => ({
      id: menu.id,
      languageId: menu.languageId,
      name: menu.name,
    }));
  };

  const handleDelete = (data) => {
    setSelectedArticleId(data);
    setDisplayDeleteDialog(true);
  };

  const redirectToUpdate = (data) => {
    navigate(`/menus/createMenuItems/${data}`);
  };

  const confirmDelete = async () => {
    try {
      const deleteMenu = await axios.delete(
        `http://localhost:8080/menus/${selectedArticleId}`
      );
      if (deleteMenu) {
        setDisplayDeleteDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Menu deleted successfully",
        });
        getAllMenus();
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while deleting menu",
        });
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-fw pi-plus-circle"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={() => redirectToUpdate(rowData.id)}
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

  useEffect(() => {
    getAllMenus();
  }, []);

  useEffect(() => {
    setMenusData(menusAll);
  }, [menusAll]);

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper">
        <div className="formWrapper">
          <Toast ref={toast} />

          <div className="title">
            <h2>Menus Table</h2>
            <div className="card">
              <DataTable
                value={setMenusData(menusAll)}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="name"
                  header="Name"
                  style={{ width: "40%" }}
                ></Column>
                <Column
                  field="parentId"
                  header="Actions"
                  value={"id"}
                  body={actionTemplate}
                  style={{ width: "20%" }}
                ></Column>
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
export default MenusTable;
