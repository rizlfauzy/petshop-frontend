import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendarDays, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import { useDispatch, useSelector } from "react-redux";
import { set_show_barang, set_show_loading, set_hide_all_modal } from "../../hooks/useStore";
import useDatePicker from "../../hooks/useDatePicker";
import moment from "moment";
import useAlert from "../../hooks/useAlert";
import { useNavigate } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function Laporan({ icon, title }) {
  const btn_tanggal_awal_ref = useRef(null);
  const btn_tanggal_akhir_ref = useRef(null);
  const row_barang_ref = useRef(null);
  const row_periode_ref = useRef(null);
  const btn_print_pdf = useRef(null);
  const [tanggal_awal, set_tanggal_awal] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [tanggal_akhir, set_tanggal_akhir] = useState(moment().endOf("month").format("YYYY-MM-DD"));
  const [barcode, set_barcode] = useState("");
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [barang, set_barang] = useState({
    barcode,
    nama_barang: "",
  });
  const [report, set_report] = useState({
    report: "",
    nama: "",
    report_url: "",
    barang: false,
    periode: false,
    pdf: false
  });
  const { date_picker } = useDatePicker();
  const { session, setSessionData } = useSession();
  const dispatch = useDispatch();
  const { show_modal_barang } = useSelector((state) => state.conf);
  const { run } = useAsync();
  const { run: run_reports, data, isLoading } = useAsync();
  const { swalAlert } = useAlert()
  const navigate = useNavigate();

  useLayoutEffect(() => {
    btn_print_pdf.current.style.display = "none";
    row_barang_ref.current.style.display = "none";
    row_periode_ref.current.style.display = "none";

    run_reports(
      get_data({
        url: "/reports",
        headers: { authorization: `Bearer ${session.token}` },
      })
    );
  }, [run_reports, session]);

  useLayoutEffect(() => {
    const date_awal = date_picker({id:"tanggal_awal", selected_date: tanggal_awal});
    date_awal.onSelect((date) => {
      const tanggal_awal = moment(date).format("YYYY-MM-DD");
      set_tanggal_awal(tanggal_awal);
    });

    const open_date_awal = () => date_awal.open();

    const btn_tanggal_awal = btn_tanggal_awal_ref.current;
    btn_tanggal_awal.addEventListener("click", open_date_awal);

    const date_akhir = date_picker({id:"tanggal_akhir", maxDate: true, selected_date: tanggal_akhir});
    date_akhir.onSelect((date) => {
      const tanggal_akhir = moment(date).format("YYYY-MM-DD");
      set_tanggal_akhir(tanggal_akhir);
    });

    const open_date_akhir = () => date_akhir.open();

    const btn_tanggal_akhir = btn_tanggal_akhir_ref.current;
    btn_tanggal_akhir.addEventListener("click", open_date_akhir);
    return () => {
      btn_tanggal_awal.removeEventListener("click", open_date_awal);
      btn_tanggal_akhir.removeEventListener("click", open_date_akhir);
      date_awal.destroy();
    };
  }, [date_picker, btn_tanggal_awal_ref, tanggal_awal, tanggal_akhir]);

  useEffect(() => {
    async function get_barang() {
      const { error, message, data } = await run(
        get_data({
          url: `/barang?barcode=${barcode}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data) set_barang((prev) => ({ ...prev, nama_barang: data.nama, barcode: data.barcode }));
    }

    if (is_selected_barang) {
      get_barang();
    }
  }, [barcode, run, session, is_selected_barang]);

  const handle_clear = useCallback(() => {
    row_barang_ref.current.style.display = "none";
    row_periode_ref.current.style.display = "none";
    btn_print_pdf.current.style.display = "none";
    set_report((prev) => ({ ...prev, report: "", nama: "", report_url: "", barang: false, periode: false, pdf: false }));
    set_barang({ barcode: "", nama_barang: "" });
    set_tanggal_awal(moment().startOf("month").format("YYYY-MM-DD"));
    set_tanggal_akhir(moment().endOf("month").format("YYYY-MM-DD"));
    set_barcode("");
  }, []);

  const handle_report = useCallback(async (e) => {
    try {
      const { error, message, data } = await run(
        get_data({
          url: `/report?report=${e.target.value}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data) {
        set_report((prev) => ({ ...prev, ...data }));
        if (data.barang) row_barang_ref.current.style.display = 'block';
        else row_barang_ref.current.style.display = 'none';
        if (data.periode) row_periode_ref.current.style.display = 'flex';
        else row_periode_ref.current.style.display = 'none';
        if (data.pdf) btn_print_pdf.current.style.display = 'block';
        else btn_print_pdf.current.style.display = 'none';

        // if (data.report == "R003" || data.report == 'R004') set_tanggal_awal(moment(document.querySelector("#tglawal_periode").value).format("YYYY-MM-DD"));
        // else set_tanggal_awal(moment().startOf("month").format("YYYY-MM-DD"));
      } else handle_clear();
    } catch (e) {
      return swalAlert(e.message, "error");
    }
  }, [run, session, swalAlert, handle_clear]);

  const handle_print = useCallback(async () => {
    try {
      dispatch(set_show_loading(true));
      if (report.barang && !barang.barcode) throw new Error("Nama Barang Harus Diisi");
      if (report.periode && (!tanggal_awal || !tanggal_akhir)) throw new Error("Tanggal Awal dan Tanggal Akhir Harus Diisi");
      if (report.barang && !barang.barcode) throw new Error("Nama Barang Harus Diisi");

      let report_url = '';
      if (report.barang && report.periode) report_url = `/${report.report_url}?barcode=${barang.barcode}&tgl_awal=${moment(tanggal_awal).format("YYYYMMDD")}&tgl_akhir=${moment(tanggal_akhir).format("YYYYMMDD")}`;
      else if (report.barang) report_url = `/${report.report_url}?barcode=${barang.barcode}`;
      else if (report.periode) report_url = `/${report.report_url}?tgl_awal=${moment(tanggal_awal).format("YYYYMMDD")}&tgl_akhir=${moment(tanggal_akhir).format("YYYYMMDD")}`;
      else report_url = `/${report.report_url}`;

      const { error, message, url } = await run(
        get_data({
          url: report_url,
          headers: { authorization: `Bearer ${session.token}` },
          host: "/reports",
        })
      );
      if (error) throw new Error(message);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.click();
      swalAlert(message, "success");
    } catch (e) {
      if (e.message == "Token expired" || e.message == "Token not found") {
        setSessionData(null);
        dispatch(set_hide_all_modal());
        navigate(`${VITE_PREFIX}login`, { replace: true });
      }
      return swalAlert(e.message, "error");
    } finally {
      dispatch(set_show_loading(false));
    }
  }, [report, barang, swalAlert, tanggal_akhir, tanggal_awal, run, session, dispatch, navigate, setSessionData]);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="print" className="btn-sm bg-red-600 text-white" ref={btn_print_pdf} onClick={handle_print}>
          <FontAwesomeIcon icon={faPrint} className="mr-[10px]" />
          Print
        </button>
        <button id="clear" className="btn-sm bg-primary text-white" onClick={handle_clear}>
          <FontAwesomeIcon icon={"refresh"} className="mr-[10px]" />
          Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">FILTER LAPORAN</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2" id="periode" ref={row_periode_ref}>
                  <div className="md:col-half col-full md:mb-0 mb-2 input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_awal" className="input-group-text">
                        Tanggal Awal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal_awal" id="tanggal_awal" value={tanggal_awal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal_awal" ref={btn_tanggal_awal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_akhir" className="input-group-text">
                        Tanggal Akhir
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal_akhir" id="tanggal_akhir" value={tanggal_akhir} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal_akhir" ref={btn_tanggal_akhir_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2" id="barang" ref={row_barang_ref}>
                  <div className="col-full input-group">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="nama_barang" className="input-group-text">
                        NAMA BARANG
                      </label>
                    </div>
                    <div className="relative md:col-thirdperfour col-half !px-0">
                      <input type="text" className="form-control" name="nama_barang" id="nama_barang" value={barang.nama_barang} required readOnly placeholder="NAMA BARANG" />
                      <button
                        className="btn_absolute_right !right-1 text-primary hover:text-primary"
                        type="button"
                        onClick={() => {
                          dispatch(set_show_barang(true));
                          set_is_selected_barang(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="report" className="input-group-text">
                        Pilih Laporan
                      </label>
                    </div>
                    <div className="relative md:col-thirdperfour col-half !px-0">
                      <select name="report" id="report" className="form-control" value={report.report} onChange={handle_report} required>
                        <option value="">Pilih Laporan</option>
                        {!isLoading &&
                          data?.data?.map((item) => (
                            <option key={item.report} value={item.report}>
                              {item.nama}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {show_modal_barang && (
        <Modal modal_title="Barang" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang}
            conf={{
              name: "barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama", "nama_satuan", "nama_kategori", "aktif"],
              order: [["barcode", "ASC"]],
              where: {aktif: true},
              likes: ["barcode", "nama"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
              },
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Barcode</th>
              <th className="text-left align-middle">Nama</th>
              <th className="text-left align-middle">Nama Satuan</th>
              <th className="text-left align-middle">Nama Kategori</th>
              <th className="text-left align-middle">Aktif</th>
            </>
          </ModalMain>
        </Modal>
      )}
    </>
  );
}

Laporan.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
