import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useLayoutEffect, useEffect, useState } from "react";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCancel, faSearch } from "@fortawesome/free-solid-svg-icons";
import ModalMain from "../../components/main/ModalMain";
import useFormating from "../../hooks/useFormating";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data, fetch_data } from "../../hooks/useFetch";
import ModalBarangQty from "../../components/main/ModalBarangQty";
import ListBarang from "../../components/main/ListBarang";
import useAlert from "../../hooks/useAlert";
import { useDispatch, useSelector } from "react-redux";
import { set_show_pembelian, set_show_qty, set_show_loading } from "../../hooks/useStore";
import Modal from "../../components/Modal";
import { set_show_barang } from "../../hooks/useStore";

export default function Pembelian({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [barcode, set_barcode] = useState("");
  const [nomor, set_nomor] = useState("");
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [is_selected_pembelian, set_is_selected_pembelian] = useState(false);
  const [list_barang, set_list_barang] = useState([]);
  const [is_edit, set_is_edit] = useState(false);
  const [keyword, set_keyword] = useState("");
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    stock: 0,
    qty: 0,
    harga: 0,
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
  const { swalAlert, swalAlertConfirm, swalAlertInput } = useAlert();
  const dispatch = useDispatch();
  const { show_modal_pembelian, show_modal_qty, show_modal_barang } = useSelector((state) => state.conf);

  const get_stock = useCallback(
    async (barcode) => {
      const { error, message, data } = await run(
        get_data({
          url: `/stock?barcode=${barcode}&periode=${moment(pembelian.tanggal).format("YYYYMM")}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (data) {
        const stock = list_barang.some((item) => item.barcode === data.barcode) ? data.stock + list_barang.find((item) => item.barcode === data.barcode).qty : data.stock;
        set_barang_qty((prev) => ({
          ...prev,
          ...data,
          harga: data.harga_modal,
          total_harga: 0,
          qty: 0,
          nilai_disc: 0,
          stock,
        }));
      }
      return { error, message, data };
    },
    [run, session, pembelian.tanggal, list_barang]
  );

  useLayoutEffect(() => {
    const date = date_picker({id:"tanggal", selected_date: pembelian.tanggal});
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_pembelian((prev) => ({
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
  }, [date_picker, btn_tanggal_ref, list_barang, pembelian.tanggal]);

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
          ...data,
        }));
        const goods = data.list_barang.map((item) => ({
          barcode: item.barcode,
          nama_barang: item.nama_barang,
          qty: item.qty,
          harga: item.harga,
          total_harga: item.total,
          stock: item.stock,
        }));
        set_list_barang(goods);
      }
    }

    if (is_selected_pembelian) {
      get_pembelian();
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
      const { error, message } = await get_stock(barcode);
      if (error) throw new Error(message);
    }

    if (is_selected_barang && keyword !== "") {
      dispatch(set_show_qty(true));
      set_is_selected_barang(false);
      set_is_edit(false);
    } else if (is_selected_barang) {
      get_barang();
      dispatch(set_show_qty(true));
      set_is_selected_barang(false);
      set_is_edit(false);
    }
  }, [barcode, is_selected_barang, keyword, get_stock, dispatch]);

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
    dispatch(set_show_loading(true));
    setTimeout(() => {
      set_pembelian({
        nomor: "",
        tanggal: moment().format("YYYY-MM-DD"),
        keterangan: "",
      });
      set_barang_qty({
        nama_barang: "",
        barcode: "",
        stock: 0,
        harga: 0,
        qty: 0,
        total_harga: 0,
      });
      set_list_barang([]);
      set_barcode("");
      set_nomor("");
      set_keyword("");
      set_is_selected_barang(false);
      set_is_selected_pembelian(false);
      set_is_edit(false);
      dispatch(set_show_pembelian(false));
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
      dispatch(set_show_loading(false));
    }, 1000);
  }, [dispatch]);

  const handle_save = useCallback(async () => {
    try {
      dispatch(set_show_loading(true));
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
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [swalAlert, list_barang, pembelian, run, session, handle_clear, dispatch]);

  const handle_update = useCallback(async () => {
    try {
      const confirm = await swalAlertConfirm("Data akan segera diupdate !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/order",
          method: "PUT",
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
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [swalAlert, swalAlertConfirm, handle_clear, list_barang, run, session, pembelian, dispatch]);

  const handle_cancel = useCallback(async () => {
    try {
      const confirm = await swalAlertInput("Data yang dicancel tidak bisa dihapus !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/order",
          method: "DELETE",
          headers: { authorization: `Bearer ${session.token}` },
          data: { nomor: pembelian.nomor, alasan: confirm.value, tanggal: pembelian.tanggal },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      dispatch(set_show_loading(false));
      return swalAlert(e.message, "error");
    }
  }, [swalAlert, run, session, pembelian, handle_clear, swalAlertInput, dispatch]);

  const handle_find_pembelian = useCallback(() => {
    dispatch(set_show_pembelian(true));
  }, [dispatch]);

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
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_pembelian}>
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
        </div>
        <ListBarang set_list_barang={set_list_barang} list_barang={list_barang} set_barang_qty={set_barang_qty} set_is_edit={set_is_edit} />
      </div>
      {show_modal_barang && (
        <Modal modal_title={"Barang"} className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang}
            conf={{
              name: "stock_barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama_barang", "nama_satuan", "nama_kategori", "stock"],
              order: [["barcode", "ASC"]],
              where: { periode: moment(pembelian.tanggal).format("YYYYMM") },
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
      {show_modal_pembelian && (
        <Modal modal_title="Pembelian" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_pembelian}
            is_action_select={true}
            is_print={true}
            url_print="/order/print?nomor="
            conf={{
              name: "one_pembelian",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan"],
              order: [["nomor", "ASC"]],
              where: { batal: false },
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
        </Modal>
      )}
      {show_modal_qty && (
        <Modal modal_title="Input Qty" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalBarangQty barang_qty={barang_qty} set_barang_qty={set_barang_qty} list_barang={list_barang} set_list_barang={set_list_barang} is_edit={is_edit} is_harga_modal={true} />
        </Modal>
      )}
    </>
  );
}

Pembelian.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
