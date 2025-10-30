import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./features/layout/layout";
import { LoginPage } from "./features/login/LoginPage";
import { PublicRoute } from "./features/login/components/PublicRoute";

export const AppRoutes = () =>
  <Routes>
    <Route path="/" element={<Layout />} />
    <Route 
      path="/auth/:mode" 
      element={
        <PublicRoute>
          <LoginPage/>
        </PublicRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>