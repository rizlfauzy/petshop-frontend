import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

export default function PrivateRoute({ children }) {
  const { item } = useSelector((state) => state.conf);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (item?.data?.cek_menu?.open == false) navigate("/", { replace: true, state: { from: location } });
  }, [item?.data?.cek_menu?.open, location, navigate]);

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
