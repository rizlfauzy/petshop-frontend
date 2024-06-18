import useAsync from "../../hooks/useAsync";
import { fetch_data } from "../../hooks/useFetch";
import { useCallback } from "react";
import useAlert from "../../hooks/useAlert";
import useSession from "../../hooks/useSession";
import { useNavigate } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function FormContainer() {
  const { run } = useAsync();
  const { swalAlert } = useAlert();
  const { setSessionData } = useSession();
  const navigate = useNavigate();

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
      navigate(VITE_PREFIX, { replace: true });
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run, swalAlert, setSessionData, navigate]);

  return (
    <div className="forms-container">
      <div className="signin-signup">
        <form id="form_login" className="sign-in-form" action="api/login" method="post" onSubmit={handleSubmit}>
          <h2 className="title">Sign in</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input name="username" id="username" type="username" placeholder="Username" />
          </div>
          <div className="input-field">
            <i className="fas fa-lock"></i>
            <input name="password" id="password" type="password" placeholder="Password" autoComplete="new-password" />
          </div>
          <button className="btn transparent" id="oklogin" type="submit" name="btn" value="Login">
            Login
          </button>
        </form>
        <p className="social-text"></p>
        <div className="social-media">
          <a href="http://fourbest.co.id/" target="_blank" className="social-icon">
            <i className="fbs fbs-icon-fbs !font-normal"></i>
          </a>
          <div className="row">
            <span className="social-title !font-normal" style={{ fontSize: "1.05rem" }}>
              Copyright© FBS TEAM
            </span>
            <span className="social-title !font-normal">PT. FOUBERST SYNERGY</span>
          </div>
        </div>
      </div>
    </div>
  );
}