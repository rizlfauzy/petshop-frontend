import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye, faSearch, faTimes, faUser, faLock, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { set_show_grup } from "../../hooks/useStore";
import useAsync from "../../hooks/useAsync";
import { get_data, fetch_data } from "../../hooks/useFetch";
import useAlert from "../../hooks/useAlert";
import Modal from "../Modal";
import ModalMain from "../main/ModalMain";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function FormContainer() {
  const input_password_reff = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [kode_grup, set_kode_grup] = useState("");
  const [is_selected_grup, set_is_selected_grup] = useState(false);
  const { show_modal_grup } = useSelector((state) => state.conf);
  const dispatch = useDispatch();
  const { run } = useAsync();
  const { swalAlert } = useAlert();
  const navigate = useNavigate();
  const [grup, set_grup] = useState({
    kode_grup: "",
    nama_grup: "",
  });
  const [user, set_user] = useState({
    username: "",
    password: "",
    kode_grup: grup.kode_grup,
    nama_grup: grup.nama_grup,
  });

  useEffect(() => {
    async function get_grup() {
      const { error, message, data } = await run(get_data({
        url: "/grup-login?kode=" + kode_grup,
      }))
      if (error) throw new Error(message);
      set_grup(prev => ({ ...prev, kode_grup: data.kode, nama_grup: data.nama }));
      set_user(prev => ({ ...prev, kode_grup: data.kode, nama_grup: data.nama }));
    }

    if (is_selected_grup) get_grup();
  }, [is_selected_grup, kode_grup, run]);

  const handle_user = useCallback((e) => {
    set_user((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handle_grup = useCallback((e) => {
    set_grup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handle_submit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const form_data = new FormData(form);
      form_data.append("kode_grup", grup.kode_grup);
      const { error, message } = await run(fetch_data({ url: "/register", data: Object.fromEntries(form_data), method: "POST" }));
      if (error) throw new Error(message);
      swalAlert(message, "success");
      form.reset();
      navigate(`${VITE_PREFIX}login`, { replace: true });
    } catch (e) {
      return swalAlert(e.message, "error");
    }
  }, [navigate, run, swalAlert, grup.kode_grup]);

  return (
    <>
      <div className="forms-container">
        <div className="signin-signup">
          <form id="form_register" className="sign-in-form" onSubmit={handle_submit} method="post">
            <h2 className="title">Register</h2>
            <div className="input-field">
              <div className="w-[55px] grid place-items-center">
                <FontAwesomeIcon icon={faUser} className="text-slate-400" />
              </div>
              <input name="username" id="username" type="text" value={user.username} onChange={handle_user} placeholder="Username" />
            </div>
            <div className="input-field">
              <div className="w-[55px] grid place-items-center">
                <FontAwesomeIcon icon={faLock} className="text-slate-400" />
              </div>
              <div className="relative flex !px-0">
                <input name="password" id="password" type="password" placeholder="Password" autoComplete="new-password" value={user.password} onChange={handle_user} ref={input_password_reff} />
                <label htmlFor="show_password" className="btn_absolute_right">
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="inline-block w-10 text-slate-400" />
                  <input
                    className="hidden"
                    type="checkbox"
                    name="show_password"
                    id="show_password"
                    placeholder="Password"
                    onChange={(e) => {
                      setShowPassword(e.target.checked);
                      input_password_reff.current.type = e.target.checked ? "text" : "password";
                    }}
                  />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full max-w-[380px]">
              <div
                className="input-field !bg-[#2b2b2b] cursor-pointer "
                onClick={() => {
                  dispatch(set_show_grup(true));
                }}
              >
                <div className="w-[55px] grid place-items-center">
                  <FontAwesomeIcon icon={faChartPie} className="text-slate-400" />
                </div>
                <div className="relative flex !px-0">
                  <input name="nama_grup" id="nama_grup" className="cursor-pointer  !text-white" type="text" value={grup.nama_grup} onChange={handle_grup} readOnly placeholder="Grup" />
                  <button
                    className="btn_absolute_right hover:text-primary"
                    type="button"
                    onClick={() => {
                      dispatch(set_show_grup(true));
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} className="inline-block w-10 text-slate-400" />
                  </button>
                </div>
              </div>
              <button
                className="btn-sm text-white bg-red-600 !rounded-lg hover:bg-red-800 w-[55px] h-[55px]"
                onClick={() => {
                  set_grup({ kode_grup: "", nama_grup: "" });
                  set_user((prev) => ({ ...prev, kode_grup: "", nama_grup: "" }));
                }}
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} className="inline-block w-10 text-slate-400 text-[1.1rem]" />
              </button>
            </div>
            <button className="btn transparent" id="register" type="submit" name="register" value="Register">
              Register
            </button>
            {/* make login button */}
            <Link to={`${VITE_PREFIX}login`} className="mt-3">
              <button className="btn transparent !w-auto !border-none px-3 hover:!text-[#c3baa9] hover:!bg-transparent" id="login_btn" type="button">
                Sudah punya akun? Login disini
              </button>
            </Link>
          </form>
        </div>
      </div>
      {show_modal_grup && (
        <Modal modal_title="Grup" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_kode_grup}
            is_selected={set_is_selected_grup}
            is_login_modal={true}
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
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Kode</th>
            <th className="text-left align-middle">Nama</th>
          </ModalMain>
        </Modal>
      )}
    </>
  );
}
