import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children }) => {
    const users = useSelector(state => state.auth);
    console.log("public ", users);

    return users.logged
        ? <Navigate to="/ad" />
        : children

};