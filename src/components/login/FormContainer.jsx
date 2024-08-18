import useAsync from "../../hooks/useAsync";
import { fetch_data } from "../../hooks/useFetch";
import { useCallback, useRef, useState, useLayoutEffect } from "react";
import useAlert from "../../hooks/useAlert";
import useSession from "../../hooks/useSession";
// import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faLock, faUser } from "@fortawesome/free-solid-svg-icons";

const { VITE_PREFIX } = import.meta.env;

export default function FormContainer() {
  const input_password_reff = useRef(null);
  const input_username_reff = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const { run } = useAsync();
  const { swalAlert } = useAlert();
  const { setSessionData } = useSession();

  // auto focus ke input username ketika halaman login di load
  useLayoutEffect(() => {
    input_username_reff.current.focus();
    const event_visibility = () => input_username_reff.current.focus();
    document.addEventListener("visibilitychange", event_visibility);
    return () => document.removeEventListener("visibilitychange", event_visibility);
  }, [])

  // function untuk menghandle submit form login
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const data = new FormData(form);
      const { error, message, token } = await run(fetch_data({ url: "/login", data: Object.fromEntries(data), method: "POST" }));
      if (error) throw new Error(message);
      setSessionData({ token });
      swalAlert(message, "success")
      form.reset();
      const a = document.createElement("a");
      a.href = VITE_PREFIX;
      a.click();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, swalAlert, setSessionData]);

  return (
    <div className="forms-container">
      <div className="signin-signup">
        <form id="form_login" className="sign-in-form" action="api/login" method="post" onSubmit={handleSubmit}>
          <h2 className="title">Sign in</h2>
          <div className="input-field">
            <div className="w-[55px] grid place-items-center">
              <FontAwesomeIcon icon={faUser} className="text-slate-400" />
            </div>
            <input name="username" id="username" type="username" placeholder="Username" ref={input_username_reff} />
          </div>
          <div className="input-field">
            <div className="w-[55px] grid place-items-center">
              <FontAwesomeIcon icon={faLock} className="text-slate-400" />
            </div>
            <div className="relative flex !px-0">
              <input name="password" id="password" type="password" placeholder="Password" autoComplete="new-password" ref={input_password_reff} />
              <label htmlFor="show_password" className="btn_absolute_right">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="inline-block w-10 text-slate-400" />
                <input
                  className="hidden"
                  type="checkbox"
                  name="show_password"
                  id="show_password"
                  placeholder="Password"
                  onChange={(e) => {
                    // jika checkbox di ceklis maka tampilkan password
                    setShowPassword(e.target.checked);
                    input_password_reff.current.type = e.target.checked ? "text" : "password";
                  }}
                />
              </label>
            </div>
          </div>
          <button className="btn transparent" id="oklogin" type="submit" name="btn" value="Login">
            Login
          </button>
          {/* redirect ke halaman register */}
          {/* <Link to={`${VITE_PREFIX}register`} className="mt-3">
            <button className="btn transparent !w-auto !border-none px-3 hover:!text-[#c3baa9] hover:!bg-transparent" id="regsiter_btn" type="button">
              Belum punya akun? Daftar disini
            </button>
          </Link> */}
        </form>
        <p className="social-text"></p>
      </div>
    </div>
  );
}