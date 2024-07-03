import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useState, useLayoutEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCancel, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { useDispatch } from "react-redux";
import { set_show_barang } from "../../hooks/useStore";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data } from "../../hooks/useFetch";

export default function RepackBarang({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [list_barang, set_list_barang] = useState([]);
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [keyword, set_keyword] = useState("");
  const [repack_barang, set_repack_barang] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const { date_picker } = useDatePicker();
  const dispatch = useDispatch();
  const { run } = useAsync();
  const {session} = useSession();

  useLayoutEffect(() => {
    const date = date_picker("tanggal");
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_repack_barang((prev) => ({
        ...prev,
        tanggal,
      }));
    });

    const open_date = () => {
      if (list_barang.length < 1) date.open();
    };

    if (list_barang.length > 0) date.destroy();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref, list_barang]);

  const handle_clear = useCallback(() => {
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    btn_cancel.current.disabled = true;
  }, []);

  const handle_save = useCallback(() => {
    console.log("save");
  }, []);

  const handle_update = useCallback(() => {
    console.log("update");
  }, []);

  const handle_cancel = useCallback(() => {
    handle_clear();
    console.log("cancel");
  }, [handle_clear]);

  const handle_find_repack = useCallback(() => {
    console.log("find repack");
  }, []);

  const handle_change_repack_barang = useCallback((e) => {
    set_repack_barang((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handle_keterangan = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, []);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button ref={btn_save} id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <i className="far fa-save mr-[10px]"></i>Save
        </button>
        <button ref={btn_update} id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <i className="far fa-money-check-edit mr-[10px]"></i>Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_repack}>
          <i className="far fa-file-search mr-[10px]"></i>Find
        </button>
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white" ref={btn_cancel} onClick={handle_cancel}>
          <FontAwesomeIcon icon={faCancel} className="mr-[10px]" />
          Cancel
        </button>
        <button id="clear" className="btn-sm bg-primary text-white" onClick={handle_clear}>
          <i className="far fa-refresh mr-[10px]"></i>Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">DATA DOKUMEN</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full input-group md:mb-0 mb-2">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nomor" className="input-group-text">
                        Nomor RB
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Repack Barang" value={repack_barang.nomor} onChange={handle_change_repack_barang} readOnly />
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={repack_barang.tanggal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" ref={btn_tanggal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group !items-start">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="keterangan" className="input-group-text">
                        Keterengan
                      </label>
                    </div>
                    <textarea
                      name="keterangan"
                      id="keterangan"
                      className="form-control md:col-thirdperfour col-half"
                      rows={5}
                      placeholder="Keterangan ..."
                      value={repack_barang.keterangan}
                      onInput={handle_change_repack_barang}
                      onKeyDown={handle_keterangan}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">DATA PROSES </h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full">
                    <div className="row">
                      <div className="md:col-half col-full input-group">
                        <div className="md:col-half col-full p-0 input-group-prepend">
                          <label htmlFor="nama_barang" className="input-group-text">
                            NAMA BARANG
                          </label>
                        </div>
                        <div className="relative md:col-half col-full !px-0">
                          <input type="text" className="form-control" name="nama_barang" id="nama_barang" required readOnly placeholder="NAMA BARANG" />
                          <button
                            className="btn_absolute_right !right-1 text-primary hover:text-primary"
                            type="button"
                            onClick={() => {
                              dispatch(set_show_barang(true));
                              set_is_selected_barang(false);
                              set_keyword("");
                            }}
                          >
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-half col-full input-group">
                        <div className="md:col-half col-full p-0 input-group-prepend">
                          <label htmlFor="barcode" className="input-group-text">
                            SCAN BARCODE
                          </label>
                        </div>
                        <input
                          value={keyword}
                          type="text"
                          className="form-control col-half"
                          name="barcode"
                          id="barcode"
                          required
                          placeholder="KETIK BARCODE DI SINI !!!"
                          onChange={(e) => set_keyword(e.target.value)}
                          // onKeyDown={handle_scan_barcode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

RepackBarang.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
