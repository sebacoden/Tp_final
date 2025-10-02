import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./features/layout/layout";
import { LoginPage } from "./features/login/LoginPage";

export const AppRoutes = () =>
  <Routes>
    <Route path="/" element={<Layout />} />
    <Route path="/auth/:mode" element={<LoginPage/>}/>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>