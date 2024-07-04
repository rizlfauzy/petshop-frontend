import { Navigate, useLocation } from "react-router-dom";
import useSession from "../../hooks/useSession";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import PropTypes from "prop-types";
import Loading from "../../components/Loading";

const { VITE_PREFIX } = import.meta.env;

export default function Main({ children, title }) {
  const { session } = useSession();
  const location = useLocation();
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
