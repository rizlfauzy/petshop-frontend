import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useRef, useCallback, useState, useLayoutEffect, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faCancel, faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { set_show_barang, set_show_barang_rusak, set_hide_all_modal, set_show_qty, set_show_loading, set_show_barang_rusak_non_approved } from "../../hooks/useStore";
import useSession from "../../hooks/useSession";
import useAlert from "../../hooks/useAlert";
import useAsync from "../../hooks/useAsync";
import { get_data, fetch_data } from "../../hooks/useFetch";
import ListBarang from "../../components/main/ListBarang";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useFormating from "../../hooks/useFormating";
import ModalBarangQty from "../../components/main/ModalBarangQty";

export default function BarangRusak({ icon, title }) {
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_reject = useRef(null);
  const btn_approve = useRef(null);
  const btn_find_approve = useRef(null);
  const btn_search_barang = useRef(null);
  const textarea_keterangan = useRef(null);
  const input_barcode = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [barcode, set_barcode] = useState("");
  const [nomor, set_nomor] = useState("");
  const [keyword, set_keyword] = useState("");
  const [grup, set_grup] = useState(null);
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [is_selected_barang_rusak, set_is_selected_barang_rusak] = useState(false);
  const [is_selected_barang_rusak_unapproved, set_is_selected_barang_rusak_unapproved] = useState(false);
  const [list_barang, set_list_barang] = useState([]);
  const [is_edit, set_is_edit] = useState(false);
  const [is_find_approved, set_is_find_approved] = useState(null);
  const [barang_rusak, set_barang_rusak] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const [barang_qty, set_barang_qty] = useState({
    barcode: "",
    nama_barang: "",
    qty: 0,
    stock: 0,
    harga: 0,
    total_harga: 0,
  });
  const { date_picker } = useDatePicker();
  const dispatch = useDispatch();
  const { show_modal_barang, show_modal_barang_rusak, show_modal_qty, show_modal_barang_rusak_non_approved } = useSelector((state) => state.conf);
  const { session } = useSession();
  const { swalAlert, swalAlertConfirm, swalAlertInput } = useAlert();
  const { run } = useAsync();
  const { format_rupiah } = useFormating();

  const get_stock = useCallback(
    async (barcode) => {
      const { error, message, data } = await run(
        get_data({
          url: `/stock?barcode=${barcode}&periode=${moment(barang_rusak.tanggal).format("YYYYMM")}`,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (data) {
        const stock = list_barang.some((item) => item.barcode === data.barcode) ? data.stock - list_barang.find((item) => item.barcode === data.barcode).qty : data.stock;
        set_barang_qty((prev) => ({
          ...prev,
          ...data,
          total_harga: 0,
          harga: data.harga_modal,
          qty: 0,
          stock,
        }));
      }
      return { error, message, data };
    },
    [run, session, barang_rusak.tanggal, list_barang]
  );

  const get_barang_rusak = useCallback(async () => {
    const { error, message, data } = await run(
      get_data({
        url: "/barang-rusak?nomor=" + nomor,
        headers: { authorization: `Bearer ${session.token}` },
      })
    );
    if (error) throw new Error(message);
    if (data) {
      if (!data.is_approved) {
        set_is_find_approved(true);
        btn_save.current.disabled = true;
        btn_update.current.disabled = true;
        btn_approve.current.disabled = false;
        btn_cancel.current.disabled = true;
        btn_reject.current.disabled = false;
        btn_cancel.current.classList.add("hidden");
        btn_reject.current.classList.remove("hidden");
        textarea_keterangan.current.disabled = true;
        btn_search_barang.current.disabled = true;
        input_barcode.current.disabled = true;
      }
      set_barang_rusak((prev) => ({ ...prev, nomor: data.nomor, tanggal: data.tanggal, keterangan: data.keterangan }));
      const goods = data.list_barang.map((item) => ({
        barcode: item.barcode,
        nama_barang: item.nama_barang,
        stock: Number(item.stock) + Number(item.qty),
        qty: item.qty,
        harga: item.harga,
        total_harga: item.total,
      }));
      set_list_barang(goods);
    }
  }, [run, nomor, session]);

  useLayoutEffect(() => {
    const date = date_picker({ id: "tanggal", selected_date: barang_rusak.tanggal });
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_barang_rusak((prev) => ({
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

    setTimeout(() => {
      const grup = document.getElementById("grup");
      set_grup(grup);
      if (grup.value == "ITS" || grup.value == "GR-00003") btn_find_approve.current.classList.remove("hidden");
    }, 500);

    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref, list_barang, barang_rusak.tanggal]);

  useEffect(() => {
    if (is_selected_barang_rusak_unapproved) {
      get_barang_rusak();
      set_is_find_approved(true);
      btn_save.current.disabled = true;
      btn_update.current.disabled = true;
      btn_approve.current.disabled = false;
      btn_cancel.current.disabled = true;
      btn_reject.current.disabled = false;
      btn_cancel.current.classList.add("hidden");
      btn_reject.current.classList.remove("hidden");
      textarea_keterangan.current.disabled = true;
      btn_search_barang.current.disabled = true;
      input_barcode.current.disabled = true;
    }
  }, [is_selected_barang_rusak_unapproved, get_barang_rusak]);

  useEffect(() => {
    if (is_selected_barang_rusak) {
      get_barang_rusak();
      set_is_find_approved(false);
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      btn_approve.current.disabled = true;
      btn_cancel.current.disabled = false;
      btn_reject.current.disabled = true;
      btn_cancel.current.classList.remove("hidden");
      btn_reject.current.classList.add("hidden");
      textarea_keterangan.current.disabled = false;
      btn_search_barang.current.disabled = false;
      input_barcode.current.disabled = false;
    }
  }, [is_selected_barang_rusak, get_barang_rusak]);

  useEffect(() => {
    setTimeout(() => {
      if (!is_selected_barang_rusak_unapproved && !show_modal_barang_rusak && !is_selected_barang_rusak && !show_modal_barang_rusak_non_approved) {
        btn_save.current.disabled = false;
        btn_update.current.disabled = true;
        btn_approve.current.disabled = true;
        btn_cancel.current.disabled = true;
        btn_reject.current.disabled = true;
        btn_cancel.current.classList.add("hidden");
        btn_reject.current.classList.add("hidden");
        textarea_keterangan.current.disabled = false;
        btn_search_barang.current.disabled = false;
        input_barcode.current.disabled = false;
      }
    }, 500);
  }, [is_selected_barang_rusak_unapproved, is_selected_barang_rusak, show_modal_barang_rusak, show_modal_barang_rusak_non_approved]);

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
    dispatch(set_show_loading(true));
    setTimeout(() => {
      set_barang_rusak({
        nomor: "",
        tanggal: moment().format("YYYY-MM-DD"),
        keterangan: "",
      });
      set_barang_qty({
        barcode: "",
        nama_barang: "",
        stock: 0,
        qty: 0,
        harga: 0,
        total_harga: 0,
      });
      set_list_barang([]);
      set_is_selected_barang(false);
      set_is_selected_barang_rusak(false);
      set_is_selected_barang_rusak_unapproved(false);
      set_barcode("");
      set_is_edit(false);
      set_keyword("");
      dispatch(set_hide_all_modal());
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_approve.current.disabled = true;
      btn_cancel.current.disabled = true;
      btn_reject.current.disabled = true;
      btn_cancel.current.classList.add("hidden");
      btn_reject.current.classList.add("hidden");
      textarea_keterangan.current.disabled = false;
      btn_search_barang.current.disabled = false;
      input_barcode.current.disabled = false;
      dispatch(set_show_loading(false));
    }, 1000);
  }, [dispatch]);

  const handle_save = useCallback(async () => {
    try {
      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/barang-rusak",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...barang_rusak,
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
  }, [swalAlert, list_barang, barang_rusak, run, session, handle_clear, dispatch]);

  const handle_approve = useCallback(async () => {
    try {
      const confirm = await swalAlertConfirm("Data akan segera diapprove !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/barang-rusak/approve",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...barang_rusak,
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
  }, [barang_rusak, list_barang, run, session, swalAlert, swalAlertConfirm, dispatch, handle_clear]);

  const handle_update = useCallback(async () => {
    try {
      const confirm = await swalAlertConfirm("Data akan segera diupdate !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/barang-rusak",
          method: "PUT",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            ...barang_rusak,
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
  }, [handle_clear, list_barang, barang_rusak, run, session, swalAlert, swalAlertConfirm, dispatch]);

  const handle_cancel = useCallback(async () => {
    try {
      const confirm = await swalAlertInput("Data yang dicancel tidak bisa dikembalikan !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/barang-rusak",
          method: "DELETE",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            nomor: barang_rusak.nomor,
            alasan: confirm.value,
            tanggal: barang_rusak.tanggal,
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
  }, [handle_clear, barang_rusak, run, session, swalAlertInput, swalAlert, dispatch]);

  const handle_reject = useCallback(async () => {
    try {
      const confirm = await swalAlertInput("Data yang direject tidak bisa dikembalikan !!!", "warning");
      if (!confirm.isConfirmed) return;

      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/barang-rusak/reject",
          method: "DELETE",
          headers: { authorization: `Bearer ${session.token}` },
          data: {
            nomor: barang_rusak.nomor,
            alasan: confirm.value,
            tanggal: barang_rusak.tanggal,
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
  }, [handle_clear, barang_rusak, run, session, swalAlertInput, swalAlert, dispatch]);

  const handle_find_barang_rusak = useCallback(() => {
    // set_is_selected_barang_rusak_unapproved(false);
    dispatch(set_show_barang_rusak(true));
  }, [dispatch]);

  const handle_find_barang_rusak_non_approved = useCallback(() => {
    // set_is_selected_barang_rusak(false);
    dispatch(set_show_barang_rusak_non_approved(true));
  }, [dispatch]);

  const handle_change_barang_rusak = useCallback((e) => {
    set_barang_rusak((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        <button ref={btn_approve} id="approve" className="btn-sm bg-green-500 hover:bg-green-800 text-white" onClick={handle_approve}>
          <FontAwesomeIcon icon={"thumbs-up"} className="mr-[10px]" />
          Approve
        </button>
        <button ref={btn_find_approve} id="find_approve" className="btn-sm bg-yellow-500 hover:bg-yellow-800 text-white hidden" onClick={handle_find_barang_rusak_non_approved}>
          <FontAwesomeIcon icon={"search-minus"} className="mr-[10px]" />
          Find Approve
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_barang_rusak}>
          <FontAwesomeIcon icon={"search"} className="mr-[10px]" />
          Find
        </button>
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white hidden" ref={btn_cancel} onClick={handle_cancel}>
          <FontAwesomeIcon icon={faCancel} className="mr-[10px]" />
          Cancel
        </button>
        <button id="reject" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white" ref={btn_reject} onClick={handle_reject}>
          <FontAwesomeIcon icon={"times-circle"} className="mr-[10px]" />
          Reject
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
                        Nomor BR
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Barang Rusak" value={barang_rusak.nomor} onChange={handle_change_barang_rusak} readOnly />
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={barang_rusak.tanggal} required readOnly />
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
                      className="form-control md:col-thirdperfour col-half disabled:bg-[#eee]"
                      rows={5}
                      placeholder="Keterangan ..."
                      value={barang_rusak.keterangan}
                      onInput={handle_change_barang_rusak}
                      onKeyDown={handle_keterangan}
                      ref={textarea_keterangan}
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
                        ref={btn_search_barang}
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
                      ref={input_barcode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ListBarang set_list_barang={set_list_barang} list_barang={list_barang} set_barang_qty={set_barang_qty} set_is_edit={set_is_edit} is_find_approved={is_find_approved} />
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
              where: `periode = '${moment(barang_rusak.tanggal).format("YYYYMM")}' and stock > 0`,
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
      {show_modal_barang_rusak_non_approved && (
        <Modal modal_title="Barang Rusak Non Approved" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_barang_rusak_unapproved}
            conf={{
              name: "one_barang_rusak",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan"],
              order: [["nomor", "ASC"]],
              where: { batal: false, is_approved: false },
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
      {show_modal_barang_rusak && (
        <Modal modal_title="Barang Rusak" className={["md:modal-md", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_barang_rusak}
            conf={{
              name: "one_barang_rusak",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan", "is_approved"],
              order: [["nomor", "ASC"]],
              where: grup.value == "ITS" || grup.value == "GR-00003" ? { batal: false } : { batal: false, is_approved: true },
              likes: ["nomor"],
              keyword: "",
              func_item: {
                tanggal: (item) => moment(item.tanggal).format("DD MMMM YYYY"),
                is_approved: (item) => (
                  <div className="mx-auto text-center">
                    {item.is_approved ? <span className="p-2 bg-green-500 rounded-md text-center text-white">Approved</span> : <span className="p-2 bg-red-500 rounded-md text-center text-white">Non Approved</span>}
                  </div>
                ),
              },
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Nomor</th>
            <th className="text-left align-middle">Tanggal</th>
            <th className="text-left align-middle">Keterangan</th>
            <th className="text-left align-middle">Status</th>
          </ModalMain>
        </Modal>
      )}
      {show_modal_qty && (
        <Modal modal_title="Input QTY" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalBarangQty barang_qty={barang_qty} set_barang_qty={set_barang_qty} list_barang={list_barang} set_list_barang={set_list_barang} is_edit={is_edit} is_reduction={true} is_harga_modal={true} />
        </Modal>
      )}
    </>
  );
}

BarangRusak.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
