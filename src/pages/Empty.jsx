import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { set_hide_all_modal } from "../hooks/useStore";
import { useLayoutEffect } from "react";

export default function Empty({ icon, title }) {
  const dispatch = useDispatch();

  // menutup semua modal yang mungkin terbuka
  useLayoutEffect(() => {
    dispatch(set_hide_all_modal());
  }, [dispatch]);
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <div className="col-full table-responsive">

      </div>
    </>
  );
}

Empty.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
