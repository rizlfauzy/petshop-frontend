import useAsync from "../../hooks/useAsync";
import { get_data } from "../../hooks/useFetch";
import { useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { create_item } from "../../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import useSession from "../../hooks/useSession";
import { useLocation, Link } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function Sidebar() {
  const { run, isLoading, data } = useAsync();
  const dispatch = useDispatch();
  const item = useSelector((state) => state.conf.item);
  const location = useLocation();
  const sidebar_ref = useRef(null);
  const sidebar_overlay_ref = useRef(null);
  const btn_sidebar = useRef(null);
  const path = location.pathname.split("/").pop();
  const { session } = useSession();

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
  }, [data, isLoading, dispatch]);

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

  return (
    <>
      <div className="sidebar" ref={sidebar_ref}>
        <input className="form-control" type="hidden" name="grup" id="grup" maxLength="50" value={item?.data?.mygrup} required />
        <input className="form-control" type="hidden" name="username" id="username" maxLength="50" value={item?.data?.myusername} required />
        <input className="form-control" type="hidden" name="cabang" id="cabang" maxLength="50" value={item?.data?.mycabang} required />
        <input className="form-control" type="hidden" name="tglawal_periode" id="tglawal_periode" maxLength="50" value={item?.data?.tglawal_periode} required />
        <input className="form-control" type="hidden" name="tglakhir_periode" id="tglakhir_periode" maxLength="50" value={item?.data?.tglakhir_periode} required />
        <input type="hidden" name="fitur_add" id="fitur_add" value={item?.data?.cek_menu?.add ?? "f"} />
        <input type="hidden" name="fitur_update" id="fitur_update" value={item?.data?.cek_menu?.update ?? "f"} />
        <input type="hidden" name="fitur_cancel" id="fitur_cancel" value={item?.data?.cek_menu?.cancel ?? "f"} />
        <input type="hidden" name="fitur_accept" id="fitur_accept" value={item?.data?.cek_menu?.accept ?? "f"} />
        <input type="hidden" name="fitur_backdate" id="fitur_backdate" value={item?.data?.cek_menu?.backdate ?? "f"} />
        <input type="hidden" name="fitur_open" id="fitur_open" value={item?.data?.cek_menu?.open ?? "f"} />
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
              <i className="bx bx-log-out btn-sidebar-logout" id="log_out" href="#logoutModal" data-toggle="modal"></i>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-hoverlay" ref={sidebar_overlay_ref} onClick={on_click_menu}></div>
      <div className="modal fade" id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Apa Anda yakin ?
              </h5>
              <button className="close" type="button" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">Terima kasih sudah menggunakan layanan kami !!!</div>
            <div className="modal-footer">
              <button className="btn btn-info" type="button" data-dismiss="modal">
                Cancel
              </button>
              <a className="btn btn-info" href="<?php echo base_url(); ?>api/logout">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
