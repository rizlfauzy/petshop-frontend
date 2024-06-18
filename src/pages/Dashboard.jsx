import { Navigate, useLocation } from "react-router-dom";
import useSession from "../hooks/useSession";
import Header from "../templates/main/Header";
import Footer from "../templates/main/Footer";
import Sidebar from "../templates/main/Sidebar";

const { VITE_PREFIX } = import.meta.env;

export default function Dashboard() {
  const { session } = useSession();
  const location = useLocation();
  return (
    <>
      {!session && <Navigate to={`${VITE_PREFIX}login`} replace state={{ from: location }} />}
      <Header title="Dashboard" />
      <div className="app-admin-wrap layout-sidebar-large">
        <Sidebar />
        <div className="main-content-wrap sidenav" style={{ width: "calc(100% - 78px)", marginTop: 0 }}>
          <div className="main-content"></div>
          <div className="flex-grow-1"></div>
          <Footer />
        </div>
      </div>
    </>
  );
}
