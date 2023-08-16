import React, { useEffect, useRef, useState } from "react";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import "../AddNewArticle/AddNewArticle.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

const ArticlesTable = () => {
  const [articlesAll, setArticlesAll] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const toast = useRef(null);
  console.log("articlesAll", articlesAll);

  const getAllArticles = async () => {
    try {
      const findAllArticles = await axios.get("http://localhost:8080/articles");
      setArticlesAll(findAllArticles.data.response);
      console.log("findAllArticles", findAllArticles);
    } catch (error) {}
  };

  const setArticlesData = (test) => {
    console.log("test", test);
    return test.map((article) => ({
      id: article.id,
      title: article.title,
      category: article.category ? article.category.title : "No Category",
    }));
  };

  const handleDelete = (data) => {
    setSelectedArticleId(data);
    setDisplayDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteArticle = await axios.delete(
        `http://localhost:8080/articles/${selectedArticleId}`
      );
      console.log("deleteArticle", deleteArticle);
      setDisplayDeleteDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Article deleted successfully",
      });
      getAllArticles();
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
    console.log("rowData", rowData);
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
    getAllArticles();
  }, []);

  useEffect(() => {
    setArticlesData(articlesAll);
  }, [articlesAll]);

  return (
    <div className="addNew">
      <AdminTopBar />
      <AdminSidebar />
      <div className="addNewWrapper">
        <div className="formWrapper">
          <Toast ref={toast} />

          <div className="title">
            <h2>Articles Table</h2>
            <div className="card">
              <DataTable
                value={setArticlesData(articlesAll)}
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
export default ArticlesTable;
