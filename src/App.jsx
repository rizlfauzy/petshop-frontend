import Main from "./templates/main/Main";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ChangePassword from "./pages/ChangePassword";
import MasterGrup from "./pages/Master/MasterGrup";
import MasterUser from "./pages/Master/MasterUser";
import MasterSatuan from "./pages/Master/MasterSatuan";
import MasterKategori from "./pages/Master/MasterKategori";
import MasterBarang from "./pages/Master/MasterBarang";
import MasterOtorisasi from "./pages/Master/MasterOtorisasi";
import Pembelian from "./pages/Order/Pembelian";
import Penjualan from "./pages/Sales/Penjualan";
import BarangRusak from "./pages/Stock/BarangRusak";
import RepackBarang from "./pages/Stock/RepackBarang";
import CekStok from "./pages/Stock/CekStok";

const { VITE_PREFIX } = import.meta.env;

function App() {
  return (
    <Router>
      <Routes>
        <Route path={`${VITE_PREFIX}LOGIN`} element={<Login />} />
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
            <PrivateRoute>
              <Main title={"GANTI PASSWORD"}>
                <ChangePassword icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"GANTI PASSWORD"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-grup`}
          element={
            <PrivateRoute>
              <Main title={"MASTER GRUP"}>
                <MasterGrup icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER GRUP"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-otorisasi`}
          element={
            <PrivateRoute>
              <Main title={"MASTER OTORISASI"}>
                <MasterOtorisasi icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER OTORISASI"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-user`}
          element={
            <PrivateRoute>
              <Main title={"MASTER USER"}>
                <MasterUser icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER USER"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-satuan`}
          element={
            <PrivateRoute>
              <Main title={"MASTER SATUAN"}>
                <MasterSatuan icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER SATUAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-kategori`}
          element={
            <PrivateRoute>
              <Main title={"MASTER KATEGORI"}>
                <MasterKategori icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER KATEGORI"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}master-barang`}
          element={
            <PrivateRoute>
              <Main title={"MASTER BARANG"}>
                <MasterBarang icon={<i className="fal fa-chart-pie fa-lg !text-[19px]"></i>} title={"MASTER BARANG"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}order`}
          element={
            <PrivateRoute>
              <Main title={"PEMBELIAN"}>
                <Pembelian icon={<i className="far fa-shopping-cart fa-lg !text-[19px]"></i>} title={"PEMBELIAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}sales`}
          element={
            <PrivateRoute>
              <Main title={"PENJUALAN"}>
                <Penjualan icon={<i className="far fa-cart-arrow-down fa-lg !text-[19px]"></i>} title={"PENJUALAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route path={`${VITE_PREFIX}stok`}>
          <Route
            path="barang-rusak"
            element={
              <PrivateRoute>
                <Main title={"BARANG RUSAK"}>
                  <BarangRusak icon={<i className="fas fa-inventory fa-lg !text-[19px]"></i>} title={"BARANG RUSAK"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path="repack-barang"
            element={
              <PrivateRoute>
                <Main title={"REPACK BARANG"}>
                  <RepackBarang icon={<i className="fas fa-inventory fa-lg !text-[19px]"></i>} title={"REPACK BARANG"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path="cek-stok"
            element={
              <PrivateRoute>
                <Main title={"CEK STOK"}>
                  <CekStok icon={<i className="fas fa-inventory fa-lg !text-[19px]"></i>} title={"CEK STOK"} />
                </Main>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
