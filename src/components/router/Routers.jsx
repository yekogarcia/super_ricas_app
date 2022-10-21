import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { checkLogIn } from "../../controllers/auth";
import { Dasbohard } from "../Dasbohard/Dasbohard";
import { Login } from "../Login/Login";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const Routers = () => {
const dispatch = useDispatch();

useEffect(() => {
  dispatch(checkLogIn())
}, [dispatch])


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
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
