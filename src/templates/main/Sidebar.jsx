import useAsync from "../../hooks/useAsync";
import { fetch_data } from "../../hooks/useFetch";
import { useRef, useCallback, useLayoutEffect, useState } from "react";
import { set_show_modal, set_show_logout, set_hide_all_modal } from "../../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import useSession from "../../hooks/useSession";
import Modal from "../../components/Modal";
import useAlert from "../../hooks/useAlert";
import DataSaver from "../../components/main/DataSaver";
import SidebarMenu from "../../components/main/SidebarMenu";

const { VITE_PREFIX } = import.meta.env;

export default function Sidebar() {
  const { run } = useAsync();
  const dispatch = useDispatch();
  const {show_modal, show_modal_logout, item} = useSelector((state) => state.conf);
  const [icon_chevron, set_icon_chevron] = useState(item?.data?.grup_menu?.filter((gr) => gr.linkmenu == "#").map((gr) => ({ headermenu: gr.headermenu, icon: "chevron-right" })));
  const sidebar_ref = useRef(null);
  const sidebar_overlay_ref = useRef(null);
  const btn_sidebar = useRef(null);
  const li_header = useRef(null);
  const { session, setSessionData } = useSession();
  const { swalAlert } = useAlert();

  // mengecek apakah user memiliki akses ke beberapa tombok berikut
  useLayoutEffect(() => {
    const save_btn = document.querySelector("#save");
    const update_btn = document.querySelector("#update");
    const cancel_btn = document.querySelector("#cancel");
    const date_btn = document.querySelector("#tanggal");
    const date_chooser_btn = document.querySelector("#btn_tanggal");
    if (save_btn && item?.data?.cek_menu?.add) save_btn.classList.remove("hidden");
    else if (save_btn) save_btn.classList.add("hidden");
    if (update_btn && item?.data?.cek_menu?.update) update_btn.classList.remove("hidden");
    else if (update_btn) update_btn.classList.add("hidden");
    if (cancel_btn && item?.data?.cek_menu?.cancel) cancel_btn.classList.remove("hidden");
    else if (cancel_btn) cancel_btn.classList.add("hidden");
    if (date_btn && item?.data?.cek_menu?.backdate) {date_btn.disabled = false;date_chooser_btn.disabled = false;}
    else if (date_btn) {date_btn.disabled = true;date_chooser_btn.disabled = true;}
  }, [item]);

  // event saat hamburger menu di klik
  const on_click_menu = useCallback(() => {
    sidebar_ref.current.classList.toggle("open");
    sidebar_overlay_ref.current.classList.toggle("open");
    if (btn_sidebar.current.classList.contains("bx-menu")) {
      btn_sidebar.current.classList.remove("bx-menu");
      btn_sidebar.current.classList.add("bx-menu-alt-right");
    } else {
      btn_sidebar.current.classList.remove("bx-menu-alt-right");
      btn_sidebar.current.classList.add("bx-menu");
      document.querySelectorAll(".nav-list-item").forEach(item => item.classList.add("collapsed"));
      document.querySelectorAll(".dropdown_menu").forEach(item => item.classList.add("hidden"));
      set_icon_chevron(item?.data?.grup_menu?.filter((gr) => gr.linkmenu == "#").map((gr) => ({ headermenu: gr.headermenu, icon: "chevron-right" })));
    }
  }, [item]);

  // event saat tombol logout di klik
  const on_click_logout = useCallback(async () => {
    dispatch(set_hide_all_modal());
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
      const a = document.createElement("a");
      a.href = `$login`;
      a.click();
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [dispatch, run, session, setSessionData, swalAlert]);

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
            <SidebarMenu sidebar_ref={sidebar_ref} sidebar_overlay_ref={sidebar_overlay_ref} btn_sidebar={btn_sidebar} li_header={li_header} icon_chevron={icon_chevron} set_icon_chevron={set_icon_chevron} />
            <li className="profile">
              <div className="profile-details">
                <div className="name_job">
                  <div className="name text-uppercase">USER : {item?.data?.myusername}</div>
                  <div className="job">GRUP : {item?.data?.mygrup}</div>
                </div>
              </div>
              <i
                className="bx bx-log-out btn-sidebar-logout cursor-pointer"
                id="log_out"
                onClick={() => {
                  dispatch(set_show_modal(true));
                  dispatch(set_show_logout(true));
                }}
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div className="sidebar-hoverlay" ref={sidebar_overlay_ref} onClick={on_click_menu}></div>
      {(show_modal && show_modal_logout) && (
        <Modal
          modal_title="Keluar Petshop"
          className={["sm:modal-sm", "modal-xl"]}
          btn={
            <button type="button" className="p-2 bg-primary text-white rounded-md" onClick={on_click_logout}>
              Log Out
            </button>
          }
        >
          Apakah Anda yakin ?
        </Modal>
      )}
    </>
  );
}
