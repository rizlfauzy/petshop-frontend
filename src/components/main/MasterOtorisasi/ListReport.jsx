import useAsync from "../../../hooks/useAsync";
import { get_data } from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import { useLayoutEffect, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ListReport({ list_report, set_list_report, keyword, set_keyword, report, set_report, check_all, set_check_all }) {
  const { run, isLoading, data } = useAsync();
  const { session } = useSession();
  const delay = useRef(null);

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/otority/reports",
        headers: { authorization: `Bearer ${session.token}` },
      })
    );
  }, [run, session]);

  useEffect(() => {
    const obj = isLoading ? null : data;
    set_report(obj);
  }, [data, isLoading, set_report]);

  const checked_menu = useCallback(
    (e) => {
      const tr = e.target.parentElement;
      if (!tr.classList.contains("tr_checkbox")) return;
      tr.classList.toggle("clicked-event");
      const report = tr.children[1].innerHTML;
      const nama = tr.children[2].innerHTML;
      const barang = tr.children[3].children[0].checked;
      const periode = tr.children[4].children[0].checked;
      const pdf = tr.children[5].children[0].checked;
      if (tr.classList.contains("clicked-event")) set_list_report((prev) => [...prev, { report, nama, barang, periode, pdf }]);
      else set_list_report((prev) => prev.filter((item) => item.report !== report));
    },
    [set_list_report]
  );

  const handle_search = useCallback(
    async (e) => {
      clearTimeout(delay.current);
      set_keyword(e.target.value);
      delay.current = setTimeout(async () => {
        const { error, message } = await run(
          get_data({
            url: "/otority/find-report?q=" + e.target.value,
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
      const report = tr.children[1].innerHTML;
      const barang = tr.children[3].children[0].checked;
      const periode = tr.children[4].children[0].checked;
      const pdf = tr.children[5].children[0].checked;
      set_list_report((prev) => prev.map((item) => (item.report === report ? { ...item, barang, periode, pdf } : item)));
    },
    [set_list_report]
  );

  const handle_clear_keyword = useCallback(async () => {
    set_keyword("");
    const { error, message } = await run(
      get_data({
        url: "/otority/find-report?q=",
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
    if (error) throw new Error(message);
    set_check_all(false);
  }, [run, session, set_keyword, set_check_all]);

  const handle_check_all = useCallback(
    (e) => {
      const checkboxes = document.querySelectorAll(".tr_report.tr_checkbox");
      let list = [];
      checkboxes.forEach((checkbox) => {
        checkbox.classList.toggle("clicked-event", e.target.checked);
        const report = checkbox.children[1].innerHTML;
        const nama = checkbox.children[2].innerHTML;
        const barang = checkbox.children[3].children[0].disabled ? false : true;
        const periode = checkbox.children[4].children[0].disabled ? false : true;
        const pdf = checkbox.children[5].children[0].disabled ? false : true;
        if (e.target.checked) list.push({ report, nama, barang, periode, pdf });
      });
      set_list_report(list);
      set_check_all(e.target.checked);
    },
    [set_list_report, set_check_all]
  );

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-md">List Report</h5>
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
                    <input type="checkbox" className="form-control ml-auto" name="check_all_report" id="check_all_report" checked={check_all} onChange={handle_check_all} required />
                  </div>
                  <div className="relative">
                    <label htmlFor="check_all_report" className="input-group-text justify-end cursor-pointer">
                      Select All
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row table-scroll mb-2">
              <table className={`table-modal table-bordered table-striped ${!isLoading ? (report?.data?.length > 0 ? "penomoran" : "") : ""}`}>
                <thead className="thead-dark">
                  <tr className="tr_head">
                    <th className="text-left align-middle">No</th>
                    <th className="text-left align-middle action_select">Kode Report</th>
                    <th className="text-left align-middle">Nama Report</th>
                    <th className="text-left align-middle">Barang</th>
                    <th className="text-left align-middle">Periode</th>
                    <th className="text-left align-middle">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading ? (
                    report?.data?.length > 0 ? (
                      report?.data?.map((item) => {
                        const is_checked = list_report.some((menu) => menu.report === item.report);
                        const checked_barang = is_checked ? list_report.find((menu) => menu.report === item.report)?.barang : false;
                        const checked_periode = is_checked ? list_report.find((menu) => menu.report === item.report)?.periode : false;
                        const checked_pdf = is_checked ? list_report.find((menu) => menu.report === item.report)?.pdf : false;
                        return (
                          <tr key={item.report} className={`tr_report tr_checkbox ${is_checked && "clicked-event"}`} onClick={checked_menu}>
                            <td className="text-left align-middle"></td>
                            <td className="text-left align-middle action_select">{item.report}</td>
                            <td className="text-left align-middle">{item.nama}</td>
                            <td className="text-center align-middle">
                              <input type="checkbox" className="form-control m-auto" name="barang" id="true_barang_radio" checked={checked_barang} disabled={!item.rule_barang} onChange={handle_change_checkbox} required />
                            </td>
                            <td className="text-left align-middle">
                              <input type="checkbox" className="form-control m-auto" name="periode" id="true_periode_radio" checked={checked_periode} disabled={!item.rule_periode} onChange={handle_change_checkbox} required />
                            </td>
                            <td className="text-left align-middle">
                              <input type="checkbox" className="form-control m-auto" name="pdf" id="true_pdf_radio" checked={checked_pdf} disabled={!item.rule_pdf} onChange={handle_change_checkbox} required />
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center">
                          data tidak ditemukan
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
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

ListReport.propTypes = {
  set_list_report: PropTypes.func,
  list_report: PropTypes.array,
  keyword: PropTypes.string,
  set_keyword: PropTypes.func,
  report: PropTypes.object,
  set_report: PropTypes.func,
  check_all: PropTypes.bool,
  set_check_all: PropTypes.func,
};
