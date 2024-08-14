import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { set_hide_all_modal } from "../hooks/useStore";
import { useLayoutEffect } from "react";

// halaman tidak ditemukan
export default function NotFound({ icon, title }) {
  const dispatch = useDispatch();

  // menutup semua modal yang mungkin terbuka
  useLayoutEffect(() => {
    dispatch(set_hide_all_modal());
  }, [dispatch]);
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <div className="col-full table-responsive">
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-8xl font-bold text-gray-500">404</h1>
            <p className="text-2xl font-semibold text-gray-500">Halaman tidak ditemukan</p>
          </div>
        </div>
      </div>
    </>
  );
}

NotFound.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
