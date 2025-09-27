import { Route, Routes } from "react-router-dom"
import Layout from "./features/layout/layout";

export const AppRoutes = () =>
  <Routes>
    <Route path="*" element={<Layout />} />
  </Routes>