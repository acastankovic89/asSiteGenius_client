import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import axios from "axios";
import { Tree } from "primereact/tree";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

const MenuItems = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef();
  const [selectedType, setSelectedType] = useState(3);
  const [menuItemName, setMenuItemName] = useState("");
  const [allArticles, setAllArticles] = useState([]);
  const [menuItemUrl, setMenuItemUrl] = useState();
  const [targetId, setTargetId] = useState(0);
  const [parentId, setParentId] = useState(null);
  console.log("parentId", parentId);
  const [allCategories, setAllCategories] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState();
  const [menuItemsTree, setMenuItemsTree] = useState(null);
  const [nodes, setNodes] = useState();
  const [menusItemData, setMenusItemData] = useState();
  console.log("nodes", nodes);
  const [expandedKeys, setExpandedKeys] = useState({ 0: true, "0-0": true });
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
  console.log("selectedMenuItemId", selectedMenuItemId);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);

  const expandAll = () => {
    let _expandedKeys = {};

    for (let node of nodes) {
      expandNode(node, _expandedKeys);
    }

    setExpandedKeys(_expandedKeys);
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const expandNode = (node, _expandedKeys) => {
    if (node.children && node.children.length) {
      _expandedKeys[node.key] = true;

      for (let child of node.children) {
        expandNode(child, _expandedKeys);
      }
    }
  };

  const nodeTemplate = (node) => {
    console.log("node", node);
    return (
      <span>
        {node.name + " url: "}
        {node.url}
      </span>
    );
  };

  const getAllMenuItems = async () => {
    try {
      const getAllMenuItems = await axios.get(
        `http://localhost:8080/menu-items/current/${id}`
      );

      console.log("getAllMenuItems", getAllMenuItems);
      setAllMenuItems(getAllMenuItems.data.response);
    } catch (error) {
      if (error) console.log("Error:", error);
    }
  };

  const getAllMenuItemsTree = async () => {
    try {
      const getAllMenuItemsTree = await axios.get(
        `http://localhost:8080/menu-items/menuItemsTree/${id}`
      );

      console.log("getAllMenuItemsTree", getAllMenuItemsTree);
      setNodes(getAllMenuItemsTree.data);
    } catch (error) {
      if (error) console.log("Error:", error);
    }
  };

  const getAllArticles = async () => {
    try {
      const getAll = await axios.get("http://localhost:8080/articles");
      setAllArticles(getAll.data.response);
    } catch (error) {
      if (error) console.log("Error:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const getAll = await axios.get(
        "http://localhost:8080/categories/getAllCategories"
      );
      setAllCategories(getAll.data);
    } catch (error) {
      if (error) console.log("Error:", error);
    }
  };

  useEffect(() => {
    getAllArticles();
    getAllCategories();
    getAllMenuItems();
    getAllMenuItemsTree();
  }, []);

  const menuItemType = [
    { type: "Article", value: 1 },
    { type: "Category", value: 2 },
    { type: "URL", value: 3 },
    { type: "Separator", value: 4 },
  ];

  var articleOptions;

  if (allArticles) {
    articleOptions = [
      allArticles.map((article) => ({
        article: article.title,
        value: article.id,
        slug: article.slug,
      })),
    ];
  }

  var categoriesOption;

  if (allCategories) {
    categoriesOption = [
      allCategories.map((category) => ({
        category: category.title,
        value: category.id,
        slug: category.slug,
      })),
    ];
  }

  var menuItemOptions;

  if (allMenuItems) {
    menuItemOptions = [
      allMenuItems.map((menuItem) => ({
        name: menuItem.name,
        value: menuItem.id,
      })),
    ];
  }

  const articlesDropdown = () => {
    return (
      <div className="input-wrapper">
        <label htmlFor="languageSelector">Select Article</label>
        <Dropdown
          id="type"
          value={targetId}
          onChange={(e) => setTargetId(e.value)}
          options={articleOptions[0]}
          optionLabel="article"
          placeholder="Select Article"
          className="w-full md:w-14rem"
        />
      </div>
    );
  };

  const setArticlesOrCategoryUrl = () => {
    if (selectedType === 1) {
      articleOptions[0].map((article) => {
        if (article.value === targetId) {
          setMenuItemUrl(`articles/${article.slug}`);
        }
      });
    } else if (selectedType === 2) {
      categoriesOption[0].map((category) => {
        if (category.value === targetId) {
          setMenuItemUrl(`categories/${category.slug}`);
        }
      });
    }
  };

  useEffect(() => {
    setArticlesOrCategoryUrl();
  }, [targetId]);

  const categoriesDropdown = () => {
    return (
      <div className="input-wrapper">
        <label htmlFor="languageSelector">Select Category</label>
        <Dropdown
          id="type"
          value={targetId}
          onChange={(e) => setTargetId(e.value)}
          options={categoriesOption[0]}
          optionLabel="category"
          placeholder="Select Language"
          className="w-full md:w-14rem"
        />
      </div>
    );
  };

  const parentIdDropdown = () => {
    return (
      <div className="input-wrapper">
        <label htmlFor="languageSelector">Select Parent</label>
        <Dropdown
          id="type"
          value={parentId}
          onChange={(e) => setParentId(e.value)}
          options={menuItemOptions[0]}
          optionLabel="name"
          placeholder="Select Parent"
          className="w-full md:w-14rem"
        />
      </div>
    );
  };

  const urlInput = () => {
    return (
      <div className="input-wrapper">
        <label htmlFor="languageSelector">URL</label>
        <InputText
          id="url"
          className="p-inputtext-lg"
          aria-describedby="username-help"
          onChange={(event) => setMenuItemUrl(event.target.value)}
          value={menuItemUrl}
        />
      </div>
    );
  };

  const redirectToUpdate = (data) => {
    navigate(`/menus/updateMenuItems/${data}`);
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

  const handleDelete = (data) => {
    setSelectedMenuItemId(data);
    setDisplayDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const deleteMenuItem = await axios.delete(
        `http://localhost:8080/menu-items/${selectedMenuItemId}`
      );
      console.log("deleteMenuItem", deleteMenuItem);
      setDisplayDeleteDialog(false);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Menu item deleted successfully",
      });
      getAllMenuItems();
    } catch (error) {
      if (error) {
        console.log("Error:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while deleting menu item",
        });
      }
    }
  };

  const handleForm = async () => {
    const formData = {
      menuId: id,
      targetId: targetId,
      type: selectedType,
      url: menuItemUrl,
      parentId: parentId,
      name: menuItemName,
    };

    try {
      const addMenuItem = await axios.post(
        "http://localhost:8080/menu-items",
        formData
      );
      if (addMenuItem.data.status === 200) {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: addMenuItem.data.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.current.show({
          severity: "info",
          summary: "Rejected",
          detail: addMenuItem.data.message,
        });
      }
    } catch (error) {
      if (error) console.log("Error:", error);
    }
  };

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper menu-items">
        <Toast ref={toast}></Toast>
        <div className="formWrapper menu">
          <div className="form menu-input">
            <div className="input-wrapper">
              <label htmlFor="name">Menu item name</label>
              <InputText
                id="name"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setMenuItemName(event.target.value)}
                value={menuItemName}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="languageSelector">Menu lLanguage</label>
              <Dropdown
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.value)}
                options={menuItemType}
                optionLabel="type"
                placeholder="Select Language"
                className="w-full md:w-14rem"
              />
            </div>
            {selectedType === 1 ? articlesDropdown() : ""}
            {selectedType === 2 ? categoriesDropdown() : ""}
            {selectedType === 3 ? urlInput() : ""}
            {allMenuItems && allMenuItems.length > 0 ? parentIdDropdown() : ""}
          </div>
        </div>
        <div className="rightSideBar menu">
          <div className="buttonWrapper">
            <Button label="Save Menu item" onClick={handleForm} />
          </div>
        </div>
      </div>
      <div className="adminWrapper menuItemsWrapper">
        <div className="formWrapper menu">
          <div className="card">
            <DataTable
              value={allMenuItems}
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
      <div className="adminWrapper menu-items">
        <div className="formWrapper menu">
          <div className="form">
            <div className="card flex flex-column align-items-center">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="Expand All"
                  onClick={expandAll}
                />
                <Button
                  type="button"
                  icon="pi pi-minus"
                  label="Collapse All"
                  onClick={collapseAll}
                />
              </div>

              <Tree
                value={nodes}
                expandedKeys={expandedKeys}
                onToggle={(e) => setExpandedKeys(e.value)}
                className="w-full md:w-30rem"
                nodeTemplate={nodeTemplate}
              />
              <div className="card flex justify-content-center"></div>
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
export default MenuItems;
