import PropTypes from "prop-types";
import HeaderPage from "../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { get_data, fetch_data } from "../hooks/useFetch";
import useAsync from "../hooks/useAsync";
import useAlert from "../hooks/useAlert";
import useSession from "../hooks/useSession";
import { useNavigate } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function ChangePassword({ icon, title }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const input_password = useRef(null);
  const input_username = useRef(null);
  const { run, isLoading, data } = useAsync();
  const { run: run_update } = useAsync();
  const { swalAlert } = useAlert();
  const { session, setSessionData } = useSession();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/user",
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
  }, [run, session]);

  useEffect(() => {
    const obj = !isLoading ? data : {};
    setUsername(obj?.data?.username);
    setPassword(obj?.data?.password);
    if (!isLoading && data?.message == "Token expired") {
      setSessionData(null);
      navigate(`${VITE_PREFIX}login`, { replace: true });
    }
  }, [data, isLoading, navigate, setSessionData]);

  const on_update = useCallback(async () => {
    try {
      const { error, message } = await run_update(
        fetch_data({
          url: "/user",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          method: "PUT",
          data: { username, password },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [run_update, swalAlert, session, username, password]);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="update" type="button" className="btn-sm bg-primary text-white" onClick={on_update}>
          <i className="far fa-money-check-edit mr-[10px]"></i>Update
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="col-full">
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
                    <input
                      type="text"
                      ref={input_username}
                      className="form-control col-half"
                      name="username"
                      id="username"
                      value={username || ""}
                      onChange={(e) => {
                        setUsername(e.target.value);
                      }}
                      required
                      readOnly
                    />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="password" className="input-group-text">
                        PASSWORD
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input
                        type="password"
                        ref={input_password}
                        className="form-control w-full"
                        name="password"
                        id="password"
                        value={password || ""}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode == 13) on_update();
                        }}
                        required
                      />
                      <label htmlFor="show_password" className="btn_absolute_right">
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        <input
                          className="hidden"
                          type="checkbox"
                          name="show_password"
                          id="show_password"
                          value={showPassword}
                          onChange={(e) => {
                            setShowPassword(e.target.checked);
                            input_password.current.type = e.target.checked ? "text" : "password";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ChangePassword.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
