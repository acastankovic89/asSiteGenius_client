import React, { useState, useEffect, useRef } from "react";
import AdminTopBar from "../../AdminTopBar/AdminTopBar";
import AdminSidebar from "../../AdminSidebar/AdminSidebar";
import "../../Articles/AddNewArticle/AddNewArticle.css";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import axios from "axios";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { TreeSelect } from "primereact/treeselect";
import CategoryTree from "./CategoryTree";

const AddNewCategory = () => {
  const [parentId, setParentId] = useState(null);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(null);
  console.log("parentId", parentId);
  const [formatedDate, setFormatedDate] = useState(getTodayDate());
  const [publishedCheck, setPublishedCheck] = useState(false);
  const [published, setPublished] = useState(0);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [introText, setIntroText] = useState("");
  const [slug, setSlug] = useState("");
  const toast = useRef(null);
  const [introImagetotalSize, setIntroImageTotalSize] = useState(0);
  const introImageUploadRef = useRef(null);
  const [introImageName, setIntroImageName] = useState("");
  const [mainImagetotalSize, setMainImageTotalSize] = useState(0);
  const mainImageUploadRef = useRef(null);
  const [mainImageName, setMainImageName] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  console.log("allCategory", allCategory);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const createNestedOptions = (categories) => {
    return categories.map((category) => ({
      label: category.title,
      value: category.id,
      children: category.children ? createNestedOptions(category.children) : [],
    }));
  };

  const setCategoryTree = (categoryTree) => {
    console.log("categoryTree", categoryTree);
    return categoryTree.map((category) => {
      console.log("cat", category);
      const hasParent = category.parentId;
      const categoryClassName = hasParent ? "haveParent" : "";

      if (category.children && category.children.length > 0) {
        return (
          <div
            className={`parentCategory ${categoryClassName}`}
            key={category.title}
          >
            <p
              className={`categorySelector ${
                parentId === category.id ? "selected" : ""
              }`}
              key={category.value}
              onClick={() => setParentId(category.id)}
            >
              {category.title}
            </p>
            {setCategoryTree(category.children)}
          </div>
        );
      } else {
        return (
          <div className={`category ${categoryClassName}`} key={category.title}>
            <p
              className={`categorySelector ${
                parentId === category.id ? "selected" : ""
              }`}
              onClick={() => setParentId(category.id)}
              key={category.title}
            >
              {category.title}
            </p>
          </div>
        );
      }
    });
  };

  console.log("terrr", setCategoryTree(allCategory));

  const formattedCategoryOptions = createNestedOptions(allCategory);

  const fetchAllCategories = async () => {
    try {
      const fetch = await axios.get("http://localhost:8080/categories");
      console.log("fetch", fetch);
      setAllCategory(fetch.data);
    } catch (error) {
      if (error) {
        console.log("Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const onIntroImageTemplateSelect = (e) => {
    setIntroImageName(e.files[0].name);
    let _totalSize = introImagetotalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    console.log("_totalSize", _totalSize);

    setIntroImageTotalSize(_totalSize);
  };

  const onMainImageTemplateSelect = (e) => {
    setMainImageName(e.files[0].name);
    let _totalSize = mainImagetotalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    console.log("_totalSize", _totalSize);

    setIntroImageTotalSize(_totalSize);
  };

  const onIntroImageTemplateUpload = async (e) => {
    console.log("e", e);
    console.log("test onTemplateUpload ");
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setIntroImageTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onMainImageTemplateUpload = async (e) => {
    console.log("e", e);
    console.log("test onTemplateUpload ");
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setMainImageTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onIntroImageTemplateRemove = (file, callback) => {
    setIntroImageTotalSize(introImagetotalSize - file.size);
    callback();
  };

  const onMainImageTemplateRemove = (file, callback) => {
    setMainImageTotalSize(mainImagetotalSize - file.size);
    callback();
  };

  const onIntroImageTemplateClear = () => {
    setIntroImageTotalSize(0);
  };

  const onMainImageTemplateClear = () => {
    setMainImageTotalSize(0);
  };

  const headerIntroImageTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = introImagetotalSize / 1000000;
    const formatedValue =
      introImageUploadRef && introImageUploadRef.current
        ? introImageUploadRef.current.formatSize(introImagetotalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const headerMainImageTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = mainImagetotalSize / 1000000;
    const formatedValue =
      introImageUploadRef && introImageUploadRef.current
        ? introImageUploadRef.current.formatSize(mainImagetotalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemIntroImageTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const itemMainImageTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyIntroImageTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        {introImageName ? (
          ""
        ) : (
          <i
            className="pi pi-image mt-3 p-5"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
            }}
          ></i>
        )}
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          {introImageName ? (
            <img
              style={{ width: "100%" }}
              src={`http://localhost:8080/uploads/thumbs/${introImageName}`}
            />
          ) : (
            "Drag and Drop Image Here"
          )}
        </span>
      </div>
    );
  };

  const emptyMainImageTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        {mainImageName ? (
          ""
        ) : (
          <i
            className="pi pi-image mt-3 p-5"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
            }}
          ></i>
        )}
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          {mainImageName ? (
            <img
              style={{ width: "100%" }}
              src={`http://localhost:8080/uploads/${mainImageName}`}
            />
          ) : (
            "Drag and Drop Image Here"
          )}
        </span>
      </div>
    );
  };

  const chooseButton = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadButton = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelButton = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const handleForm = async () => {
    const capitalizedTitle = title.toLowerCase();

    const slug = capitalizedTitle.replace(/\s/g, "_");

    setSlug(slug);

    const formData = {
      title: title,
      subtitle: subtitle,
      introText: introText,
      published: published,
      content: content,
      slug: slug,
      introImage: introImageName,
      mainImage: mainImageName,
      publishDate: formatedDate,
      parentId: parentId,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/categories/add-category",
        formData
      );
      if ((response.data.status = 200)) {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: response.data.message,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.current.show({
          severity: "info",
          summary: "Rejected",
          detail: "Error",
        });
      }
      console.log("response", response);
    } catch (error) {
      if (error) console.log("Error:", error);
    }

    // window.location.reload();
  };

  useEffect(() => {
    if (date !== null) {
      setFormatedDate(formatDate(date));
    }
  }, [date]);

  useEffect(() => {
    if (publishedCheck === true) {
      setPublished(1);
    } else {
      setPublished(0);
    }
  }, [publishedCheck]);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function formatDate(date) {
    const formattedDate = new Date(date);
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
    const day = String(formattedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="admin">
      <AdminTopBar />
      <AdminSidebar />
      <div className="adminWrapper">
        <div className="formWrapper">
          <div className="form">
            <div className="input-wrapper">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setTitle(event.target.value)}
                value={title}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="subtitle">Subtitle</label>
              <InputText
                id="subtitle"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setSubtitle(event.target.value)}
                value={subtitle}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="introText">Intro text</label>
              <InputText
                id="introText"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                onChange={(event) => setIntroText(event.target.value)}
                value={introText}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="slug">Slug</label>
              <InputText
                id="slug"
                className="p-inputtext-lg"
                aria-describedby="username-help"
                value={slug}
                disabled
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="author">Author</label>
              <InputText
                id="author"
                className="p-inputtext-lg"
                aria-describedby="username-help"
              />
            </div>
            <div className="editorWrapper">
              <label htmlFor="content">Content</label>
              <Editor
                id="content"
                value={content}
                onTextChange={(e) => setContent(e.htmlValue)}
                style={{ height: "320px" }}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="publicationDate">Publication Date</label>
              <Calendar value={date} onChange={(e) => setDate(e.value)} />
            </div>
            <div className="input-wrapper">
              <label htmlFor="author">Author</label>
              <InputText
                id="author"
                className="p-inputtext-lg"
                aria-describedby="username-help"
              />
            </div>
          </div>
        </div>
        <div className="rightSideBar">
          <div className="actionBar">
            <div className="controle">
              <p>Publish:</p>
              <Checkbox
                onChange={(e) => setPublishedCheck(e.checked)}
                checked={publishedCheck}
              ></Checkbox>
              <div className="buttonWrapper">
                <Button label="Save Article" onClick={handleForm} />
              </div>
            </div>
            <div className="introImageUpload">
              <p>Intro image:</p>
              <Toast ref={toast}></Toast>

              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-upload-btn"
                content="Upload"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />

              <FileUpload
                ref={introImageUploadRef}
                name="introImage"
                url="http://localhost:8080/file-upload/introImage"
                accept="image/*"
                maxFileSize={10000000}
                onUpload={onIntroImageTemplateUpload}
                onSelect={onIntroImageTemplateSelect}
                onError={onIntroImageTemplateClear}
                onClear={onIntroImageTemplateClear}
                headerTemplate={headerIntroImageTemplate}
                itemTemplate={itemIntroImageTemplate}
                emptyTemplate={emptyIntroImageTemplate}
                chooseOptions={chooseButton}
                uploadOptions={uploadButton}
                cancelOptions={cancelButton}
              />
            </div>
            <div className="mainImageUpload">
              <p>Main image:</p>
              <Toast ref={toast}></Toast>

              <Tooltip
                target=".custom-choose-btn"
                content="Choose"
                position="bottom"
              />
              <Tooltip
                target=".custom-upload-btn"
                content="Upload"
                position="bottom"
              />
              <Tooltip
                target=".custom-cancel-btn"
                content="Clear"
                position="bottom"
              />

              <FileUpload
                ref={mainImageUploadRef}
                name="mainImage"
                url="http://localhost:8080/file-upload/mainImage"
                accept="image/*"
                maxFileSize={10000000}
                onUpload={onMainImageTemplateUpload}
                onSelect={onMainImageTemplateSelect}
                onError={onMainImageTemplateClear}
                onClear={onMainImageTemplateClear}
                headerTemplate={headerMainImageTemplate}
                itemTemplate={itemMainImageTemplate}
                emptyTemplate={emptyMainImageTemplate}
                chooseOptions={chooseButton}
                uploadOptions={uploadButton}
                cancelOptions={cancelButton}
              />
            </div>
            <div className="selectCategory">
              <div className="card flex justify-content-center">
                <p
                  className={`categorySelector ${
                    parentId === null ? "selected" : ""
                  }`}
                  onClick={() => setParentId(null)}
                >
                  No category
                </p>
                {setCategoryTree(allCategory)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddNewCategory;
