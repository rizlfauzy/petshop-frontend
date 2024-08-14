import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { set_show_modal, set_show_kategori } from "../../hooks/useStore";
import { useCallback, useEffect, useState, useRef } from "react";
import useAsync from "../../hooks/useAsync";
import { get_data, fetch_data } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useSession from "../../hooks/useSession";
import useAlert from "../../hooks/useAlert";
import { faMoneyCheck, faRefresh, faSave, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MasterKategori({ icon, title }) {
  const dispatch = useDispatch();
  const { show_modal, show_modal_kategori } = useSelector((state) => state.conf);
  const input_kode = useRef(null);
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const aktif_row = useRef(null);
  const [kode_kategori, set_kode_kategori] = useState("");
  const [is_selected, set_is_selected] = useState(false);
  const [kategori, set_kategori] = useState({
    kode: "",
    nama: "",
    aktif: true,
  });
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert } = useAlert();

  useEffect(() => {
    async function get_kategori() {
      const { error, message, data } = await run(
        get_data({
          url: "/kategori?kode=" + kode_kategori,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      set_kategori((state) => ({ ...state, ...data }));
    }

    if (is_selected) {
      get_kategori();
      input_kode.current.disabled = true;
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      aktif_row.current.classList.remove("!hidden");
    } else {
      input_kode.current.disabled = true;
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      aktif_row.current.classList.add("!hidden");
    }
  }, [is_selected, kode_kategori, run, session]);

  const handle_modal = useCallback(() => {
    dispatch(set_show_modal(true));
    dispatch(set_show_kategori(true));
  }, [dispatch]);

  const handle_change = useCallback((e) => {
    const { name, value } = e.target;
    set_kategori((state) => ({ ...state, [name]: value == "true" ? true : value == "false" ? false : value }));
  }, []);

  const handle_clear = useCallback(() => {
    set_kode_kategori("");
    set_is_selected(false);
    set_kategori({
      kode: "",
      nama: "",
      aktif: true,
    });
    input_kode.current.disabled = true;
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    aktif_row.current.classList.add("!hidden");
  }, []);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/kategori",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: kategori,
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [kategori, run, session.token, swalAlert, handle_clear]);

  const handle_update = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/kategori",
          method: "PUT",
          headers: { authorization: `Bearer ${session.token}` },
          data: kategori,
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [kategori, run, session.token, swalAlert, handle_clear]);

  const handle_save_on_enter = useCallback(
    (e) => {
      if (is_selected && e.key === "Enter") handle_update();
      else if (!is_selected && e.key === "Enter") handle_save();
    },
    [handle_save, handle_update, is_selected]
  );

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button ref={btn_save} id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <FontAwesomeIcon icon={faSave} className="mr-[10px]" />
          Save
        </button>
        <button ref={btn_update} id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <FontAwesomeIcon icon={faMoneyCheck} className="mr-[10px]" />
          Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_modal}>
          <FontAwesomeIcon icon={faSearch} className="mr-[10px]" />
          Find
        </button>
        <button id="clear" className="btn-sm bg-primary text-white" onClick={handle_clear}>
          <FontAwesomeIcon icon={faRefresh} className="mr-[10px]" />
          Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-lg">KATEGORI</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="kode" className="input-group-text">
                        KODE KATEGORI
                      </label>
                    </div>
                    <input type="text" value={kategori.kode} className="form-control col-half" name="kode" id="kode" ref={input_kode} placeholder="KODE" onChange={handle_change} required />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama" className="input-group-text">
                        NAMA KATEGORI
                      </label>
                    </div>
                    <input type="text" value={kategori.nama} className="form-control col-half" name="nama" id="nama" onChange={handle_change} onKeyDown={handle_save_on_enter} placeholder="NAMA" required />
                  </div>
                </div>
                <div className="row my-2 !hidden" ref={aktif_row}>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <span className="input-group-text">AKTIF</span>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!kategori.aktif} className="form-control" name="aktif" id="aktif_radio" checked={kategori.aktif} onChange={handle_change} required />
                      <div className="input-group-prepend">
                        <label htmlFor="aktif_radio" className="input-group-text">
                          YA
                        </label>
                      </div>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!kategori.aktif} className="form-control" name="aktif" id="non_aktif_radio" checked={kategori.aktif ? false : true} onChange={handle_change} required />
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
      {show_modal && show_modal_kategori && (
        <Modal modal_title="Kategori" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_kode_kategori}
            is_selected={set_is_selected}
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
    </>
  );
}

MasterKategori.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
