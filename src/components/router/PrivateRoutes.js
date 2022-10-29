import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export const PrivateRoutes = ({ children }) => {
  
  const users = useSelector(state => state.auth);
  // console.log("private ", users);
    
  return users.logged
  ? children
  : <Navigate to="/" />
}