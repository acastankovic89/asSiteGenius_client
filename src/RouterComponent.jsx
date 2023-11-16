import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdmin from "./components/SuperAdmin/SuperAdmin";
import AdminLogIn from "./components/AdminLogIn/AdminLogIn";
import AdminHome from "./components/AdminHome/AdminHome";
import AddNewArticle from "./components/Articles/AddNewArticle/AddNewArticle";
import ArticlesTable from "./components/Articles/ArticlesTable/ArticlesTable";
import AddNewCategory from "./components/Categories/AddNewCategory/AddNewCategory";
import CategoriesTable from "./components/Categories/CategoriesTable/CategoriesTable";
import UpdateArticle from "./components/Articles/UpdateArticle/UpdateArticle";
import UpdateCategory from "./components/Categories/UpdateCategory/UpdateCategory";
import AddNewMenu from "./components/Menus/AddNewMenu";
import MenusTable from "./components/Menus/MenusTable";
import MenuItems from "./components/Menus/MenuItems/MenuItems";
import UpdateMenuItems from "./components/Menus/MenuItems/UpdateMenuItems";
import SliderTable from "./components/Slider/SlidersTable";
import AddNewSlider from "./components/Slider/AddNewSlider";
import SliderItems from "./components/Slider/SliderItems/SliderItems";
import UpdateSliderItems from "./components/Slider/SliderItems/UpdateSliderItems";
import UserTable from "./components/User/UserTable";
import CreateUser from "./components/User/AddNewUser";
import AddNewUser from "./components/User/AddNewUser";
import UpdateUser from "./components/User/UpdateUser";
import AddNewGallery from "./components/Gallery/AddNewGallery";
import GalleriesTable from "./components/Gallery/GalleriesTable";
import UpdateGallery from "./components/Gallery/UpdateGallery";
import CreateGalleryItems from "./components/Gallery/GalleryItems/CreateGalleryItems";

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogIn />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/super_admin" element={<SuperAdmin />} />
        <Route path="articles/addNewArticle" element={<AddNewArticle />} />
        <Route path="categories/addNewCategory" element={<AddNewCategory />} />
        <Route path="menus/addNewMenu" element={<AddNewMenu />} />
        <Route path="articles/articlesTable" element={<ArticlesTable />} />
        <Route path="articles/updateArticle/:id" element={<UpdateArticle />} />
        <Route
          path="categories/updateCategory/:id"
          element={<UpdateCategory />}
        />
        <Route
          path="categories/categoriesTable"
          element={<CategoriesTable />}
        />
        <Route path="menus/menusTable" element={<MenusTable />} />
        <Route path="menus/createMenuItems/:id" element={<MenuItems />} />
        <Route path="menus/updateMenuItems/:id" element={<UpdateMenuItems />} />
        {/* sliders */}
        <Route path="/slider/addNewSlider" element={<AddNewSlider />} />
        <Route path="slider/slidersTable" element={<SliderTable />} />
        <Route path="slider/createSliderItems/:id" element={<SliderItems />} />
        <Route
          path="slider/updateSliderItems/:id"
          element={<UpdateSliderItems />}
        />

        <Route path="/users/addNewUser" element={<AddNewUser />} />
        <Route path="users/usersTable" element={<UserTable />} />
        <Route path="users/updateUser/:id" element={<UpdateUser />} />

        <Route path="/gallery/addNewGallery" element={<AddNewGallery />} />
        <Route path="/gallery/galleriesTable" element={<GalleriesTable />} />
        <Route path="/gallery/updateGallery/:id" element={<UpdateGallery />} />
        <Route
          path="/gallery/createGalleryItems/:id"
          element={<CreateGalleryItems />}
        />
      </Routes>
    </Router>
  );
};
