import PropType from "prop-types";
import { useCallback, useRef, useState, useEffect } from "react";
import HeaderPage from "../../components/HeaderPage";
import useAsync from "../../hooks/useAsync";
import useAlert from "../../hooks/useAlert";
import { get_data, fetch_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPercent, faFileExcel, faFileImport } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { set_show_modal, set_show_kategori, set_show_satuan, set_show_barang, set_show_import } from "../../hooks/useStore";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useFormating from "../../hooks/useFormating";
import ModalImport from "../../components/main/ModalImport";
import useSocket from "../../hooks/useSocket";
import moment from "moment";
const { VITE_BACKEND } = import.meta.env;

export default function MasterBarang({ icon, title }) {
  const aktif_row = useRef(null);
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const input_barcode = useRef(null);
  const [kode_satuan, set_kode_satuan] = useState("");
  const [kode_kategori, set_kode_kategori] = useState("");
  const [barcode, set_barcode] = useState("");
  const [is_selected_satuan, set_is_selected_satuan] = useState(false);
  const [is_selected_kategori, set_is_selected_kategori] = useState(false);
  const [is_selected_barang, set_is_selected_barang] = useState(false);
  const [satuan, set_satuan] = useState({
    kode_satuan: "",
    nama_satuan: "",
  });
  const [kategori, set_kategori] = useState({
    kode_kategori: "",
    nama_kategori: "",
  });
  const [barang, set_barang] = useState({
    barcode: "",
    nama: "",
    kode_satuan: satuan.kode_satuan,
    nama_satuan: satuan.nama_satuan,
    kode_kategori: kategori.kode_kategori,
    nama_kategori: kategori.nama_kategori,
    min_stock: 0,
    disc: 0,
    harga_jual: 0,
    harga_modal: 0,
    keterangan: "",
    aktif: true,
  });
  const { session } = useSession();
  const { run } = useAsync();
  const { swalAlert } = useAlert();
  const dispatch = useDispatch();
  const { show_modal_satuan, show_modal_kategori, show_modal_barang, show_modal, show_modal_import } = useSelector((state) => state.conf);
  const { format_rupiah, format_disc } = useFormating();
  const socket = useSocket("notif");

  useEffect(() => {
    async function get_satuan() {
      const { error, message, data } = await run(
        get_data({
          url: "/satuan?kode=" + kode_satuan,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      set_satuan((prev) => ({ ...prev, kode_satuan: data.kode, nama_satuan: data.nama }));
      set_barang((prev) => ({ ...prev, kode_satuan: data.kode, nama_satuan: data.nama }));
    }

    if (is_selected_satuan) get_satuan();
  }, [is_selected_satuan, kode_satuan, run, session]);

  useEffect(() => {
    async function get_kategori() {
      const { error, message, data } = await run(
        get_data({
          url: "/kategori?kode=" + kode_kategori,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      set_kategori((prev) => ({ ...prev, kode_kategori: data.kode, nama_kategori: data.nama }));
      set_barang((prev) => ({ ...prev, kode_kategori: data.kode, nama_kategori: data.nama }));
    }

    if (is_selected_kategori) get_kategori();
  }, [is_selected_kategori, kode_kategori, run, session]);

  useEffect(() => {
    async function get_barang() {
      const { error, message, data } = await run(
        get_data({
          url: "/barang?barcode=" + barcode,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      set_barang((prev) => ({ ...prev, ...data, disc: format_disc(data.disc), harga_jual: format_rupiah(data.harga_jual), harga_modal: format_rupiah(data.harga_modal), min_stock: format_rupiah(data.min_stock, {}) }));
      set_satuan((prev) => ({ ...prev, kode_satuan: data.kode_satuan, nama_satuan: data.nama_satuan }));
      set_kategori((prev) => ({ ...prev, kode_kategori: data.kode_kategori, nama_kategori: data.nama_kategori }));
    }

    if (is_selected_barang) {
      get_barang();
      input_barcode.current.disabled = true;
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      aktif_row.current.classList.remove("!hidden");
    } else if (!is_selected_barang) {
      input_barcode.current.disabled = false;
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      aktif_row.current.classList.add("!hidden");
    }
  }, [is_selected_barang, barcode, run, session])

  const handle_change_barang = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name == "min_stock" || name == "disc" || name == "harga_jual" || name == "harga_modal") {
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
        set_barang((prev) => ({
          ...prev,
          [name]: name == "disc" ? format_disc(e.target.value) : name == "min_stock" ? format_rupiah(e.target.value, {}) : format_rupiah(e.target.value),
        }));
        return;
      }
      set_barang((prev) => ({
        ...prev,
        [name]: value === "true" ? true : value === "false" ? false : value,
      }));
    },
    [format_rupiah, format_disc]
  );

  const handle_change_satuan = useCallback((e) => {
    const { name, value } = e.target;
    set_satuan((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handle_change_kategori = useCallback((e) => {
    const { name, value } = e.target;
    set_kategori((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handle_find_satuan = useCallback(() => {
    dispatch(set_show_satuan(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_find_kategori = useCallback(() => {
    dispatch(set_show_kategori(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_find_barang = useCallback(() => {
    dispatch(set_show_barang(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_clear = useCallback(() => {
    set_satuan({
      kode_satuan: "",
      nama_satuan: "",
    });
    set_kategori({
      kode_kategori: "",
      nama_kategori: "",
    });
    set_barang({
      barcode: "",
      nama: "",
      kode_satuan: satuan.kode_satuan,
      nama_satuan: satuan.nama_satuan,
      kode_kategori: kategori.kode_kategori,
      nama_kategori: kategori.nama_kategori,
      min_stock: 0,
      disc: 0,
      harga_jual: 0,
      harga_modal: 0,
      keterangan: "",
      aktif: true,
    });
    set_kode_satuan("");
    set_kode_kategori("");
    set_barcode("");
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    aktif_row.current.classList.add("!hidden");
    set_is_selected_satuan(false);
    set_is_selected_kategori(false);
    set_is_selected_barang(false);
  }, [satuan, kategori]);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/barang",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          method: "POST",
          data: barang,
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      socket.emit("notif", { periode: moment().format("YYYYMM") });
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, session, barang, swalAlert, handle_clear, socket]);

  const handle_update = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/barang",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          method: "PUT",
          data: { ...barang, old_barcode: barcode },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      socket.emit("notif", { periode: moment().format("YYYYMM") });
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, session, barang, swalAlert, handle_clear, barcode, socket]);

  const handle_export = useCallback(async () => {
    try {
      const { error, message, file } = await run(
        get_data({
          url: "/goods/excel",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      const a = document.createElement("a");
      a.href = `${VITE_BACKEND}/${file}`;
      a.download = file.split("/").pop();
      a.target = "_blank";
      a.click();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, session, swalAlert]);

  const handle_modal_import = useCallback(() => {
    dispatch(set_show_import(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_keterangan = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, []);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="export" className="btn-sm bg-green-600 hover:bg-green-800 active:bg-green-950 text-white" onClick={handle_export}>
          <FontAwesomeIcon icon={faFileExcel} className="mr-[10px]" />
          Export
        </button>
        <button id="import" className="btn-sm bg-yellow-600 hover:bg-yellow-800 active:bg-yellow-950 text-white" onClick={handle_modal_import}>
          <FontAwesomeIcon icon={faFileImport} className="mr-[10px]" /> Import
        </button>
        <button ref={btn_save} id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <i className="far fa-save mr-[10px]"></i>Save
        </button>
        <button ref={btn_update} id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <i className="far fa-money-check-edit mr-[10px]"></i>Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_barang}>
          <i className="far fa-file-search mr-[10px]"></i>Find
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
                <h5 className="mb-0 text-lg">BARANG</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="col-quarter p-0 input-group-prepend">
                      <label htmlFor="barcode" className="input-group-text">
                        Barcode
                      </label>
                    </div>
                    <input value={barang.barcode} ref={input_barcode} onChange={handle_change_barang} type="text" className="form-control col-thirdperfour" name="barcode" id="barcode" required placeholder="BARCODE BARANG" />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="col-quarter p-0 input-group-prepend">
                      <label htmlFor="nama" className="input-group-text">
                        NAMA
                      </label>
                    </div>
                    <input value={barang.nama} onChange={handle_change_barang} type="text" className="form-control col-thirdperfour" name="nama" id="nama" required placeholder="NAMA BARANG" />
                  </div>
                </div>
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama_satuan" className="input-group-text">
                        KODE SATUAN
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input value={satuan.nama_satuan} type="text" className="form-control" name="nama_satuan" id="nama_satuan" placeholder="tekan tombol cari" onChange={handle_change_satuan} required readOnly />
                      <button className="btn_absolute_right !right-1 hover:text-primary" type="button" onClick={handle_find_satuan}>
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama_kategori" className="input-group-text">
                        KODE KATEGORI
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input value={kategori.nama_kategori} type="text" className="form-control" name="nama_kategori" id="nama_kategori" placeholder="tekan tombol cari" onChange={handle_change_kategori} required readOnly />
                      <button className="btn_absolute_right !right-1 hover:text-primary" type="button" onClick={handle_find_kategori}>
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="min_stock" className="input-group-text">
                        MIN. STOK
                      </label>
                    </div>
                    <input value={barang.min_stock} onChange={handle_change_barang} type="text" className="form-control col-half" name="min_stock" id="min_stock" required placeholder="MINIMAL STOCK" />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="disc" className="input-group-text">
                        DISC. ITEM
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input value={barang.disc} onChange={handle_change_barang} type="text" className="form-control" name="disc" id="disc" required placeholder="DISKON ITEM" />
                      <button className="btn_absolute_right !right-1 hover:text-primary !cursor-auto" type="button" disabled>
                        <FontAwesomeIcon icon={faPercent} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="harga_jual" className="input-group-text">
                        HARGA JUAL
                      </label>
                    </div>
                    <input value={barang.harga_jual} onChange={handle_change_barang} type="text" className="form-control col-half" name="harga_jual" id="harga_jual" required placeholder="HARGA JUAL" />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="harga_modal" className="input-group-text">
                        HARGA MODAL
                      </label>
                    </div>
                    <input value={barang.harga_modal} onChange={handle_change_barang} type="text" className="form-control col-half" name="harga_modal" id="harga_modal" required placeholder="HARGA MODAL" />
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
                      placeholder="Keterangan ..."
                      value={barang.keterangan}
                      onInput={handle_change_barang}
                      onKeyDown={handle_keterangan}
                    ></textarea>
                  </div>
                </div>
                <div className="row my-2 !hidden" ref={aktif_row}>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <span className="input-group-text">AKTIF</span>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!barang.aktif} onChange={handle_change_barang} checked={barang.aktif} className="form-control" name="aktif" id="aktif_radio" required />
                      <div className="input-group-prepend">
                        <label htmlFor="aktif_radio" className="input-group-text">
                          YA
                        </label>
                      </div>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!barang.aktif} onChange={handle_change_barang} checked={barang.aktif ? false : true} className="form-control" name="aktif" id="non_aktif_radio" required />
                      <div className="input-group-prepend">
                        <label htmlFor="non_aktif_radio" className="input-group-text">
                          TIDAK
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {show_modal && show_modal_satuan && (
        <Modal modal_title="Satuan" className={["modal-md"]} btn={<></>}>
          <ModalMain
            set={set_kode_satuan}
            is_selected={set_is_selected_satuan}
            conf={{
              name: "satuan",
              limit: 5,
              page: 1,
              select: ["kode", "nama", "aktif"],
              order: [["kode", "ASC"]],
              where: "kode <> 'ITS' and aktif = true",
              likes: ["kode", "nama"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
              },
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Kode</th>
              <th className="text-left align-middle">Nama</th>
              <th className="text-left align-middle">Aktif</th>
            </>
          </ModalMain>
        </Modal>
      )}
      {show_modal && show_modal_kategori && (
        <Modal modal_title="Kategori" className={["modal-md"]} btn={<></>}>
          <ModalMain
            set={set_kode_kategori}
            is_selected={set_is_selected_kategori}
            conf={{
              name: "kategori",
              limit: 5,
              page: 1,
              select: ["kode", "nama", "aktif"],
              order: [["kode", "ASC"]],
              where: {},
              likes: ["kode", "nama"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
              },
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Kode</th>
              <th className="text-left align-middle">Nama</th>
              <th className="text-left align-middle">Aktif</th>
            </>
          </ModalMain>
        </Modal>
      )}
      {show_modal && show_modal_barang && (
        <Modal modal_title="Barang" className={["modal-md"]} btn={<></>}>
          <ModalMain
            set={set_barcode}
            is_selected={set_is_selected_barang}
            conf={{
              name: "barang",
              limit: 5,
              page: 1,
              select: ["barcode", "nama", "nama_satuan", "nama_kategori", "min_stock", "disc", "harga_jual", "harga_modal", "aktif"],
              order: [["barcode", "ASC"]],
              where: {},
              likes: ["barcode", "nama"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
                disc: (item) => format_disc(item.disc) + "%",
                harga_jual: (item) => format_rupiah(item.harga_jual),
                harga_modal: (item) => format_rupiah(item.harga_modal),
                min_stock: (item) => format_rupiah(item.min_stock, {}),
              },
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Barcode</th>
              <th className="text-left align-middle">Nama</th>
              <th className="text-left align-middle">Nama Satuan</th>
              <th className="text-left align-middle">Nama Kategori</th>
              <th className="text-left align-middle">Min Stock</th>
              <th className="text-left align-middle">Disc</th>
              <th className="text-left align-middle">Harga Jual</th>
              <th className="text-left align-middle">Harga Modal</th>
              <th className="text-left align-middle">Aktif</th>
            </>
          </ModalMain>
        </Modal>
      )}
      {show_modal && show_modal_import && <ModalImport />}
    </>
  );
}

MasterBarang.propTypes = {
  icon: PropType.node,
  title: PropType.string,
};
