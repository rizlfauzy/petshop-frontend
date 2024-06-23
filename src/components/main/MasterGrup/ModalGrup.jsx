import { useState, useRef, useEffect, useCallback } from "react";
import useAlert from "../../../hooks/useAlert";
import useAsync from "../../../hooks/useAsync";
import { fetch_data } from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { set_show_modal, set_show_grup } from "../../../hooks/useStore";

export default function ModalGrup({ set, is_selected, conf, children }) {
  const { session } = useSession();
  const { swalAlert } = useAlert();
  const { run } = useAsync();
  const dispatch = useDispatch();
  const tr_head = useRef(null);
  const input_list = useRef(null);
  const delay = useRef(null);
  const [colspan, set_colspan] = useState(0);
  const [data, set_data] = useState(null);
  const [limit, set_limit] = useState(5);
  const [page, set_page] = useState(1);
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
            url: "/page",
            method: "POST",
            headers: {
              authorization: `Bearer ${session.token}`,
            },
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
        swalAlert(e.message, "error");
      }
    },
    [konf, run, session, swalAlert]
  );

  const handle_keyword = useCallback(
    (e) => {
      clearTimeout(delay.current);
      set_keyword(e.target.value);
      set_konf((prev) => ({ ...prev, keyword: e.target.value }));
      delay.current = setTimeout(() => {
        on_find_data(e.target.value, limit, page);
      }, 500);
    },
    [on_find_data, limit, page]
  );

  const handle_limit = useCallback(
    (e) => {
      set_limit(e.target.value);
      set_konf((prev) => ({ ...prev, limit: e.target.value }));
      on_find_data(keyword, e.target.value, page);
    },
    [on_find_data, keyword, page]
  );

  const handle_page = useCallback((page) => {
    set_page(page);
    set_konf((prev) => ({ ...prev, page }));
    on_find_data(keyword, limit, page);
  }, [on_find_data, keyword, limit]);

  const handle_clear = useCallback(() => {
    set_keyword("");
    set_konf(prev => ({ ...prev, keyword: "" }));
    input_list.current.focus();
    on_find_data("", limit, page);
  }, [on_find_data, limit, page]);

  useEffect(() => {
    set_colspan(tr_head?.current?.children.length);
    set_keyword("");
    input_list?.current?.focus();
    on_find_data(keyword, limit);
  }, [set_colspan]);
  return (
    <div className="table-responsive">
      <div className="row mb-2 justify-between">
        <div className="col-sixth">
          <label htmlFor="select_limit_list" className="flex">
            Pilih
            <select value={limit} onChange={handle_limit} id="select_limit_list" className="form-control form-control-sm">
              {option_content}
            </select>
            Baris
          </label>
        </div>
        <div className="col-half">
          <div className="input-group justify-end">
            <div className="col-quarter p-0 input-group-prepend">
              <label htmlFor="input_list" className="input-group-text">
                Cari Data
              </label>
            </div>
            <div className="relative col-half !px-0">
              <input type="text" className="form-control w-full" id="input_list" ref={input_list} value={keyword} onInput={handle_keyword} placeholder="Ketik Di sini ..." required />
              <button className="btn_absolute_right hover:text-primary" onClick={handle_clear} type="button">
                <i className="far fa-times"></i>
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
                <tr key={item.kode}>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn-sm !p-[.25rem_.9rem] bg-primary text-white"
                      data-id={item.kode}
                      onClick={() => {
                        set(item.kode);
                        is_selected(true);
                        dispatch(set_show_modal(false));
                        dispatch(set_show_grup(false));
                      }}
                    >
                      <i className="far fa-check"></i>
                    </button>
                  </td>
                  {konf.select.map((field) => (
                    <td key={field} className="text-left">
                      {konf.func_item[field] ? konf.func_item[field](item) : item[field]}
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
            <p className="text-[.813rem]">
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

ModalGrup.propTypes = {
  set: PropTypes.func,
  is_selected: PropTypes.func,
  conf: PropTypes.object,
  children: PropTypes.node,
};
