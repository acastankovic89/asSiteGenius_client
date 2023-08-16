import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import "../../Articles/AddNewArticle/AddNewArticle.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

const CategoriesTable = () => {
  const [categoriesAll, setCategoriesAll] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const toast = useRef(null);

  const getAllCategories = async () => {
    try {
      const findAllCategories = await axios.get(
        "http://localhost:8080/categories/getAllCategories"
      );
      setCategoriesAll(findAllCategories.data);
    } catch (error) {}
  };

  const setCategoriesData = (data) => {
    return data.map((category) => ({
      id: category.id,
      title: category.title,
      category: category.parentId
        ? setParentCategoryName(category)
        : "No Category",
    }));
  };

  const setParentCategoryName = (category) => {
    var categoryTitle;
    categoriesAll.forEach((cat) => {
      if (cat.id === category.parentId) {
        categoryTitle = cat.title;
      }
    });
    return categoryTitle;
  };

  const handleDelete = (data) => {
    setSelectedCategoryId(data);
    setDisplayDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteCategory = await axios.delete(
        `http://localhost:8080/categories/${selectedCategoryId}`
      );
      console.log("deleteCategory", deleteCategory);
      setDisplayDeleteDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: deleteCategory.data.message,
      });
      getAllCategories();
    } catch (error) {
      if (error) {
        console.log("Error:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while deleting the article",
        });
      }
    }
  };

  const actionTemplate = (rowData) => {
    return (
      <div>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-secondary p-mr-2"
          onClick={confirmDelete} // Define your edit action function
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
    getAllCategories();
  }, []);

  useEffect(() => {
    setCategoriesData(categoriesAll);
  }, [categoriesAll]);

  return (
    <div className="addNew">
      <AdminTopBar />
      <AdminSidebar />
      <div className="addNewWrapper">
        <div className="formWrapper">
          <Toast ref={toast} />

          <div className="title">
            <h2>Categories Table</h2>
            <div className="card">
              <DataTable
                value={setCategoriesData(categoriesAll)}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column
                  field="title"
                  header="Title"
                  style={{ width: "40%" }}
                ></Column>
                <Column
                  field="category"
                  header="Category"
                  style={{ width: "40%" }}
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
        Are you sure you want to delete this article?
      </Dialog>
    </div>
  );
};
export default CategoriesTable;
