import Main from "./templates/main/Main";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";

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
              <Dashboard icon={<i className="fal fa-chart-pie fa-lg text-[22px]"></i>} title={"DASHBOARD"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}password`}
          element={
            <Main title={"GANTI PASSWORD"}>
              <ChangePassword icon={<i className="fal fa-chart-pie fa-lg text-[22px]"></i>} title={"GANTI PASSWORD"} />
            </Main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
