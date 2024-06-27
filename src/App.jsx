import Main from "./templates/main/Main";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import MasterGrup from "./pages/Master/MasterGrup";
import MasterUser from "./pages/Master/MasterUser";
import MasterSatuan from "./pages/Master/MasterSatuan";
import MasterKategori from "./pages/Master/MasterKategori";
import MasterBarang from "./pages/Master/MasterBarang";
import MasterOtorisasi from "./pages/Master/MasterOtorisasi";
import Pembelian from "./pages/Order/Pembelian";

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
          path={`${VITE_PREFIX}master-otorisasi`}
          element={
            <Main title={"MASTER OTORISASI"}>
              <MasterOtorisasi icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER OTORISASI"} />
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
        <Route
          path={`${VITE_PREFIX}master-satuan`}
          element={
            <Main title={"MASTER SATUAN"}>
              <MasterSatuan icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER SATUAN"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-kategori`}
          element={
            <Main title={"MASTER KATEGORI"}>
              <MasterKategori icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER KATEGORI"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-barang`}
          element={
            <Main title={"MASTER BARANG"}>
              <MasterBarang icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER BARANG"} />
            </Main>
          }
        />
        <Route
          path={`${VITE_PREFIX}order`}
          element={
            <Main title={"PEMBELIAN"}>
              <Pembelian icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"PEMBELIAN"} />
            </Main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
