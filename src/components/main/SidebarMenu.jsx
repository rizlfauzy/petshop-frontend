import useAsync from "../../hooks/useAsync";
import { get_data } from "../../hooks/useFetch";
import { useLayoutEffect, useEffect, useCallback } from "react";
import { create_item } from "../../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import useSession from "../../hooks/useSession";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { set_hide_all_modal } from "../../hooks/useStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { VITE_PREFIX } = import.meta.env;

export default function SidebarMenu({ sidebar_ref, sidebar_overlay_ref, btn_sidebar, li_header, icon_chevron, set_icon_chevron, }) {
  const { run, isLoading, data } = useAsync();
  const dispatch = useDispatch();
  const item = useSelector((state) => state.conf.item);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/").length > 2 ? location.pathname.split("/").slice(1).join("/") : location.pathname.split("/").pop();
  const { session, setSessionData } = useSession();

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/sidebar?path=" + path,
        headers: {
          authorization: `Bearer ${session?.token}`,
        },
      })
    );
  }, [run, session, path]);

  useEffect(() => {
    const obj = !isLoading ? data : null;
    dispatch(create_item(obj));
    if (!isLoading && (data?.message == "Token expired" || data?.message == "Token not found")) {
      setSessionData(null);
      dispatch(set_hide_all_modal());
      navigate(`${VITE_PREFIX}login`, { replace: true });
    }
  }, [data, isLoading, dispatch, navigate, setSessionData]);

  const on_click_dropdown = useCallback(
    (e) => {
      const sub_menu = document.querySelector(e.currentTarget.parentElement.dataset.target);
      sub_menu.previousElementSibling.parentElement.classList.toggle("collapsed");
      sub_menu.classList.toggle("hidden");
      const grup_menu = item?.data?.grup_menu?.filter((gr) => gr.linkmenu == "#").map((gr) => ({ headermenu: gr.headermenu, icon: "chevron-right" }));
      if (!sub_menu.classList.contains("hidden")) {
        sidebar_ref.current.classList.add("open");
        sidebar_overlay_ref.current.classList.add("open");
        btn_sidebar.current.classList.remove("bx-menu");
        btn_sidebar.current.classList.add("bx-menu-alt-right");
        const arr_menu = sub_menu.id.split("_");
        arr_menu.pop();
        const filter_grup = grup_menu.filter(gr => gr.headermenu != arr_menu.join("_"));
        set_icon_chevron([...filter_grup, { headermenu: arr_menu.join("_"), icon: "chevron-down" }]);
      } else set_icon_chevron(grup_menu);
    },
    [sidebar_ref, sidebar_overlay_ref, btn_sidebar, set_icon_chevron, item]
  );

  return item?.data?.grup_menu?.map((gr) => {
    if (gr.linkmenu == "#")
      return (
        <li ref={li_header} className="nav-list-item collapsed" data-tooltip={`tooltip_${gr.headermenu}`} data-toggle="collapse" data-target={`#${gr.headermenu}_menu`} key={gr.urut_global}>
          <a className="list-item-menu text-white " href="#" onClick={on_click_dropdown}>
            <div className="w-[50px] h-[40px] grid place-items-center">
              <FontAwesomeIcon icon={gr.iconmenu} className="links_icon text-[18px] min-w-[50px]" />
            </div>
            <span className="links_name">{gr.grupmenu}</span>
            <div className="w-[40px] h-[40px] grid place-items-center ml-auto">
              <FontAwesomeIcon icon={icon_chevron?.find((ic) => ic.headermenu == gr.headermenu)?.icon || "chevron-right"} className="text-[14px] min-w-[40px]" />
            </div>
          </a>
          <div id={`${gr.headermenu}_menu`} className={`dropdown_menu hidden`}>
            <ul className="nav-sublist">
              {item?.data?.oto_menu
                ?.filter((it) => it.grupmenu == gr.grupmenu)
                .map((it) => (
                  <li className={`nav-sublist-item nomenu_${gr.grupmenu}`} data-tooltip={`tooltip_${it.linkdetail}`} key={it.nomenu}>
                    <Link
                      to={`${VITE_PREFIX}${it.linkdetail}`}
                      className="sublist-item-menu"
                      onClick={() => {
                        sidebar_ref.current.classList.remove("open");
                        sidebar_overlay_ref.current.classList.remove("open");
                        btn_sidebar.current.classList.remove("bx-menu-alt-right");
                        btn_sidebar.current.classList.add("bx-menu");
                        document.querySelectorAll(".nav-list-item").forEach((item) => item.classList.add("collapsed"));
                        document.querySelectorAll(".dropdown_menu").forEach((item) => item.classList.add("hidden"));
                      }}
                    >
                      <div className="w-[50px] h-[40px] grid place-items-center">
                        <FontAwesomeIcon icon={it.icondetail} className="links_icon" size="xs" />
                      </div>
                      <span className="links_name">{it.namamenu}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </li>
      );
    else
      return (
        <li className="nav-list-item" data-tooltip={`tooltip_${gr.linkmenu}`} key={gr.urut_global}>
          <Link
            to={`${VITE_PREFIX}${gr.linkmenu}`}
            className="list-item-menu"
            onClick={() => {
              sidebar_ref.current.classList.remove("open");
              sidebar_overlay_ref.current.classList.remove("open");
              btn_sidebar.current.classList.remove("bx-menu-alt-right");
              btn_sidebar.current.classList.add("bx-menu");
              document.querySelectorAll(".nav-list-item").forEach((item) => item.classList.add("collapsed"));
              document.querySelectorAll(".dropdown_menu").forEach((item) => item.classList.add("hidden"));
            }}
          >
            <div className="w-[50px] h-[40px] grid place-items-center">
              <FontAwesomeIcon icon={gr.iconmenu} className="links_icon text-[18px] min-w-[50px]" />
            </div>
            <span className="links_name">{gr.grupmenu}</span>
          </Link>
          <span className="tooltip">{gr.grupmenu}</span>
        </li>
      );
  });
}

SidebarMenu.propTypes = {
  sidebar_ref: PropTypes.object,
  sidebar_overlay_ref: PropTypes.object,
  btn_sidebar: PropTypes.object,
  li_header: PropTypes.object,
};
