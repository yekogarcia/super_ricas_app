import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { checkLogIn } from "../../controllers/auth";
import { Dasbohard } from "../Dasbohard/Dasbohard";
import { Login } from "../Login/Login";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const Routers = () => {
const dispatch = useDispatch();
const user = useSelector((state) => state.auth);
console.log(user);

useEffect(() => {
  dispatch(checkLogIn(user))
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
