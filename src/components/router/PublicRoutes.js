import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const PublicRoutes = ({ children }) => {
    const users = useSelector(state => state.auth);

    return users.logged
        ? <Navigate to="/ad" />
        : children

};