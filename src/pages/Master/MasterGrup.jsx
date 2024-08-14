import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useDispatch, useSelector } from "react-redux";
import { set_show_modal, set_show_grup } from "../../hooks/useStore";
import { useCallback, useEffect, useState, useRef } from "react";
import useAsync from "../../hooks/useAsync";
import { get_data, fetch_data } from "../../hooks/useFetch";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useSession from "../../hooks/useSession";
import useAlert from "../../hooks/useAlert";
import { faMoneyCheck, faRefresh, faSave, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MasterGrup({ icon, title }) {
  const dispatch = useDispatch();
  const show_modal = useSelector((state) => state.conf.show_modal);
  const show_modal_grup = useSelector((state) => state.conf.show_modal_grup);
  const input_kode = useRef(null);
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const aktif_row = useRef(null);
  const [kode_grup, set_kode_grup] = useState("");
  const [is_selected, set_is_selected] = useState(false);
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert } = useAlert();
  const [grup, set_grup] = useState({
    kode: "",
    nama: "",
    aktif: true,
  });

  useEffect(() => {
    async function get_grup() {
      const { error, message, data } = await run(
        get_data({
          url: "/grup?kode=" + kode_grup,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      set_grup((state) => ({ ...state, ...data }));
    }

    if (is_selected) {
      get_grup();
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
  }, [is_selected, kode_grup, run, session]);

  const handle_modal = useCallback(async () => {
    dispatch(set_show_modal(true));
    dispatch(set_show_grup(true));
  }, [dispatch]);

  const handle_change = useCallback((e) => {
    const { name, value } = e.target;
    set_grup((state) => ({ ...state, [name]: value == "true" ? true : value == "false" ? false : value }));
  }, []);

  const handle_clear = useCallback(() => {
    set_kode_grup("");
    set_grup({
      kode: "",
      nama: "",
      aktif: true,
    });
    input_kode.current.disabled = true;
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    aktif_row.current.classList.add("!hidden");
    set_is_selected(false);
  }, []);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/grup",
          method: "POST",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          data: {
            kode: grup.kode.toUpperCase(),
            nama: grup.nama.toUpperCase(),
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [grup, run, session, swalAlert, handle_clear]);

  const handle_update = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/grup",
          method: "PUT",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          data: {
            kode: grup.kode.toUpperCase(),
            nama: grup.nama.toUpperCase(),
            aktif: grup.aktif,
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [grup, run, session, swalAlert, handle_clear]);

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
                <h5 className="mb-0 text-lg">GRUP</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="kode" className="input-group-text">
                        KODE GRUP
                      </label>
                    </div>
                    <input type="text" value={grup.kode} className="form-control col-half" name="kode" id="kode" onChange={handle_change} ref={input_kode} placeholder="KODE" required />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama" className="input-group-text">
                        NAMA GRUP
                      </label>
                    </div>
                    <input
                      type="text"
                      value={grup.nama}
                      className="form-control col-half"
                      name="nama"
                      id="nama"
                      placeholder="NAMA"
                      onChange={handle_change}
                      onKeyDown={(e) => {
                        if (e.keyCode == 13) handle_save();
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="row my-2 !hidden" ref={aktif_row}>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <span className="input-group-text">AKTIF</span>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!grup.aktif} className="form-control" name="aktif" id="aktif_radio" onChange={handle_change} checked={grup.aktif} required />
                      <div className="input-group-prepend">
                        <label htmlFor="aktif_radio" className="input-group-text">
                          YA
                        </label>
                      </div>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!grup.aktif} className="form-control" name="aktif" id="non_aktif_radio" onChange={handle_change} checked={grup.aktif ? false : true} required />
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
      {show_modal && show_modal_grup && (
        <Modal modal_title="Grup" className={["md:modal-sm", "modal-xl"]}>
          <ModalMain
            set={set_kode_grup}
            is_selected={set_is_selected}
            conf={{
              name: "grup",
              limit: 5,
              page: 1,
              select: ["kode", "nama", "aktif"],
              order: [["kode", "ASC"]],
              where: "kode <> 'ITS'",
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

MasterGrup.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
};
