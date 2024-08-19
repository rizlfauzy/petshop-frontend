import { useCallback } from "react";
import {  useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const { VITE_PREFIX, VITE_TYPE } = import.meta.env;

export default function SidebarMenu({ sidebar_ref, sidebar_overlay_ref, btn_sidebar, li_header, icon_chevron, set_icon_chevron, }) {
  const item = useSelector((state) => state.conf.item);
  const location = useLocation();
  const path = location.pathname.split("/").slice(VITE_TYPE == 'production' ? 2 : 1).join("/");
  const header_path = location.pathname.split("/").slice(VITE_TYPE == "production" ? 2 : 1, VITE_TYPE == "production" ? 3 : 2);

  const on_click_dropdown = useCallback(
    (e) => {
      const sub_menu = document.querySelector(e.currentTarget.parentElement.dataset.target);
      sub_menu.previousElementSibling.parentElement.classList.toggle("collapsed");
      sub_menu.classList.toggle("hidden");
      const arr_menu = sub_menu.id.split("_");
      arr_menu.pop();
      const grup_menu = item?.data?.grup_menu?.filter((gr) => gr.linkmenu == "#").map((gr) => ({ headermenu: gr.headermenu, icon: "chevron-right" }));
      const filter_grup = grup_menu.filter(gr => gr.headermenu != arr_menu.join("_"));
      if (!sub_menu.classList.contains("hidden")) {
        sidebar_ref.current.classList.add("open");
        sidebar_overlay_ref.current.classList.add("open");
        btn_sidebar.current.classList.remove("bx-menu");
        btn_sidebar.current.classList.add("bx-menu-alt-right");
        if (!icon_chevron) set_icon_chevron([...filter_grup, { headermenu: arr_menu.join("_"), icon: "chevron-down" }]);
        else {
          const new_icon = icon_chevron.map(ic => {
            if (ic.headermenu == arr_menu.join("_")) return { headermenu: ic.headermenu, icon: "chevron-down" };
            else return ic;
          });
          set_icon_chevron(new_icon);
        }
      } else {
        if (!icon_chevron) set_icon_chevron([...filter_grup, { headermenu: arr_menu.join("_"), icon: "chevron-right" }]);
        else {
          const new_icon = icon_chevron.map(ic => {
            if (ic.headermenu == arr_menu.join("_")) return { headermenu: ic.headermenu, icon: "chevron-right" };
            else return ic;
          });
          set_icon_chevron(new_icon);
        }
      }
    },
    [sidebar_ref, sidebar_overlay_ref, btn_sidebar, set_icon_chevron, icon_chevron, item]
  );

  return item?.data?.grup_menu?.map((gr) => {
    if (gr.linkmenu == "#")
      return (
        <li ref={li_header} className="nav-list-item collapsed" data-tooltip={`tooltip_${gr.headermenu}`} data-toggle="collapse" data-target={`#${gr.headermenu}_menu`} key={gr.urut_global}>
          <a className={`list-item-menu text-white ${gr.headermenu == header_path ? "active" : ""}`} href="#" onClick={on_click_dropdown}>
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
                        set_icon_chevron(item?.data?.grup_menu?.filter((gr) => gr.linkmenu == "#").map((gr) => ({ headermenu: gr.headermenu, icon: "chevron-right" })));
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
            className={`list-item-menu ${path == gr.linkmenu ? "active" : ""}`}
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
