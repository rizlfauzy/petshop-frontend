import useAsync from "../../../hooks/useAsync";
import { get_data } from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import {  useLayoutEffect, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ListMenu({ list_menu, set_list_menu, keyword, set_keyword, menu, setMenu, check_all, set_check_all}) {
  const { run, isLoading, data } = useAsync();
  const { session } = useSession();
  const delay = useRef(null);

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/otority/menus",
        headers: { authorization: `Bearer ${session.token}` },
      })
    );
  }, [run, session]);

  useEffect(() => {
    const obj = isLoading ? null : data;
    setMenu(obj);
  }, [data, isLoading, setMenu]);

  const checked_menu = useCallback(
    (e) => {
      const tr = e.target.parentElement;
      if (!tr.classList.contains("tr_checkbox")) return;
      tr.classList.toggle("clicked-event");
      const nomenu = tr.children[1].innerHTML;
      const namamenu = tr.children[2].innerHTML;
      const grupmenu = tr.children[3].innerHTML;
      const add = tr.children[4].children[0].checked;
      const update = tr.children[5].children[0].checked;
      const cancel = tr.children[6].children[0].checked;
      // const backdate = tr.children[7].children[0].checked;
      if (tr.classList.contains("clicked-event")) set_list_menu((prev) => [...prev, { nomenu, namamenu, grupmenu, add, update, cancel }]);
      else set_list_menu((prev) => prev.filter((item) => item.nomenu !== nomenu));
    },
    [set_list_menu]
  );

  const handle_search = useCallback(
    async (e) => {
      clearTimeout(delay.current);
      set_keyword(e.target.value);
      delay.current = setTimeout(async () => {
        const { error, message } = await run(
        get_data({
          url: "/otority/find-menu?q=" + e.target.value,
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (error) throw new Error(message);
      }, 500);
      set_check_all(false);
    },
    [run, session, set_keyword, set_check_all]
  );

  const handle_change_checkbox = useCallback(
    (e) => {
      const tr = e.target.parentElement.parentElement;
      const nomenu = tr.children[1].innerHTML;
      const add = tr.children[4].children[0].checked;
      const update = tr.children[5].children[0].checked;
      const cancel = tr.children[6].children[0].checked;
      // const backdate = tr.children[7].children[0].checked;
      set_list_menu((prev) => prev.map((item) => (item.nomenu === nomenu ? { ...item, add, update, cancel } : item)));
    },
    [set_list_menu]
  );

  const handle_clear_keyword = useCallback(async () => {
    set_keyword("");
    const { error, message } = await run(
      get_data({
        url: "/otority/find-menu?q=",
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
    if (error) throw new Error(message);
    set_check_all(false);
  }, [run, session, set_keyword, set_check_all]);

  const handle_check_all = useCallback((e) => {
    const checkboxes = document.querySelectorAll(".tr_menu.tr_checkbox");
    let list = [];
    checkboxes.forEach((checkbox) => {
      checkbox.classList.toggle("clicked-event", e.target.checked);
      const nomenu = checkbox.children[1].innerHTML;
      const namamenu = checkbox.children[2].innerHTML;
      const grupmenu = checkbox.children[3].innerHTML;
      const add = checkbox.children[4].children[0].disabled ? false : true;
      const update = checkbox.children[5].children[0].disabled ? false : true;
      const cancel = checkbox.children[6].children[0].disabled ? false : true;
      // const backdate = checkbox.children[7].children[0].disabled ? false : true;
      if (e.target.checked) list.push({ nomenu, namamenu, grupmenu, add, update, cancel });
    });
    set_list_menu(list);
    set_check_all(e.target.checked);
  }, [set_list_menu, set_check_all]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-md">list menu</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="table-responsive">
            <div className="row mb-2 justify-between">
              <div className="md:col-half col-full md:mb-0 mb-3">
                <div className="input-group justify-start">
                  <div className="md:col-quarter col-half p-0 input-group-prepend">
                    <label htmlFor="input_menu" className="input-group-text">
                      Cari Data
                    </label>
                  </div>
                  <div className="relative md:col-thirdperfour col-half !px-0">
                    <input type="text" className="form-control w-full" id="input_menu" placeholder="Ketik Di sini ..." value={keyword} onChange={handle_search} required />
                    <button className="btn_absolute_right hover:text-primary" type="button" onClick={handle_clear_keyword}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="md:col-half col-full">
                <div className="input-group md:justify-end justify-start md:gap-2 gap-1">
                  <div className="md:p-0 px-[15px] input-group-prepend">
                    <input type="checkbox" className="form-control ml-auto" name="check_all" id="check_all" checked={check_all} onChange={handle_check_all} required />
                  </div>
                  <div className="relative">
                    <label htmlFor="check_all" className="input-group-text justify-end cursor-pointer">
                      Select All
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row table-scroll mb-2">
              <table className={`table-modal table-bordered table-striped ${!isLoading ? (menu?.data?.length > 0 ? "penomoran" : "") : ""}`}>
                <thead className="thead-dark">
                  <tr className="tr_head">
                    <th className="text-left align-middle">No</th>
                    <th className="text-left align-middle action_select">Kode Menu</th>
                    <th className="text-left align-middle">Nama Menu</th>
                    <th className="text-left align-middle">Grup Menu</th>
                    <th className="text-left align-middle">Add</th>
                    <th className="text-left align-middle">Update</th>
                    <th className="text-left align-middle">Cancel</th>
                    {/* <th className="text-left align-middle">Back Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {!isLoading ? (
                    menu?.data?.length > 0 ? (
                      menu?.data?.map((item) => {
                        const is_checked = list_menu.some((menu) => menu.nomenu === item.nomenu);
                        const checked_add = is_checked ? list_menu.find((menu) => menu.nomenu === item.nomenu)?.add : false;
                        const checked_update = is_checked ? list_menu.find((menu) => menu.nomenu === item.nomenu)?.update : false;
                        const checked_cancel = is_checked ? list_menu.find((menu) => menu.nomenu === item.nomenu)?.cancel : false;
                        // const checked_backdate = is_checked ? list_menu.find((menu) => menu.nomenu === item.nomenu)?.backdate : false;
                        return (
                          <tr key={item.nomenu} className={`tr_menu tr_checkbox ${is_checked && "clicked-event"}`} onClick={checked_menu}>
                            <td className="text-left align-middle"></td>
                            <td className="text-left align-middle action_select">{item.nomenu}</td>
                            <td className="text-left align-middle">{item.namamenu}</td>
                            <td className="text-left align-middle">{item.grupmenu}</td>
                            <td className="text-center align-middle">
                              <input type="checkbox" className="form-control m-auto" name="add" id="true_add_radio" checked={checked_add} onChange={handle_change_checkbox} disabled={!item.rule_add} required />
                            </td>
                            <td className="text-left align-middle">
                              <input type="checkbox" className="form-control m-auto" name="update" id="true_update_radio" checked={checked_update} onChange={handle_change_checkbox} disabled={!item.rule_update} required />
                            </td>
                            <td className="text-left align-middle">
                              <input type="checkbox" className="form-control m-auto" name="cancel" id="true_cancel_radio" checked={checked_cancel} onChange={handle_change_checkbox} disabled={!item.rule_cancel} required />
                            </td>
                            {/* <td className="text-left align-middle">
                              <input type="checkbox" className="form-control m-auto" name="backdate" id="true_backdate_radio" checked={checked_backdate} onChange={handle_change_checkbox} disabled={!item.rule_backdate} required />
                            </td> */}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          data tidak ditemukan
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ListMenu.propTypes = {
  set_list_menu: PropTypes.func,
  list_menu: PropTypes.array,
  keyword: PropTypes.string,
  set_keyword: PropTypes.func,
  menu: PropTypes.object,
  setMenu: PropTypes.func,
  check_all: PropTypes.bool,
  set_check_all: PropTypes.func,
};
