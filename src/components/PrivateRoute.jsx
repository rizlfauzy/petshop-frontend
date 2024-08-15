import { useLocation, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import useAsync from "../hooks/useAsync";
import { get_data } from "../hooks/useFetch";
import useSession from "../hooks/useSession";
import { set_hide_all_modal, create_item } from "../hooks/useStore";
const { VITE_PREFIX, VITE_TYPE } = import.meta.env;

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/").slice(VITE_TYPE == 'production' ? 2 : 1).join("/");
  const { run } = useAsync();
  const { session, setSessionData } = useSession();
  const dispatch = useDispatch();

  // mengecek apakah user memiliki akses ke halaman yang diakses
  useLayoutEffect(() => {
    async function get_menu() {
      const { message, data } = await run(
        get_data({
          url: "/sidebar?path=" + path,
          headers: {
            authorization: `Bearer ${session?.token}`,
          },
        })
      );
      if (message == "Token expired" || message == "Token not found") {
        setSessionData(null);
        dispatch(set_hide_all_modal());
        navigate(`${VITE_PREFIX}login`, { replace: true });
        return;
      }
      dispatch(create_item({ data }));
      const oto_menu = [...data.oto_menu ?? []];
      oto_menu?.push({ linkmenu: "empty" });
      const cek_menu = oto_menu?.find((ot) => ot.linkmenu == path || ot.linkdetail == path);
      if (!cek_menu) { navigate(`${VITE_PREFIX}empty`, { replace: true, state: { from: location } }); return; }
      if ((Object.keys(data?.cek_menu).length == 0 || data?.cek_menu?.open == false) && cek_menu.linkmenu != 'empty') navigate(`${VITE_PREFIX}`, { replace: true, state: { from: location } });
    }
    get_menu();
  }, [location, navigate, run, session, setSessionData, dispatch, path]);

  return children;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
