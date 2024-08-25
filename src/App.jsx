import Main from "./templates/main/Main";
import Login from "./pages/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Empty from "./pages/Empty";
import NotFound from "./pages/NotFound";
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
import Laporan from "./pages/Report/Laporan";
import PeriodeStok from "./pages/Stock/PeriodeStok";
import Register from "./pages/Register";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useLayoutEffect } from "react";
library.add(fas);

const { VITE_PREFIX } = import.meta.env;

function App() {
  useLayoutEffect(() => {
    function not_allowed_right_click(event) {
      event.preventDefault();
      return false;
    }
    function not_allowed_inspect(event) {
      if (
        (event.ctrlKey && event.shiftKey && event.key === "I") || // Ctrl + Shift + I
        (event.metaKey && event.altKey && event.key === "I")
      ) {
        event.preventDefault();
        return false;
      }
    }
    document.addEventListener("contextmenu", not_allowed_right_click);
    document.addEventListener("keydown", not_allowed_inspect);
    return () => {
      document.removeEventListener("contextmenu", not_allowed_right_click);
      document.removeEventListener("keydown", not_allowed_inspect);
    };
  }, []);

  // routing untuk front-end
  return (
    <Router>
      <Routes>
        <Route path={`${VITE_PREFIX}LOGIN`} element={<Login />} />
        <Route path={`${VITE_PREFIX}REGISTER`} element={<Register />} />
        <Route
          path={`${VITE_PREFIX}empty`}
          element={
            <PrivateRoute>
              <Main title={"EMPTY"}>
                <Empty icon={<FontAwesomeIcon icon={"folder-open"} className="!text-[19px]" />} title={"EMPTY"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}`}
          element={
            <PrivateRoute>
              <Main title={"DASHBOARD"}>
                <Dashboard icon={<FontAwesomeIcon icon={"bar-chart"} className="!text-[19px]" />} title={"DASHBOARD"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}password`}
          element={
            <PrivateRoute>
              <Main title={"GANTI PASSWORD"}>
                <ChangePassword icon={<FontAwesomeIcon icon={"key"} className="!text-[19px]" />} title={"GANTI PASSWORD"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route path={`${VITE_PREFIX}manage-user`}>
          <Route
            path={`grup`}
            element={
              <PrivateRoute>
                <Main title={"MASTER GRUP"}>
                  <MasterGrup icon={<FontAwesomeIcon icon={"users-line"} className="!text-[19px]" />} title={"MASTER GRUP"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path={`otorisasi`}
            element={
              <PrivateRoute>
                <Main title={"MASTER OTORISASI"}>
                  <MasterOtorisasi icon={<FontAwesomeIcon icon={"shield-halved"} className="!text-[19px]" />} title={"MASTER OTORISASI"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path={`user`}
            element={
              <PrivateRoute>
                <Main title={"MASTER USER"}>
                  <MasterUser icon={<FontAwesomeIcon icon={"user"} className="!text-[19px]" />} title={"MASTER USER"} />
                </Main>
              </PrivateRoute>
            }
          />
        </Route>
        <Route path={`${VITE_PREFIX}master-data`}>
          <Route
            path={`satuan`}
            element={
              <PrivateRoute>
                <Main title={"MASTER SATUAN"}>
                  <MasterSatuan icon={<FontAwesomeIcon icon={"s"} className="!text-[19px]" />} title={"MASTER SATUAN"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path={`kategori`}
            element={
              <PrivateRoute>
                <Main title={"MASTER KATEGORI"}>
                  <MasterKategori icon={<FontAwesomeIcon icon={"list"} className="!text-[19px]" />} title={"MASTER KATEGORI"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path={`barang`}
            element={
              <PrivateRoute>
                <Main title={"MASTER BARANG"}>
                  <MasterBarang icon={<FontAwesomeIcon icon={"box"} className="!text-[19px]" />} title={"MASTER BARANG"} />
                </Main>
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path={`${VITE_PREFIX}order`}
          element={
            <PrivateRoute>
              <Main title={"PEMBELIAN"}>
                <Pembelian icon={<FontAwesomeIcon icon={"shopping-cart"} className="!text-[19px]" />} title={"PEMBELIAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}sales`}
          element={
            <PrivateRoute>
              <Main title={"PENJUALAN"}>
                <Penjualan icon={<FontAwesomeIcon icon={"cart-arrow-down"} className="!text-[19px]" />} title={"PENJUALAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}barang-rusak`}
          element={
            <PrivateRoute>
              <Main title={"BARANG RUSAK"}>
                <BarangRusak icon={<FontAwesomeIcon icon={"explosion"} className="!text-[19px]" />} title={"BARANG RUSAK"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path={`${VITE_PREFIX}repack-barang`}
          element={
            <PrivateRoute>
              <Main title={"REPACK BARANG"}>
                <RepackBarang icon={<FontAwesomeIcon icon={"cubes-stacked"} className="!text-[19px]" />} title={"REPACK BARANG"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route path={`${VITE_PREFIX}stok`}>
          <Route
            path="cek-stok"
            element={
              <PrivateRoute>
                <Main title={"CEK STOK"}>
                  <CekStok icon={<FontAwesomeIcon icon={"boxes-stacked"} className="!text-[19px]" />} title={"CEK STOK"} />
                </Main>
              </PrivateRoute>
            }
          />
          <Route
            path="periode-stok"
            element={
              <PrivateRoute>
                <Main title={"PERIODE STOK"}>
                  <PeriodeStok icon={<FontAwesomeIcon icon={"clock"} className="!text-[19px]" />} title={"PERIODE STOK"} />
                </Main>
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path={`${VITE_PREFIX}report`}
          element={
            <PrivateRoute>
              <Main title={"LAPORAN"}>
                <Laporan icon={<FontAwesomeIcon icon="file-pdf" className="!text-[19px]" />} title={"LAPORAN"} />
              </Main>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <Main title={"404 NOT FOUND"}>
              <NotFound icon={<FontAwesomeIcon icon={"triangle-exclamation"} className="!text-[19px]" />} title={"404 NOT FOUND"} />
            </Main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
