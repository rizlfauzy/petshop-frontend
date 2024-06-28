import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useLayoutEffect, useEffect, useState } from "react";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCancel, faSearch } from "@fortawesome/free-solid-svg-icons";
import ModalSec from "../../components/ModalSec";
import ModalMain from "../../components/main/ModalMain";
import useFormating from "../../hooks/useFormating";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data } from "../../hooks/useFetch";

export default function Pembelian({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [show_modal_barang, set_show_modal_barang] = useState(false);
  const [barcode, set_barcode] = useState("");
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [show_modal_qty, set_show_modal_qty] = useState(false);
  const [barang, set_barang] = useState({
    barcode: "",
    nama_barang: "",
  });
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    stock: 0,
    qty: 0,
  });
  const [pembelian, set_pembelian] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
    barcode: barang.barcode,
    nama_barang: barang.nama_barang,
  });
  const { date_picker } = useDatePicker();
  const { format_rupiah } = useFormating();
  const { run } = useAsync();
  const {session} = useSession()

  useLayoutEffect(() => {
    const date = date_picker("tanggal");
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_pembelian((prev) => ({
        ...prev,
        tanggal,
      }));
    });

    const open_date = ()=> date.open();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref]);

  const handle_change_pembelian = useCallback((e) => {
    const { name, value } = e.target;
    set_pembelian((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  useEffect(() => {
    async function get_barang() {
      const { error, message, data } = await run(
        get_data({
          url: "/stock?barcode=" + barcode,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      // set_barang((prev) => ({
      //   ...prev,
      //   barcode: data.barcode,
      //   nama_barang: data.nama,
      // }));
      set_barang_qty((prev) => ({
        ...prev, ...data, stock: format_rupiah(data.stock, {}),
      }));
      set_pembelian((prev) => ({
        ...prev,
        barcode: data.barcode,
        nama_barang: data.nama_barang,
      }));
    }

    if (is_selected_barang) {
      get_barang();
      set_show_modal_barang(false);
      set_show_modal_qty(true);
      set_is_selected_barang(false);
    }

    if (show_modal_qty) {
      const qty = document.querySelector("#qty");
      qty?.focus();
    }
  }, [barcode, run, session, is_selected_barang, show_modal_qty, format_rupiah])

  const handle_change_barang = useCallback((e) => {
    const { name, value } = e.target;
    set_barang((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handle_clear = useCallback(() => {
    console.log("clear");
  }, []);

  const handle_save = useCallback(() => {
    console.log(pembelian);
  }, [pembelian]);

  const handle_update = useCallback(() => {
    console.log("Update");
  }, []);

  const handle_find_pembelian = useCallback(() => {
    console.log("Find");
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
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_pembelian}>
          <i className="far fa-file-search mr-[10px]"></i>Find
        </button>
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white">
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
                  <div className="col-half input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nomor" className="input-group-text">
                        Nomor Invoice
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Invoice" value={pembelian.nomor} onChange={handle_change_pembelian} readOnly />
                  </div>
                  <div className="col-half input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={pembelian.tanggal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" ref={btn_tanggal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group !items-start">
                    <div className="col-quarter p-0 input-group-prepend">
                      <label htmlFor="keterangan" className="input-group-text">
                        Keterengan
                      </label>
                    </div>
                    <textarea
                      name="keterangan"
                      id="keterangan"
                      className="form-control col-thirdperfour"
                      rows={5}
                      placeholder="Informasi ..."
                      value={pembelian.keterangan}
                      onInput={handle_change_pembelian}
                      onKeyDown={handle_keterangan}
                    ></textarea>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="col-quarter p-0 input-group-prepend">
                      <label htmlFor="nama_barang" className="input-group-text">
                        NAMA BARANG
                      </label>
                    </div>
                    <div className="relative col-thirdperfour !px-0">
                      <input value={barang.nama_barang} onChange={handle_change_barang} type="text" className="form-control" name="nama_barang" id="nama_barang" required readOnly placeholder="NAMA BARANG" />
                      <button
                        className="btn_absolute_right !right-1 text-primary hover:text-primary"
                        type="button"
                        onClick={() => {
                          set_show_modal_barang(true);
                          set_is_selected_barang(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-half input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="barcode" className="input-group-text">
                        SCAN BARCODE
                      </label>
                    </div>
                    <input value={barang.barcode} onChange={handle_change_barang} type="text" className="form-control col-half" name="barcode" id="barcode" required placeholder="KETIK BARCODE DI SINI !!!" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {show_modal_barang && (
        <ModalSec modal_title={"Barang"} className={["modal-md"]} btn={<></>} set_modal={set_show_modal_barang}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang}
            conf={{
              name: "stock_barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama_barang", "nama_satuan", "nama_kategori", "stock"],
              order: [["barcode", "ASC"]],
              where: { periode: moment().format("YYYYMM") },
              likes: ["barcode", "nama_barang"],
              keyword: "",
              func_item: {
                stock: (item) => format_rupiah(item.stock, {}) + " " + item.nama_satuan,
              },
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Barcode</th>
            <th className="text-left align-middle">Nama Barang</th>
            <th className="text-left align-middle">Satuan</th>
            <th className="text-left align-middle">Kategori</th>
            <th className="text-left align-middle">Stock</th>
          </ModalMain>
        </ModalSec>
      )}
      {show_modal_qty && (
        <ModalSec modal_title="Input Qty" className={["modal-sm"]} btn={<></>} set_modal={set_show_modal_qty}>
          <div className="row my-2">
            <div className="col-full input-group">
              <div className="col-half p-0 input-group-prepend">
                <label htmlFor="barcode_qty" className="input-group-text">
                  barcode
                </label>
              </div>
              <input type="text" className="form-control col-half" name="barcode_qty" id="barcode_qty" value={barang_qty.barcode} readOnly />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-full input-group">
              <div className="col-half p-0 input-group-prepend">
                <label htmlFor="nama_barang_qty" className="input-group-text">
                  Nama Barang
                </label>
              </div>
              <input type="text" className="form-control col-half" name="nama_barang_qty" id="nama_barang_qty" value={barang_qty.nama_barang} readOnly />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-full input-group">
              <div className="col-half p-0 input-group-prepend">
                <label htmlFor="stock_barang_qty" className="input-group-text">
                  Stock Barang
                </label>
              </div>
              <input type="text" className="form-control col-half" name="stock_barang_qty" id="stock_barang_qty" value={barang_qty.stock} readOnly />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-full input-group">
              <div className="col-half p-0 input-group-prepend">
                <label htmlFor="qty" className="input-group-text">
                  Qty Barang
                </label>
              </div>
              <input
                type="text"
                className="form-control col-half"
                name="qty"
                id="qty"
                value={barang_qty.qty}
                onChange={(e) => {
                  const { name, value } = e.target;
                  if (isNaN(Number(value))) e.target.value = value.substr(0, value.length - 1);
                  const arr_value = value.split("");
                  const first_val = arr_value[0];
                  if (first_val == 0) {
                    arr_value.shift();
                    e.target.value = arr_value.join("");
                  }
                  const result_value = arr_value.map((e) => Number(e)).join("");
                  e.target.value = result_value.replace(/NaN/gi, "");
                  if (e.target.value.length < 1) e.target.value = 0;
                  set_barang_qty((prev) => ({
                    ...prev,
                    [name]: format_rupiah(e.target.value, {}),
                  }));
                }}
              />
            </div>
          </div>
        </ModalSec>
      )}
    </>
  );
}

Pembelian.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
