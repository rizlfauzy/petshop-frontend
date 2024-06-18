import useAsync from "../../hooks/useAsync";
import { get_data, fetch_data } from "../../hooks/useFetch";
import { useEffect, useLayoutEffect, useRef, useCallback, } from "react";
import { create_item, set_show_modal } from "../../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import useSession from "../../hooks/useSession";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import useAlert from "../../hooks/useAlert";
import DataSaver from "../../components/main/DataSaver";

const { VITE_PREFIX } = import.meta.env;

export default function Sidebar() {
  const { run, isLoading, data } = useAsync();
  const dispatch = useDispatch();
  const item = useSelector((state) => state.conf.item);
  const show_modal = useSelector((state) => state.conf.show_modal);
  const location = useLocation();
  const navigate = useNavigate();
  const sidebar_ref = useRef(null);
  const sidebar_overlay_ref = useRef(null);
  const btn_sidebar = useRef(null);
  const path = location.pathname.split("/").pop();
  const { session, setSessionData } = useSession();
  const { swalAlert } = useAlert();

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/sidebar?path=" + path,
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
  }, [run, session, path]);

  useEffect(() => {
    const obj = !isLoading ? data : {};
    dispatch(create_item(obj));
    if (!isLoading && data?.message == "Token expired") {
      setSessionData(null);
      navigate(`${VITE_PREFIX}login`, { replace: true });
    }
  }, [data, isLoading, dispatch, navigate, setSessionData]);

  const on_click_menu = useCallback(() => {
    sidebar_ref.current.classList.toggle("open");
    sidebar_overlay_ref.current.classList.toggle("open");
    if (btn_sidebar.current.classList.contains("bx-menu")) {
      btn_sidebar.current.classList.remove("bx-menu");
      btn_sidebar.current.classList.add("bx-menu-alt-right");
    } else {
      btn_sidebar.current.classList.remove("bx-menu-alt-right");
      btn_sidebar.current.classList.add("bx-menu");
    }
  }, []);

  const on_click_logout = useCallback(async () => {
    dispatch(set_show_modal(!show_modal));
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/logout",
          data: { token: session.token },
          method: "POST",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      setSessionData(null);
      navigate(`${VITE_PREFIX}login`, { replace: true });
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [dispatch, show_modal, run, session, setSessionData, swalAlert, navigate]);

  return (
    <>
      <div className="sidebar" ref={sidebar_ref}>
        <DataSaver item={item} />
        <div className="logo-details">
          <img className="icon" src={`${VITE_PREFIX}assets/img/pet-shop.png`} width="45px" />
          <div className="ml-2 logo_name text-uppercase">PETSHOP</div>
          <i className="bx bx-menu btn-sidebar-toogle" id="btn-sidebar-toogle" ref={btn_sidebar} onClick={on_click_menu}></i>
        </div>
        <div className="wrap-nav-list rtl-ps-none" data-perfect-scrollbar="" data-suppress-scroll-x="true">
          <ul className="nav-list">
            {item?.data?.oto_menu?.map((it) => {
              return (
                <li className="nav-list-item" data-tooltip={`tooltip_${it.linkmenu}`} key={it.id}>
                  <Link to={`${VITE_PREFIX}${it.linkmenu}`} className="list-item-menu">
                    <i className={`links_icon ${it.iconmenu}`} style={{ fontSize: "20px" }}></i>
                    <span className="links_name">{it.namamenu}</span>
                  </Link>
                  <span className="tooltip">{it.namamenu}</span>
                </li>
              );
            })}
            <li className="profile">
              <div className="profile-details">
                <div className="name_job">
                  <div className="name text-uppercase">{item?.data?.myusername}</div>
                  <div className="job">{item?.data?.mygrup}</div>
                </div>
              </div>
              <i className="bx bx-log-out btn-sidebar-logout cursor-pointer" id="log_out" onClick={() => {
                dispatch(set_show_modal(!show_modal));
              }}></i>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-hoverlay" ref={sidebar_overlay_ref} onClick={on_click_menu}></div>
      {show_modal && <Modal modal_title="Keluar Aplikasi" className={["modal-sm"]} btn={
        <button type="button" className="p-2 bg-primary text-white rounded-md" onClick={on_click_logout}>
          Log Out
        </button>
      }>Apakah Anda yakin ?</Modal>}
    </>
  );
}
