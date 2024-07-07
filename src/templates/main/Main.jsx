import { Navigate, useLocation } from "react-router-dom";
import useSession from "../../hooks/useSession";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";
import Loading from "../../components/Loading";
import { useLayoutEffect } from "react";

const { VITE_PREFIX } = import.meta.env;

export default function Main({ children, title }) {
  const { session } = useSession();
  const location = useLocation();

  useLayoutEffect(() => {
    const btn_save = document.querySelector("#save");
    const btn_update = document.querySelector("#update");
    const btn_cancel = document.querySelector("#cancel");
    const btn_find = document.querySelector("#find");
    const btn_clear = document.querySelector("#clear");

    const on_keydown = (e) => {
      if ((e.ctrlKey && e.key === "1") && btn_save) {
        e.preventDefault();
        btn_save.click();
      } else if ((e.ctrlKey && e.key === "2") && btn_update) {
        e.preventDefault();
        btn_update.click();
      } else if ((e.ctrlKey && e.key === "3") && btn_cancel) {
        e.preventDefault();
        btn_cancel.click();
      } else if (e.ctrlKey && e.key === "4") {
        e.preventDefault();
        btn_find.click();
      } else if (e.ctrlKey && e.key === "5") {
        e.preventDefault();
        btn_clear.click();
      }
    }
    btn_save && document.addEventListener("keydown", on_keydown)
    btn_update && document.addEventListener("keydown", on_keydown)
    btn_cancel && document.addEventListener("keydown", on_keydown)

    return () => {
      btn_save && document.removeEventListener("keydown", on_keydown)
      btn_update && document.removeEventListener("keydown", on_keydown)
      btn_cancel && document.removeEventListener("keydown", on_keydown)
    }
  })
  return (
    <>
      {!session && <Navigate to={`${VITE_PREFIX}login`} replace state={{ from: location }} />}
      <Header title={title} />
      <Loading />
      <div className="app-admin-wrap layout-sidebar-large">
        <Sidebar />
        <div className="main-content-wrap sidenav" style={{ width: "calc(100% - 78px)", marginTop: 0 }}>
          <div className="main-content">{children}</div>
          <div className="flex-grow-1"></div>
          <Footer />
        </div>
      </div>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};
