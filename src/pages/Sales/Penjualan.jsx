import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useState, useLayoutEffect, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCalendarDays, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { set_show_penjualan, set_show_barang, set_show_qty, set_hide_all_modal, set_show_loading } from "../../hooks/useStore";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useAsync from "../../hooks/useAsync";
import { fetch_data, get_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import useFormating from "../../hooks/useFormating";
import ModalBarangQty from "../../components/main/Penjualan/ModalBarangQty";
import ListBarang from "../../components/main/Penjualan/ListBarang";
import useAlert from "../../hooks/useAlert";
import useSocket from "../../hooks/useSocket";

export default function Penjualan({ icon, title }) {
  moment.locale("id");
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [nomor, set_nomor] = useState("");
  const [barcode, set_barcode] = useState("");
  const [keyword, set_keyword] = useState("");
  const [is_edit, set_is_edit] = useState(false);
  const [is_selected_penjualan, set_is_selected_penjualan] = useState(false);
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [list_barang, set_list_barang] = useState([]);
  const [penjualan, set_penjualan] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    stock: 0,
    qty: 0,
    disc: 0,
    nilai_disc: 0,
    harga: 0,
    total_harga: 0,
  });
  const { date_picker } = useDatePicker();
  const dispatch = useDispatch();
  const { show_modal_penjualan, show_modal_barang, show_modal_qty } = useSelector((state) => state.conf);
  const { run } = useAsync();
  const { session } = useSession();
  const { format_rupiah } = useFormating();
  const { swalAlert, swalAlertInput, swalAlertConfirm } = useAlert();
  const socket = useSocket();

  const get_stock = useCallback(
    async (barcode) => {
      const { error, message, data } = await run(
        get_data({
          url: `/stock?barcode=${barcode}&periode=${moment(penjualan.tanggal).format("YYYYMM")}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (data) {
        const stock = list_barang.some((item) => item.barcode === data.barcode) ? data.stock - list_barang.find((item) => item.barcode === data.barcode).qty : data.stock;
        set_barang_qty((prev) => ({
          ...prev,
          ...data,
          harga: data.harga_jual,
          total_harga: 0,
          qty: 0,
          nilai_disc: 0,
          stock,
        }));
      }
      return { error, message, data };
    },
    [run, session, penjualan.tanggal, list_barang]
  );

  useLayoutEffect(() => {
    const date = date_picker({id:"tanggal", selected_date: penjualan.tanggal});
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_penjualan((prev) => ({
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
  }, [date_picker, btn_tanggal_ref, list_barang, penjualan.tanggal]);

  useEffect(() => {
    async function get_penjualan() {
      const { error, message, data } = await run(
        get_data({
          url: "/sales?nomor=" + nomor,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data) {
        set_penjualan((prev) => ({ ...prev, ...data }));
        const goods = data.list_barang.map((item) => ({
          barcode: item.barcode,
          nama_barang: item.nama_barang,
          stock: Number(item.stock) + Number(item.qty),
          qty: item.qty,
          disc: item.disc,
          nilai_disc: item.nilai_disc,
          harga: item.harga,
          total_harga: item.total,
        }));
        set_list_barang(goods);
      }
    }

    if (is_selected_penjualan) {
      get_penjualan();
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      btn_cancel.current.disabled = false;
    } else if (!is_selected_penjualan) {
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
    }
  }, [run, nomor, is_selected_penjualan, session]);

  useEffect(() => {
    async function get_barang() {
      const { error, message } = await get_stock(barcode);
      if (error) throw new Error(message);
    }

    if (is_selected_barang && keyword != "") {
      dispatch(set_show_qty(true));
      set_is_selected_barang(false);
      set_is_edit(false);
    } else if (is_selected_barang) {
      get_barang();
      dispatch(set_show_qty(true));
      set_is_selected_barang(false);
      set_is_edit(false);
    }
  }, [barcode, dispatch, keyword, is_selected_barang, get_stock]);

  const handle_scan_barcode = useCallback(
    async (e) => {
      try {
        set_keyword(e.target.value);
        if (e.key === "Enter") {
          set_barcode(e.target.value);
          const { error, message, data } = await get_stock(e.target.value);
          if (error) throw new Error(message);
          if (!data) throw new Error("Barang tidak ditemukan !!!");
          set_keyword("");
          set_is_selected_barang(true);
        }
      } catch (e) {
        return swalAlert(e.message, "error");
      }
    },
    [swalAlert, get_stock]
  );

  const handle_clear = useCallback(() => {
    dispatch(set_show_loading(true))
    setTimeout(() => {
      set_penjualan({
        nomor: "",
        tanggal: moment().format("YYYY-MM-DD"),
        keterangan: "",
      });
      set_barang_qty({
        barcode: "",
        nama_barang: "",
        stock: 0,
        qty: 0,
        disc: 0,
        nilai_disc: 0,
        harga: 0,
        total_harga: 0,
      });
      set_list_barang([]);
      set_is_selected_barang(false);
      set_is_selected_penjualan(false);
      set_barcode("");
      set_is_edit(false);
      set_keyword("");
      dispatch(set_hide_all_modal());
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
      dispatch(set_show_loading(false));
      socket.emit("graph", { year: moment().format("YYYY") });
      socket.emit("omset", { start: moment().startOf("month").format("YYYY-MM-DD"), end: moment().format("YYYY-MM-DD") });
    }, 1000);
  }, [dispatch, socket]);

  const handle_save = useCallback(async () => {
    try {
      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/sales",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...penjualan,
            list_barang: JSON.stringify(list_barang),
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [swalAlert, list_barang, penjualan, run, session, handle_clear, dispatch]);

  const handle_update = useCallback(async () => {
    try {
      const confirm = await swalAlertConfirm("Data akan segera diupdate !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/sales",
          method: "PUT",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...penjualan,
            list_barang: JSON.stringify(list_barang),
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [handle_clear, list_barang, penjualan, run, session, swalAlert, swalAlertConfirm, dispatch]);

  const handle_find_penjualan = useCallback(() => {
    dispatch(set_show_penjualan(true));
  }, [dispatch]);

  const handle_cancel = useCallback(async () => {
    try {
      const confirm = await swalAlertInput("Data yang dicancel tidak bisa dihapus !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/sales",
          method: "DELETE",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            nomor: penjualan.nomor,
            alasan: confirm.value,
            tanggal: penjualan.tanggal,
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [handle_clear, penjualan, run, session, swalAlertInput, swalAlert, dispatch]);

  const handle_change_penjualan = useCallback((e) => {
    const { name, value } = e.target;
    set_penjualan((prev) => ({
      ...prev,
      [name]: value,
    }));
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
          <FontAwesomeIcon icon={"save"} className="mr-[10px]" />
          Save
        </button>
        <button ref={btn_update} id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <FontAwesomeIcon icon={"money-check"} className="mr-[10px]" />
          Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_penjualan}>
          <FontAwesomeIcon icon={"search"} className="mr-[10px]" />
          Find
        </button>
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white" ref={btn_cancel} onClick={handle_cancel}>
          <FontAwesomeIcon icon={faCancel} className="mr-[10px]" />
          Cancel
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
                <h5 className="mb-0 text-md">DATA DOKUMEN</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full input-group md:mb-0 mb-2">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nomor" className="input-group-text">
                        Nomor SO
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Sales Order" value={penjualan.nomor} onChange={handle_change_penjualan} readOnly />
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={penjualan.tanggal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal" ref={btn_tanggal_ref}>
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
                      value={penjualan.keterangan}
                      onInput={handle_change_penjualan}
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
                          dispatch(set_show_barang(true));
                          set_is_selected_barang(false);
                          set_keyword("");
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
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">Detail Penjualan</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full input-group md:mb-0 mb-2">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="total_qty" className="input-group-text">
                        Jumlah Barang
                      </label>
                    </div>
                    <input
                      type="text"
                      className="form-control col-half"
                      name="total_qty"
                      id="total_qty"
                      required
                      placeholder="Total Qty Barang"
                      value={format_rupiah(
                        list_barang.reduce((acc, curr) => {
                          return acc + Number(curr.qty);
                        }, 0),
                        {}
                      )}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group md:mb-0 mb-2">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="total_harga" className="input-group-text">
                        Total Harga Barang
                      </label>
                    </div>
                    <input
                      type="text"
                      className="form-control col-half"
                      name="total_harga"
                      id="total_harga"
                      required
                      placeholder="Total Harga Barang"
                      value={format_rupiah(
                        list_barang.reduce((acc, curr) => {
                          return acc + Number(curr.harga) * Number(curr.qty) - Number(curr.nilai_disc);
                        }, 0)
                      )}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ListBarang set_list_barang={set_list_barang} list_barang={list_barang} set_barang_qty={set_barang_qty} set_is_edit={set_is_edit} />
      </div>
      {show_modal_penjualan && (
        <Modal modal_title="Penjualan" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_penjualan}
            is_action_select={true}
            is_print={true}
            url_print="/sales/print?nomor="
            conf={{
              name: "one_sales_order",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan", "pemakai", "tglsimpan"],
              order: [["nomor", "ASC"]],
              where: { batal: false },
              likes: ["nomor"],
              keyword: "",
              func_item: {
                tanggal: (item) => moment(item.tanggal).format("DD MMMM YYYY"),
                tglsimpan: (item) => moment(item.tglsimpan).format("DD MMMM YYYY HH:mm:ss"),
              },
            }}
          >
            <th className="text-left align-middle action_select">Action</th>
            <th className="text-left align-middle">Nomor</th>
            <th className="text-left align-middle">Tanggal</th>
            <th className="text-left align-middle">Keterangan</th>
            <th className="text-left align-middle">Penginput</th>
            <th className="text-left align-middle">Tgl Simpan</th>
          </ModalMain>
        </Modal>
      )}
      {show_modal_barang && (
        <Modal modal_title="Barang" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang}
            conf={{
              name: "stock_barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama_barang", "nama_satuan", "nama_kategori", "stock"],
              order: [["barcode", "ASC"]],
              where: `periode = '${moment(penjualan.tanggal).format("YYYYMM")}' and stock > 0`,
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
        </Modal>
      )}
      {show_modal_qty && (
        <Modal modal_title="Input QTY" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalBarangQty barang_qty={barang_qty} set_barang_qty={set_barang_qty} list_barang={list_barang} set_list_barang={set_list_barang} is_edit={is_edit}></ModalBarangQty>
        </Modal>
      )}
    </>
  );
}

Penjualan.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
};
