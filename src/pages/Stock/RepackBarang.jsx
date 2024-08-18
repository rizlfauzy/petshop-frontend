import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useState, useLayoutEffect, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCancel, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { set_show_barang, set_show_loading, set_hide_all_modal, set_show_repack_barang, set_show_qty } from "../../hooks/useStore";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data, fetch_data } from "../../hooks/useFetch";
import useAlert from "../../hooks/useAlert";
import ListBarang from "../../components/main/ListBarang";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useFormating from "../../hooks/useFormating";
import ModalBarangQty from "../../components/main/ModalBarangQty";

export default function RepackBarang({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [barcode, set_barcode] = useState("");
  const [nomor, set_nomor] = useState("");
  const [list_barang_proses, set_list_barang_proses] = useState([]);
  const [list_barang_hasil, set_list_barang_hasil] = useState([]);
  const [is_selected_barang_proses, set_is_selected_barang_proses] = useState(false);
  const [is_selected_barang_hasil, set_is_selected_barang_hasil] = useState(false);
  const [is_selected_repack_barang, set_is_selected_repack_barang] = useState(false);
  const [keyword_proses, set_keyword_proses] = useState("");
  const [keyword_hasil, set_keyword_hasil] = useState("");
  const [is_edit, set_is_edit] = useState(false);
  const [is_proses, set_is_proses] = useState(false);
  const [is_hasil, set_is_hasil] = useState(false);
  const [repack_barang, set_repack_barang] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    qty: 0,
    stock: 0,
    qty_repack: 0,
  });
  const { date_picker } = useDatePicker();
  const dispatch = useDispatch();
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert, swalAlertConfirm, swalAlertInput } = useAlert();
  const { show_modal_barang, show_modal_repack_barang, show_modal_qty } = useSelector((state) => state.conf);
  const { format_rupiah } = useFormating();

  const get_stock = useCallback(
    async (barcode) => {
      const { error, message, data } = await run(
        get_data({
          url: `/stock?barcode=${barcode}&periode=${moment(repack_barang.tanggal).format("YYYYMM")}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (data) {
        const stock = list_barang_proses.some((item) => item.barcode === data.barcode) ? data.stock - list_barang_proses.find((item) => item.barcode === data.barcode).qty : data.stock;
        const qty_barang_induk = list_barang_proses.length > 0 ? list_barang_proses.find((item) => item.barcode == data.barang_induk)?.qty : 1;
        set_barang_qty((prev) => ({
          ...prev,
          ...data,
          total_harga: 0,
          qty: data.qty_repack * qty_barang_induk,
          stock,
          qty_repack: data?.qty_repack,
        }));
      }
      return { error, message, data };
    },
    [run, session, repack_barang.tanggal, list_barang_proses]
  );

  useLayoutEffect(() => {
    const date = date_picker({ id: "tanggal", selected_date: repack_barang.tanggal });
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_repack_barang((prev) => ({
        ...prev,
        tanggal,
      }));
    });

    const open_date = () => list_barang_proses.length < 1 && date.open();

    if (list_barang_proses.length > 0) date.destroy();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref, list_barang_proses, repack_barang.tanggal]);

  useEffect(() => {
    async function get_repack_barang() {
      const { error, message, data } = await run(
        get_data({
          url: "/repack-barang?nomor=" + nomor,
          headers: { authorization: `Bearer ${session?.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data) {
        set_repack_barang((prev) => ({ ...prev, ...data }));
        const goods_proses = data.list_barang.filter((item) => item.jenis == "proses").map((item) => ({ ...item, stock: Number(item.stock) + Number(item.qty) }));
        const goods_hasil = data.list_barang.filter((item) => item.jenis == "hasil");
        set_list_barang_proses(goods_proses);
        set_list_barang_hasil(goods_hasil);
      }
    }

    if (is_selected_repack_barang) {
      get_repack_barang();
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      btn_cancel.current.disabled = false;
    } else {
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
    }
  }, [run, nomor, is_selected_repack_barang, session]);

  useEffect(() => {
    async function get_barang() {
      const { error, message } = await get_stock(barcode);
      if (error) throw new Error(message);
    }

    if (is_selected_barang_proses && keyword_proses != "") {
      dispatch(set_show_qty(true));
      set_is_selected_barang_proses(false);
      set_is_edit(false);
      set_is_proses(true);
    } else if (is_selected_barang_proses) {
      get_barang();
      dispatch(set_show_qty(true));
      set_is_selected_barang_proses(false);
      set_is_edit(false);
      set_is_proses(true);
    }

    if (is_selected_barang_hasil && keyword_hasil != "") {
      dispatch(set_show_qty(true));
      set_is_selected_barang_hasil(false);
      set_is_edit(false);
      set_is_hasil(true);
    } else if (is_selected_barang_hasil) {
      get_barang();
      dispatch(set_show_qty(true));
      set_is_selected_barang_hasil(false);
      set_is_edit(false);
      set_is_hasil(true);
    }
  }, [barcode, dispatch, keyword_proses, keyword_hasil, is_selected_barang_proses, is_selected_barang_hasil, get_stock]);

  const handle_scan_barcode = useCallback(
    async (e) => {
      try {
        if (e.key === "Enter") {
          set_barcode(e.target.value);
          const { error, message, data } = await get_stock(e.target.value);
          if (error) throw new Error(message);
          if (!data) throw new Error("Barang tidak ditemukan !!!");
          if (e.target.id == "barcode_proses") {
            if (data.repack) throw new Error("Barang Repack hanya boleh diinput di table hasil !!!");
            set_keyword_proses("");
            set_is_selected_barang_proses(true);
            set_is_proses(true);
          } else if (e.target.id == "barcode_hasil") {
            if (list_barang_proses.length < 1) throw new Error("Barang Proses harus diinput terlebih dahulu !!!");
            if (!data.repack) throw new Error("Barang bukan barang Repack input di table proses !!!");
            set_keyword_hasil("");
            set_is_selected_barang_hasil(true);
            set_is_hasil(true);
          }
        }
      } catch (e) {
        return swalAlert(e.message, "error");
      }
    },
    [swalAlert, get_stock, list_barang_proses]
  );

  const handle_clear = useCallback(() => {
    dispatch(set_show_loading(true));
    setTimeout(() => {
      set_repack_barang({
        nomor: "",
        tanggal: moment().format("YYYY-MM-DD"),
        keterangan: "",
      });
      set_barang_qty({
        barcode: "",
        nama_barang: "",
        qty: 0,
        stock: 0,
        qty_repack: 0,
      });
      set_list_barang_proses([]);
      set_list_barang_hasil([]);
      set_is_selected_repack_barang(false);
      set_is_selected_barang_proses(false);
      set_is_selected_barang_hasil(false);
      set_keyword_proses("");
      set_keyword_hasil("");
      set_is_edit(false);
      set_is_proses(false);
      set_is_hasil(false);
      dispatch(set_hide_all_modal());
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
          url: "/repack-barang",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...repack_barang,
            list_barang_proses: JSON.stringify(list_barang_proses),
            list_barang_hasil: JSON.stringify(list_barang_hasil),
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
  }, [dispatch, list_barang_hasil, list_barang_proses, repack_barang, session, run, swalAlert, handle_clear]);

  const handle_update = useCallback(async () => {
    try {
      const confirm = await swalAlertConfirm("Data akan segera diupdate !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/repack-barang",
          method: "PUT",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...repack_barang,
            list_barang_proses: JSON.stringify(list_barang_proses),
            list_barang_hasil: JSON.stringify(list_barang_hasil),
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
  }, [handle_clear, list_barang_proses, list_barang_hasil, repack_barang, run, session, swalAlert, swalAlertConfirm, dispatch]);

  const handle_cancel = useCallback(async () => {
    try {
      const confirm = await swalAlertInput("Data yang dicancel tidak bisa dihapus !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/repack-barang",
          method: "DELETE",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            nomor: repack_barang.nomor,
            alasan: confirm.value,
            tanggal: repack_barang.tanggal,
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
  }, [handle_clear, repack_barang, run, session, swalAlertInput, swalAlert, dispatch]);

  const handle_find_repack = useCallback(() => {
    dispatch(set_show_repack_barang(true));
  }, [dispatch]);

  const handle_change_repack_barang = useCallback((e) => {
    set_repack_barang((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handle_keterangan = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    if (e.ctrlKey && e.key === "1" && btn_save.current.disabled === false) {
      e.preventDefault();
      btn_save.current.click();
    } else if (e.ctrlKey && e.key === "2" && btn_update.current.disabled === false) {
      e.preventDefault();
      btn_update.current.click();
    } else if (e.ctrlKey && e.key === "3" && btn_cancel.current.disabled === false) {
      e.preventDefault();
      btn_cancel.current.click();
    }
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
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_repack}>
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
                        <div className="col-half p-0 input-group-prepend">
                          <label htmlFor="nama_barang_proses" className="input-group-text">
                            NAMA BARANG
                          </label>
                        </div>
                        <div className="relative col-half !px-0">
                          <input type="text" className="form-control" name="nama_barang_proses" id="nama_barang_proses" required readOnly placeholder="NAMA BARANG PROSES" />
                          <button
                            className="btn_absolute_right !right-1 text-primary hover:text-primary"
                            type="button"
                            onClick={() => {
                              try {
                                if (list_barang_proses.length > 0) throw new Error("Barang Proses hanya boleh diinput sekali !!!");
                                dispatch(set_show_barang(true));
                                set_is_proses(true);
                                set_is_hasil(false);
                                set_is_selected_barang_proses(false);
                                set_keyword_proses("");
                              } catch (e) {
                                return swalAlert(e.message, "error");
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-half col-full input-group">
                        <div className="col-half p-0 input-group-prepend">
                          <label htmlFor="barcode_proses" className="input-group-text">
                            SCAN BARCODE
                          </label>
                        </div>
                        <input
                          value={keyword_proses}
                          type="text"
                          className="form-control col-half"
                          name="barcode_proses"
                          id="barcode_proses"
                          required
                          placeholder="KETIK BARCODE DI SINI !!!"
                          onChange={(e) => set_keyword_proses(e.target.value)}
                          onKeyDown={handle_scan_barcode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ListBarang
                  set_list_barang={set_list_barang_proses}
                  list_barang={list_barang_proses}
                  list_barang_dua={list_barang_hasil}
                  set_barang_qty={set_barang_qty}
                  set_is_edit={set_is_edit}
                  is_req_harga={false}
                  is_pro_hasil={is_proses}
                  set_is_pro_hasil={set_is_proses}
                  set_is_pro_hasil_dua={set_is_hasil}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">DATA HASIL </h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full">
                    <div className="row">
                      <div className="md:col-half col-full input-group">
                        <div className="col-half p-0 input-group-prepend">
                          <label htmlFor="nama_barang_hasil" className="input-group-text">
                            NAMA BARANG
                          </label>
                        </div>
                        <div className="relative col-half !px-0">
                          <input type="text" className="form-control" name="nama_barang_hasil" id="nama_barang_hasil" required readOnly placeholder="NAMA BARANG HASIL" />
                          <button
                            className="btn_absolute_right !right-1 text-primary hover:text-primary"
                            type="button"
                            onClick={() => {
                              try {
                                if (list_barang_proses.length < 1) throw new Error("Barang Proses harus diinput terlebih dahulu !!!");
                                dispatch(set_show_barang(true));
                                set_is_hasil(true);
                                set_is_proses(false);
                                set_is_selected_barang_hasil(false);
                                set_keyword_hasil("");
                              } catch (e) {
                                return swalAlert(e.message, "error");
                              }
                            }}
                          >
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-half col-full input-group">
                        <div className="col-half p-0 input-group-prepend">
                          <label htmlFor="barcode_hasil" className="input-group-text">
                            SCAN BARCODE
                          </label>
                        </div>
                        <input
                          value={keyword_hasil}
                          type="text"
                          className="form-control col-half"
                          name="barcode_hasil"
                          id="barcode_hasil"
                          required
                          placeholder="KETIK BARCODE DI SINI !!!"
                          onChange={(e) => set_keyword_hasil(e.target.value)}
                          onKeyDown={handle_scan_barcode}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <ListBarang
                  set_list_barang={set_list_barang_hasil}
                  list_barang={list_barang_hasil}
                  set_barang_qty={set_barang_qty}
                  set_is_edit={set_is_edit}
                  is_req_harga={false}
                  is_pro_hasil={is_hasil}
                  set_is_pro_hasil={set_is_hasil}
                  set_is_pro_hasil_dua={set_is_proses}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {show_modal_repack_barang && (
        <Modal modal_title="Repack Barang" className={["md:modal-md", "modal-xl"]}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_repack_barang}
            conf={{
              name: "one_repack_barang",
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
      {show_modal_barang && is_proses && (
        <Modal modal_title={"Barang PROSES"} className={["md:modal-md", "modal-xl"]}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang_proses}
            is_action_select
            conf={{
              name: "stock_barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama_barang", "nama_satuan", "nama_kategori", "stock"],
              order: [["barcode", "ASC"]],
              where: `periode = '${moment(repack_barang.tanggal).format("YYYYMM")}' and repack = false`,
              likes: ["barcode", "nama_barang"],
              keyword: "",
              func_item: {
                stock: (item) => format_rupiah(item.stock, {}) + " " + item.nama_satuan,
              },
            }}
          >
            <th className="text-left align-middle action_select">Action</th>
            <th className="text-left align-middle">Barcode</th>
            <th className="text-left align-middle">Nama Barang</th>
            <th className="text-left align-middle">Satuan</th>
            <th className="text-left align-middle">Kategori</th>
            <th className="text-left align-middle">Stock</th>
          </ModalMain>
        </Modal>
      )}
      {show_modal_barang && is_hasil && (
        <Modal modal_title={"Barang HASIL"} className={["md:modal-md", "modal-xl"]}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang_hasil}
            is_action_select
            conf={{
              name: "stock_barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama_barang", "nama_satuan", "nama_kategori", "stock"],
              order: [["barcode", "ASC"]],
              where: `periode = '${moment(repack_barang.tanggal).format("YYYYMM")}' and repack = true and barang_induk = ${list_barang_proses.length > 0 ? "'" + list_barang_proses[0].barcode + "'" : "''"} and stock > 0`,
              likes: ["barcode", "nama_barang"],
              keyword: "",
              func_item: {
                stock: (item) => format_rupiah(item.stock, {}) + " " + item.nama_satuan,
              },
            }}
          >
            <th className="text-left align-middle action_select">Action</th>
            <th className="text-left align-middle">Barcode</th>
            <th className="text-left align-middle">Nama Barang</th>
            <th className="text-left align-middle">Satuan</th>
            <th className="text-left align-middle">Kategori</th>
            <th className="text-left align-middle">Stock</th>
          </ModalMain>
        </Modal>
      )}
      {show_modal_qty && is_proses && (
        <Modal modal_title="Input QTY Proses" className={["md:modal-sm", "modal-xl"]}>
          <ModalBarangQty
            barang_qty={barang_qty}
            set_barang_qty={set_barang_qty}
            list_barang={list_barang_proses}
            set_list_barang={set_list_barang_proses}
            list_barang_dua={list_barang_hasil}
            set_list_barang_dua={set_list_barang_hasil}
            is_edit={is_edit}
            is_req_edit={false}
            is_pro_hasil={is_proses}
            set_is_pro_hasil={set_is_proses}
            is_reduction={true}
          />
        </Modal>
      )}
      {show_modal_qty && is_hasil && (
        <Modal modal_title="Input QTY Hasil" className={["md:modal-sm", "modal-xl"]}>
          <ModalBarangQty
            barang_qty={barang_qty}
            set_barang_qty={set_barang_qty}
            list_barang={list_barang_hasil}
            set_list_barang={set_list_barang_hasil}
            list_barang_dua={list_barang_proses}
            is_edit={is_edit}
            is_req_edit={false}
            is_pro_hasil={is_hasil}
            set_is_pro_hasil={set_is_hasil}
            is_reduction={false}
            is_qty_disabled
          />
        </Modal>
      )}
    </>
  );
}

RepackBarang.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
