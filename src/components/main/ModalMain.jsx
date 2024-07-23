import { useState, useRef, useCallback, useLayoutEffect } from "react";
import useAsync from "../../hooks/useAsync";
import { fetch_data, get_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { set_hide_all_modal, set_show_loading } from "../../hooks/useStore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPrint, faTimes } from "@fortawesome/free-solid-svg-icons";
import useAlert from "../../hooks/useAlert";
const { VITE_PREFIX } = import.meta.env;

export default function ModalMain({ set, is_selected, conf, children, is_action_select = false, is_print = false, url_print = "", is_login_modal = false }) {
  const { session, setSessionData } = useSession();
  const navigate = useNavigate();
  const { run } = useAsync();
  const dispatch = useDispatch();
  const { swalAlert } = useAlert();
  const tr_head = useRef(null);
  const input_list = useRef(null);
  const delay = useRef(null);
  const [colspan, set_colspan] = useState(0);
  const [data, set_data] = useState(null);
  const [limit, set_limit] = useState(5);
  const [, set_page] = useState(1);
  const [keyword, set_keyword] = useState("");
  const [konf, set_konf] = useState(conf);
  const option_content = ["5", "10", "25", "50"].map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ));

  const on_find_data = useCallback(
    async (keyword = "", limit = 5, page = 1) => {
      try {
        const { error, message, data } = await run(
          fetch_data({
            url: is_login_modal ? "/page-login" : "/page",
            method: "POST",
            headers: is_login_modal ? {} : { authorization: `Bearer ${session.token}` },
            data: {
              name: konf.name,
              limit,
              page,
              select: JSON.stringify(konf.select),
              order: JSON.stringify(konf.order),
              where: JSON.stringify(konf.where),
              likes: JSON.stringify(konf.likes),
              keyword,
            },
          })
        );
        if (error) throw new Error(message);
        set_data(data);
      } catch (e) {
        if (!is_login_modal && (e.message == "Token expired" || e.message == "Token not found")) {
          setSessionData(null);
          dispatch(set_hide_all_modal());
          navigate(`${VITE_PREFIX}login`, { replace: true });
        }
      }
    },
    [konf, run, session, navigate, setSessionData, dispatch, is_login_modal]
  );

  const handle_keyword = useCallback(
    (e) => {
      clearTimeout(delay.current);
      set_keyword(e.target.value);
      set_konf((prev) => ({ ...prev, keyword: e.target.value }));
      delay.current = setTimeout(() => {
        on_find_data(e.target.value, limit, 1);
      }, 500);
    },
    [on_find_data, limit]
  );

  const handle_limit = useCallback(
    (e) => {
      set_limit(e.target.value);
      set_konf((prev) => ({ ...prev, limit: e.target.value }));
      on_find_data(keyword, e.target.value, 1);
    },
    [on_find_data, keyword]
  );

  const handle_page = useCallback(
    (page) => {
      set_page(page);
      set_konf((prev) => ({ ...prev, page }));
      on_find_data(keyword, limit, page);
    },
    [on_find_data, keyword, limit]
  );

  const handle_clear = useCallback(() => {
    set_keyword("");
    set_konf((prev) => ({ ...prev, keyword: "" }));
    input_list.current.focus();
    on_find_data("", limit, 1);
  }, [on_find_data, limit]);

  useLayoutEffect(() => {
    set_colspan(tr_head?.current?.children.length);
    set_keyword("");
    input_list?.current?.focus();
    on_find_data(keyword, limit);
  }, [set_colspan]);
  return (
    <div className="table-responsive">
      <div className="row mb-2 justify-between">
        <div className="col-half">
          <div className="input-group justify-start">
            <label htmlFor="select_limit_list" className="flex items-center">
              <div className="input-group-text">Pilih</div>
              <select value={limit} onChange={handle_limit} id="select_limit_list" className="form-control form-control-sm cursor-pointer">
                {option_content}
              </select>
              <div className="input-group-text">Baris</div>
            </label>
          </div>
        </div>
        <div className="col-half">
          <div className="input-group justify-end">
            <div className="md:col-quarter col-half p-0 input-group-prepend justify-end">
              <label htmlFor="input_list" className="input-group-text">
                Cari Data
              </label>
            </div>
            <div className="relative col-half !px-0">
              <input type="text" className="form-control w-full" id="input_list" ref={input_list} value={keyword} onInput={handle_keyword} placeholder="Ketik Di sini ..." required />
              <button className="btn_absolute_right hover:text-primary" onClick={handle_clear} type="button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row table-scroll mb-2">
        <table className="table-modal table-bordered table-striped">
          <thead className="thead-dark">
            <tr className="tr_head" ref={tr_head}>
              {children}
            </tr>
          </thead>
          <tbody id="tbody_list">
            {!data ? (
              <tr>
                <td colSpan={colspan} className="text-center">
                  Silahkan cari data dari kolom pencarian di atas
                </td>
              </tr>
            ) : data?.list?.length > 0 ? (
              data?.list?.map((item) => (
                <tr key={item[Object.keys(item)[0]]}>
                  <td className={`text-center ${is_action_select && "action_select"}`} width={10}>
                    <button
                      type="button"
                      className="btn-sm !p-[.25rem_.9rem] bg-primary text-white"
                      data-id={item[Object.keys(item)[0]]}
                      onClick={() => {
                        set(item[Object.keys(item)[0]]);
                        is_selected(true);
                        dispatch(set_hide_all_modal());
                      }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    {is_print && (
                      <button
                        type="button"
                        className="btn-sm !p-[.25rem_.9rem] bg-red-600 text-white !ml-1"
                        data-id={item[Object.keys(item)[0]]}
                        onClick={async () => {
                          try {
                            dispatch(set_show_loading(true));
                            const { error, message, url } = await run(
                              get_data({
                                url: `${url_print}${item[Object.keys(item)[0]]}`,
                                headers: { authorization: `Bearer ${session.token}` },
                              })
                            );
                            if (error) throw new Error(message);
                            const a = document.createElement("a");
                            a.href = url;
                            a.target = "_blank";
                            a.click();
                            swalAlert(message, "success");
                            dispatch(set_show_loading(false));
                          } catch (e) {
                            dispatch(set_show_loading(false));
                            return swalAlert(e.message, "error");
                          }
                        }}
                      >
                        <FontAwesomeIcon icon={faPrint} />
                      </button>
                    )}
                  </td>
                  {konf.select.map((field) => (
                    <td key={field} className="text-left">
                      {konf?.func_item && konf?.func_item[field] ? konf?.func_item[field](item) : item[field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={colspan} className="text-center">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="row items-center">
        <div className="col-half">
          {data && data?.list?.length > 0 && (
            <p className="text-[.813rem] text-[#665c70]">
              Data yang tampil {data?.list?.length} dari total {data?.totalItem} baris
            </p>
          )}
        </div>
        <div className="col-half">
          <ul className="pagination">
            {data?.totalPage > 1 &&
              Array.from({ length: data?.totalPage }, (_, i) => i + 1).map((item) => (
                <li key={item} className={`page-item  ${item == data?.currentPage ? "active disabled" : ""}`}>
                  <button className={`page-link`} onClick={() => handle_page(item)}>
                    {item}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

ModalMain.propTypes = {
  set: PropTypes.func,
  is_selected: PropTypes.func,
  conf: PropTypes.object,
  children: PropTypes.node,
  is_action_select: PropTypes.bool,
  is_print: PropTypes.bool,
  url_print: PropTypes.string,
  is_login_modal: PropTypes.bool,
};
