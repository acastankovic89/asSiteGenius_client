import React, { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Tree } from "primereact/tree";
import { classNames } from "primereact/utils";

const AdminSidebar = () => {
  const [visibleMenu, setVisibleMenu] = useState(true);

  const rootUrl = window.location.origin;

  const sidebarItems = [
    {
      key: "0",
      label: "Articles",
      children: [
        {
          key: "0-0",
          childrenLabel: "Table",
          url: `${rootUrl}/articles/articlesTable`,
        },
        {
          key: "0-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/articles/addNewArticle`,
        },
      ],
    },
    {
      key: "1",
      label: "Categories",
      children: [
        {
          key: "1-0",
          childrenLabel: "Table",
          url: `${rootUrl}/categories/categoriesTable`,
        },
        {
          key: "1-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/categories/addNewCategory`,
        },
      ],
    },
    {
      key: "2",
      label: "Menus",
      children: [
        {
          key: "2-0",
          childrenLabel: "Table",
          url: `${rootUrl}/menus/menusTable`,
        },
        {
          key: "2-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/menus/addNewMenu`,
        },
      ],
    },
    {
      key: "3",
      label: "Slider",
      children: [
        {
          key: "3-0",
          childrenLabel: "Table",
          url: `${rootUrl}/slider/slidersTable`,
        },
        {
          key: "3-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/slider/addNewSlider`,
        },
      ],
    },
    {
      key: "4",
      label: "Users",
      children: [
        {
          key: "4-0",
          childrenLabel: "Table",
          url: `${rootUrl}/users/usersTable`,
        },
        {
          key: "4-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/users/addNewUser`,
        },
      ],
    },
    {
      key: "5",
      label: "Galleries",
      children: [
        {
          key: "5-0",
          childrenLabel: "Table",
          url: `${rootUrl}/gallery/galleriesTable`,
        },
        {
          key: "5-1",
          childrenLabel: "Add new",
          url: `${rootUrl}/gallery/addNewGallery`,
        },
      ],
    },
  ];

  const sideBarTemplate = (items, options) => {
    let label = <b>{items.label}</b>;
    if (items.url) {
      label = (
        <a
          href={items.url}
          className="text-primary hover:underline font-semibold"
        >
          {items.childrenLabel}
        </a>
      );
      return <span className={options.className}>{label}</span>;
    }
  };

  const togglerTemplate = (items, options) => {
    if (!items) {
      return;
    }

    const expanded = options.expanded;
    const isCategory = items.key.startsWith("1");
    const isArticle = items.key.startsWith("0");
    const isMenu = items.key.startsWith("2");
    const isSlider = items.key.startsWith("3");
    const isUser = items.key.startsWith("4");
    const isGallery = items.key.startsWith("5");
    const iconClassName = classNames("p-tree-toggler-icon pi pi-fw", {
      "pi-clone": isCategory && !expanded,
      "pi-file": isArticle && !expanded,
      "pi-bars": isMenu && !expanded,
      "pi-sliders-h": isSlider && !expanded,
      "pi-user": isUser && !expanded,
      "pi-image": isGallery && !expanded,
      "pi-caret-down": expanded,
    });
    return (
      <>
        <button
          type="button"
          className="p-tree-toggler p-link"
          tabIndex={-1}
          onClick={options.onClick}
          label={sidebarItems.label}
        >
          <span className={iconClassName} aria-hidden="true"></span>
        </button>
        <p> {items.label}</p>
      </>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <Sidebar
        visible={visibleMenu}
        onHide={() => setVisibleMenu(false)}
        className="w-full md:w-20rem lg:w-30rem"
      >
        <h2>Sidebar</h2>

        <div className="card flex justify-content-center">
          <Tree
            value={sidebarItems}
            nodeTemplate={sideBarTemplate}
            togglerTemplate={togglerTemplate}
            className="w-full md:w-30rem"
          />
        </div>
      </Sidebar>
      <Button
        icon="pi pi-arrow-right"
        onClick={() => setVisibleMenu(true)}
        label="Sidebar"
      />
    </div>
  );
};
export default AdminSidebar;
