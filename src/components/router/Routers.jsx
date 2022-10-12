import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dasbohard } from "../Dasbohard/Dasbohard";
import { Login } from "../Login/Login";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/ad/*"
          element={
            <PrivateRoutes>
              <Dasbohard />
            </PrivateRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
