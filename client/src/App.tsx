
import "./App.css"

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RecipeDetail from "./pages/RecipeDetails";
import Search from "./pages/Search"
import Login from "./pages/Auth"
import Layout from "./components/Layout";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import UploadRecipe from "./pages/UploadRecipe";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import CategoriesPage from "./pages/Categories";

export default function App() {
  return (
    
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:category_id" element={<CategoriesPage />} />
            <Route path="/auth" element={<Login />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route
              path="/upload-recipe"
              element={
                <ProtectedRoute>
                  <UploadRecipe />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}