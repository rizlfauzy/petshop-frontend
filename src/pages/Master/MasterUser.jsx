import HeaderPage from "../../components/HeaderPage";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faMoneyCheck, faSave, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_show_modal, set_show_grup, set_show_user } from "../../hooks/useStore";
import Modal from "../../components/Modal";
import ModalMain from "../../components/main/ModalMain";
import useAsync from "../../hooks/useAsync";
import useAlert from "../../hooks/useAlert";
import { get_data, fetch_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";

export default function MasterUser({ icon, title }) {
  const input_password = useRef(null);
  const aktif_row = useRef(null);
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [is_selected_grup, set_is_selected_grup] = useState(false);
  const [is_selected_user, set_is_selected_user] = useState(false);
  const [username, set_username] = useState("");
  const [kode_grup, set_kode_grup] = useState("");
  const [grup, set_grup] = useState({
    kode_grup: "",
    nama_grup: "",
  });
  const [user, set_user] = useState({
    username: "",
    password: "",
    kode_grup: grup.kode_grup,
    nama_grup: grup.nama_grup,
    aktif: true,
  });
  const dispatch = useDispatch();
  const { show_modal, show_modal_grup, show_modal_user } = useSelector((state) => state.conf);
  const { run } = useAsync();
  const { swalAlert } = useAlert();
  const { session } = useSession();

  useEffect(() => {
    async function get_grup() {
      const { error, message, data } = await run(
        get_data({
          url: "/grup?kode=" + kode_grup,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      set_grup((state) => ({ ...state, kode_grup: data.kode, nama_grup: data.nama }));
      set_user((state) => ({ ...state, kode_grup: data.kode, nama_grup: data.nama }));
    }

    async function get_user() {
      const { error, message, data } = await run(
        get_data({
          url: "/user?username=" + username,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      set_user((state) => ({ ...state, ...data }));
      set_grup((state) => ({ ...state, ...data }));
    }

    if (is_selected_grup) {
      get_grup();
    }
    if (is_selected_user) {
      get_user();
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      aktif_row.current.classList.remove("!hidden");
    } else if (!is_selected_user) {
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      aktif_row.current.classList.add("!hidden");
    }
  }, [is_selected_grup, is_selected_user, kode_grup, username, run, session]);

  const handle_find_grup = useCallback(() => {
    dispatch(set_show_grup(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_find_user = useCallback(() => {
    dispatch(set_show_user(true));
    dispatch(set_show_modal(true));
  }, [dispatch]);

  const handle_change_grup = useCallback((e) => {
    const { name, value } = e.target;
    set_grup((state) => ({ ...state, [name]: value }));
    set_user((state) => ({ ...state, [name]: value }));
  }, []);

  const handle_change_user = useCallback((e) => {
    const { name, value } = e.target;
    set_user((state) => ({ ...state, [name]: value == "true" ? true : value == "false" ? false : value }));
  }, []);

  const handle_clear = useCallback(() => {
    set_user({
      username: "",
      password: "",
      kode_grup: "",
      nama_grup: "",
      aktif: true,
    });
    set_grup({
      kode_grup: "",
      nama_grup: "",
    });
    set_kode_grup("");
    set_username("");
    input_password.current.type = "password";
    setShowPassword(false);
    btn_save.current.disabled = false;
    btn_update.current.disabled = true;
    aktif_row.current.classList.add("!hidden");
    set_is_selected_user(false);
    set_is_selected_grup(false);
  }, []);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/user",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          method: "POST",
          data: user,
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, swalAlert, session, user, handle_clear]);

  const handle_update = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/user",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          method: "PUT",
          data: { ...user, old_username: username },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, swalAlert, session, user, handle_clear, username]);

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
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_user}>
          <FontAwesomeIcon icon={"search"} className="mr-[10px]" />
          Find
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
                <h5 className="mb-0 text-lg">USER</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="username" className="input-group-text">
                        USERNAME
                      </label>
                    </div>
                    <input value={user.username} onChange={handle_change_user} type="text" className="form-control col-half" name="username" id="username" required placeholder="Nama Pengguna" />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="password" className="input-group-text">
                        PASSWORD
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input value={user.password} onChange={handle_change_user} ref={input_password} type="password" className="form-control w-full" name="password" id="password" required />
                      <label htmlFor="show_password" className="btn_absolute_right">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        <input
                          className="hidden"
                          type="checkbox"
                          name="show_password"
                          id="show_password"
                          placeholder="Password"
                          onChange={(e) => {
                            setShowPassword(e.target.checked);
                            input_password.current.type = e.target.checked ? "text" : "password";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama_grup" className="input-group-text">
                        NAMA GRUP
                      </label>
                    </div>
                    <input value={grup.nama_grup} type="text" className="form-control col-half" name="nama_grup" id="nama_grup" placeholder="nama grup" onChange={handle_change_grup} required readOnly />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="kode_grup" className="input-group-text">
                        KODE GRUP
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input value={grup.kode_grup} type="text" className="form-control" name="kode_grup" id="kode_grup" placeholder="tekan tombol cari" onChange={handle_change_grup} required readOnly />
                      <button className="btn_absolute_right hover:text-primary" type="button" onClick={handle_find_grup}>
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2 !hidden" ref={aktif_row}>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <span className="input-group-text">AKTIF</span>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!user.aktif} onChange={handle_change_user} checked={user.aktif} className="form-control" name="aktif" id="aktif_radio" required />
                      <div className="input-group-prepend">
                        <label htmlFor="aktif_radio" className="input-group-text">
                          YA
                        </label>
                      </div>
                    </div>
                    <div className="col-quarter flex items-center">
                      <input type="radio" value={!user.aktif} onChange={handle_change_user} checked={user.aktif ? false : true} className="form-control" name="aktif" id="non_aktif_radio" required />
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
        <Modal modal_title="Grup" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_kode_grup}
            is_selected={set_is_selected_grup}
            conf={{
              name: "grup",
              limit: 5,
              page: 1,
              select: ["kode", "nama"],
              order: [["kode", "ASC"]],
              where: "kode <> 'ITS' and aktif = true",
              likes: ["kode", "nama"],
              keyword: "",
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Kode</th>
              <th className="text-left align-middle">Nama</th>
            </>
          </ModalMain>
        </Modal>
      )}
      {show_modal && show_modal_user && (
        <Modal modal_title="User" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_username}
            is_selected={set_is_selected_user}
            conf={{
              name: "user",
              limit: 5,
              page: 1,
              select: ["username", "nama_grup", "aktif"],
              order: [["username", "ASC"]],
              where: "username <> 'IT'",
              likes: ["username", "nama_grup"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
              },
            }}
          >
            <>
              <th className="text-left align-middle">Action</th>
              <th className="text-left align-middle">Username</th>
              <th className="text-left align-middle">Grup</th>
              <th className="text-left align-middle">Aktif</th>
            </>
          </ModalMain>
        </Modal>
      )}
    </>
  );
}

MasterUser.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
