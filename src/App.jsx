import Main from "./templates/main/Main";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import MasterGrup from "./pages/MasterGrup";
import MasterUser from "./pages/MasterUser";

const { VITE_PREFIX } = import.meta.env;

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`${VITE_PREFIX}login`} element={<Login />} />
        <Route
          path={VITE_PREFIX}
          element={
            <Main title={"DASHBOARD"}>
              <Dashboard icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"DASHBOARD"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}password`}
          element={
            <Main title={"GANTI PASSWORD"}>
              <ChangePassword icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"GANTI PASSWORD"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-grup`}
          element={
            <Main title={"MASTER GRUP"}>
              <MasterGrup icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER GRUP"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-user`}
          element={
            <Main title={"MASTER USER"}>
              <MasterUser icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER USER"} />
            </Main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
