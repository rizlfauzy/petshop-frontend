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
import { get_data, fetch_data } from "../../hooks/useFetch";
import ModalBarangQty from "../../components/main/Pembelian/ModalBarangQty";
import ListBarang from "../../components/main/Pembelian/ListBarang";
import useAlert from "../../hooks/useAlert";

export default function Pembelian({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [show_modal_barang, set_show_modal_barang] = useState(false);
  const [show_modal_pembelian, set_show_modal_pembelian] = useState(false);
  const [barcode, set_barcode] = useState("");
  const [nomor, set_nomor] = useState("");
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [is_selected_pembelian, set_is_selected_pembelian] = useState(false);
  const [show_modal_qty, set_show_modal_qty] = useState(false);
  const [list_barang, set_list_barang] = useState([]);
  const [is_edit, set_is_edit] = useState(false);
  const [keyword, set_keyword] = useState("");
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    stock: 0,
    qty: 0,
    harga_modal: 0,
    total_harga: 0,
  });
  const [pembelian, set_pembelian] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const { date_picker } = useDatePicker();
  const { format_rupiah } = useFormating();
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert } = useAlert();

  useLayoutEffect(() => {
    const date = date_picker("tanggal");
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_pembelian((prev) => ({
        ...prev,
        tanggal,
      }));
    });

    const open_date = () => date.open();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref]);

  useEffect(() => {
    async function get_pembelian() {
      const { error, message, data } = await run(
        get_data({
          url: "/order?nomor=" + nomor,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data) {
        set_pembelian((prev) => ({
          ...prev,
          nomor: data.nomor,
          tanggal: data.tanggal,
          keterangan: data.keterangan,
        }));
        const goods = data.list_barang.map((item) => ({
          barcode: item.barcode,
          nama_barang: item.nama_barang,
          qty: item.qty,
          harga_modal: item.harga,
          total_harga: item.total,
          stock: item.stock,
        }));
        set_list_barang(goods);
      }
    }

    if (is_selected_pembelian) {
      get_pembelian();
      set_show_modal_pembelian(false);
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      btn_cancel.current.disabled = false;
    } else if (!is_selected_pembelian) {
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
    }
  }, [run, session, is_selected_pembelian, nomor]);

  useEffect(() => {
    async function get_barang() {
      const { error, message, data } = await run(
        get_data({
          url: "/stock?barcode=" + barcode,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data)
        set_barang_qty((prev) => ({
          ...prev,
          ...data,
          total_harga: 0,
          qty: 0,
        }));
    }

    if (is_selected_barang && keyword !== "") {
      set_show_modal_barang(false);
      set_show_modal_qty(true);
      set_is_selected_barang(false);
      set_is_edit(false);
    } else if (is_selected_barang) {
      get_barang();
      set_show_modal_barang(false);
      set_show_modal_qty(true);
      set_is_selected_barang(false);
      set_is_edit(false);
    }
  }, [barcode, run, session, is_selected_barang, keyword]);

  const handle_change_pembelian = useCallback((e) => {
    const { name, value } = e.target;
    set_pembelian((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handle_scan_barcode = useCallback(
    async (e) => {
      try {
        set_keyword(e.target.value);
        if (e.key === "Enter") {
          set_barcode(e.target.value);
          const { error, message, data } = await run(
            get_data({
              url: "/stock?barcode=" + e.target.value,
              headers: { authorization: `Bearer ${session.token}` },
            })
          );
          if (error) throw new Error(message);
          if (!data) throw new Error("Barang tidak ditemukan !!!");
          set_keyword("");
          set_is_selected_barang(true);
          set_barang_qty((prev) => ({
            ...prev,
            ...data,
            total_harga: 0,
            qty: 0,
          }));
        }
      } catch (e) {
        return swalAlert(e.message, "error");
      }
    },
    [swalAlert, run, session]
  );

  const handle_clear = useCallback(() => {
    set_pembelian({
      nomor: "",
      tanggal: moment().format("YYYY-MM-DD"),
      keterangan: "",
    });
    set_list_barang([]);
    set_barcode("");
    set_nomor("");
    set_keyword("");
    set_is_selected_barang(false);
    set_is_selected_pembelian(false);
    set_is_edit(false);
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    btn_cancel.current.disabled = true;
  }, []);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/order",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...pembelian,
            list_barang: JSON.stringify(list_barang),
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      return swalAlert(e.message, "error");
    }
  }, [swalAlert, list_barang, pembelian, run, session, handle_clear]);

  const handle_update = useCallback(() => {
    console.log("Update");
  }, []);

  const handle_find_pembelian = useCallback(() => {
    set_show_modal_pembelian(true);
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
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white" ref={btn_cancel}>
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
                        Nomor Invoice
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Invoice" value={pembelian.nomor} onChange={handle_change_pembelian} readOnly />
                  </div>
                  <div className="md:col-half col-full input-group">
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
                      value={pembelian.keterangan}
                      onInput={handle_change_pembelian}
                      onKeyDown={handle_keterangan}
                    ></textarea>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="nama_barang" className="input-group-text">
                        NAMA BARANG
                      </label>
                    </div>
                    <div className="relative md:col-thirdperfour col-half !px-0">
                      <input type="text" className="form-control" name="nama_barang" id="nama_barang" required readOnly placeholder="NAMA BARANG" />
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
                  <div className="md:col-half coll-full input-group">
                    <div className="col-half p-0 input-group-prepend">
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
                      onKeyDown={handle_scan_barcode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ListBarang set_list_barang={set_list_barang} list_barang={list_barang} set_show_modal_qty={set_show_modal_qty} set_barang_qty={set_barang_qty} set_is_edit={set_is_edit} />
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
      {show_modal_pembelian && (
        <ModalSec modal_title="Pembelian" className={["modal-md"]} btn={<></>} set_modal={set_show_modal_pembelian}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_pembelian}
            conf={{
              name: "pembelian",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan"],
              order: [["nomor", "ASC"]],
              where: {},
              likes: ["nomor"],
              keyword: "",
              func_item: {
                tanggal: (item) => moment(item.tanggal).format("DD MMMM YYYY"),
              },
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Nomor</th>
            <th className="text-left align-middle">Tanggal</th>
            <th className="text-left align-middle">Keterangan</th>
          </ModalMain>
        </ModalSec>
      )}
      {show_modal_qty && (
        <ModalSec modal_title="Input Qty" className={["modal-sm"]} btn={<></>} set_modal={set_show_modal_qty}>
          <ModalBarangQty barang_qty={barang_qty} set_barang_qty={set_barang_qty} set_show_modal_qty={set_show_modal_qty} list_barang={list_barang} set_list_barang={set_list_barang} is_edit={is_edit} />
        </ModalSec>
      )}
    </>
  );
}

Pembelian.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
