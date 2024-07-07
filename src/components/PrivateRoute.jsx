import { Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function PrivateRoute({ children }) {
  const { item } = useSelector((state) => state.conf);
  const [isAuth] = useState(item?.data?.cek_menu?.open);
  const location = useLocation();
  return isAuth ? children : <Navigate to="/" replace state={{ from: location }} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};