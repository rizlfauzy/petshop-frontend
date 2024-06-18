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
            <Main title={"Dashboard"}>
              <Dashboard />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}password`}
          element={
            <Main title={"Ganti Password"}>
              <ChangePassword icon={<i className="fal fa-chart-pie fa-lg text-[22px]"></i>} title={"Ganti Password"} />
            </Main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
