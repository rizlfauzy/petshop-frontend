import useAsync from "../../hooks/useAsync";
import { get_data } from "../../hooks/useFetch";
import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import { create_item } from "../../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import useSession from "../../hooks/useSession";
import { useLocation, Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types"

const { VITE_PREFIX } = import.meta.env;

export default function SidebarMenu({ sidebar_ref, sidebar_overlay_ref, btn_sidebar, li_header, showDropdown, setShowDropdown}) {
  const { run, isLoading, data } = useAsync();
  const dispatch = useDispatch();
  const item = useSelector((state) => state.conf.item);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/").pop();
  const { session, setSessionData } = useSession();
  const [count_menu, setCountMenu] = useState(null);

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
    const obj = !isLoading ? data : null;
    dispatch(create_item(obj));
    if (!isLoading && data?.message == "Token expired") {
      setSessionData(null);
      if (path != '') navigate(`${VITE_PREFIX}login`, { replace: true });
      else {
        const a = document.createElement("a");
        a.href = `${VITE_PREFIX}login`;
        a.click();
      }
    }
  }, [data, isLoading, dispatch, navigate, setSessionData, path]);

  useEffect(() => {
    const arr = item?.data?.oto_menu?.map((it) => it.grupmenu);
    const count_menu = arr?.reduce((acc, curr) => ((acc[curr] = (acc[curr] || 0) + 1), acc), {});
    setCountMenu(count_menu);
  }, [item]);

  const on_click_dropdown = useCallback(() => {
    li_header.current.classList.toggle("collapsed");
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      sidebar_ref.current.classList.add("open");
      sidebar_overlay_ref.current.classList.add("open");
      btn_sidebar.current.classList.remove("bx-menu");
      btn_sidebar.current.classList.add("bx-menu-alt-right");
    }
  }, [showDropdown, sidebar_ref, sidebar_overlay_ref, btn_sidebar, li_header, setShowDropdown]);

  return item?.data?.grup_menu?.map((gr) => {
    if (count_menu?.[gr.grupmenu] > 1)
      return (
        <li ref={li_header} className="nav-list-item collapsed" data-tooltip={`tooltip_${gr.headermenu}`} data-toggle="collapse" data-target={`#${gr.headermenu}_menu`} key={gr.urut_global}>
          <a className="list-item-menu text-white " href="#" onClick={on_click_dropdown}>
            <i className={`links_icon ${gr.iconmenu} text-[18px]`}></i>
            <span className="links_name">{gr.grupmenu}</span>
          </a>
          {showDropdown && (
            <div id={`${gr.headermenu}_menu`} className="dropdown_menu">
              <ul className="nav-sublist">
                {item?.data?.oto_menu
                  ?.filter((it) => it.grupmenu == gr.grupmenu)
                  .map((it) => (
                    <li className={`nav-sublist-item nomenu_${gr.grupmenu}`} data-tooltip={`tooltip_${it.linkdetail}`} key={it.nomenu}>
                      {path == "" ? (
                        <a href={`${VITE_PREFIX}${it.linkdetail}`} className="sublist-item-menu">
                          <i className={`links_icon ${it.icondetail}`}></i>
                          <span className="links_name">{it.namamenu}</span>
                        </a>
                      ) : (
                        <Link to={`${VITE_PREFIX}${it.linkdetail}`} className="sublist-item-menu">
                          <i className={`links_icon ${it.icondetail}`}></i>
                          <span className="links_name">{it.namamenu}</span>
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </li>
      );
    else
      return (
        <li className="nav-list-item" data-tooltip={`tooltip_${gr.linkmenu}`} key={gr.urut_global}>
          {path == "" ? (
            <a href={`${VITE_PREFIX}${gr.linkmenu}`} className="list-item-menu">
              <i className={`links_icon ${gr.iconmenu} text-[18px]`}></i>
              <span className="links_name">{gr.grupmenu}</span>
            </a>
          ) : (
            <Link to={`${VITE_PREFIX}${gr.linkmenu}`} className="list-item-menu">
              <i className={`links_icon ${gr.iconmenu} text-[18px]`}></i>
              <span className="links_name">{gr.grupmenu}</span>
            </Link>
          )}
          <span className="tooltip">{gr.grupmenu}</span>
        </li>
      );
  });
}

SidebarMenu.propTypes = {
  sidebar_ref: PropTypes.object,
  sidebar_overlay_ref: PropTypes.object,
  btn_sidebar: PropTypes.object,
  li_header: PropTypes.object
}