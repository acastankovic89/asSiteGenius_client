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

const UpdateMenuItems = () => {
  const navigate = useNavigate();
  const [menuItem, setMenuItem] = useState();
  const [menuId, setMenuId] = useState(0);
  const { id } = useParams();
  const toast = useRef();
  const [selectedType, setSelectedType] = useState(3);
  const [menuItemName, setMenuItemName] = useState("");
  const [allArticles, setAllArticles] = useState([]);
  const [menuItemUrl, setMenuItemUrl] = useState();
  const [targetId, setTargetId] = useState(0);
  const [parentId, setParentId] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState();

  useEffect(() => {
    if (
      (menuItem && menuItem.name) ||
      (menuItem && menuItem.url) ||
      (menuItem && menuItem.parentId) ||
      (menuItem && menuItem.menuId) ||
      (menuItem && menuItem.type)
    ) {
      setMenuItemName(menuItem.name);
      setMenuItemUrl(menuItem.url);
      setParentId(menuItem.parentId);
      setSelectedType(menuItem.type);
      setMenuId(menuItem.menuId);
      setTargetId(menuItem.targetId);
      getAllMenuItems();
    }
  }, [menuItem]);

  useEffect(() => {
    if (menuId !== 0) {
      getAllMenuItems(); // Only call when menuId is set
    }
  }, [menuId]);

  const getMenuItem = async () => {
    try {
      const item = await axios.get(`http://localhost:8080/menu-items/${id}`);
      if (item) {
        setMenuItem(item.data.response[0]);
      }
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  const getAllMenuItems = async () => {
    try {
      const getAllMenuItems = await axios.get(
        `http://localhost:8080/menu-items/current/${menuId}`
      );
      setAllMenuItems(getAllMenuItems.data.response);
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
    getMenuItem();
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
  console.log("allMenuItems", allMenuItems);
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
          options={menuItemOptions ? menuItemOptions[0] : ""}
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

  const handleForm = async () => {
    const formData = {
      menuId: menuItem.menuId,
      targetId: targetId,
      type: selectedType,
      url: menuItemUrl,
      parentId: parentId,
      name: menuItemName,
    };

    console.log("formData", formData);

    try {
      const addMenuItem = await axios.patch(
        `http://localhost:8080/menu-items/${id}`,
        formData
      );
      console.log("addMenuItem", addMenuItem);
      if (addMenuItem.data.status === 200) {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: addMenuItem.data.message,
        });
        setTimeout(() => {
          navigate(`/menus/createMenuItems/${menuItem.menuId}`);
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
              <label htmlFor="languageSelector">Menu item type</label>
              <Dropdown
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.value)}
                options={menuItemType}
                optionLabel="type"
                placeholder="Select Type"
                className="w-full md:w-14rem"
              />
            </div>
            {selectedType === 1 ? articlesDropdown() : ""}
            {selectedType === 2 ? categoriesDropdown() : ""}
            {selectedType === 3 ? urlInput() : ""}
            {parentId ? parentIdDropdown() : parentIdDropdown()}
          </div>
        </div>
        <div className="rightSideBar menu">
          <div className="buttonWrapper">
            <Button label="Update Menu item" onClick={handleForm} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateMenuItems;
