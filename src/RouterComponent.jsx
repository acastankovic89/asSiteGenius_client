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

export const RouterComponent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogIn />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/super_admin" element={<SuperAdmin />} />
        <Route path="articles/addNewArticle" element={<AddNewArticle />} />
        <Route path="categories/addNewCategory" element={<AddNewCategory />} />
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
      </Routes>
    </Router>
  );
};
