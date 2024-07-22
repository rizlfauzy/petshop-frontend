import moment from "moment";
import useAsync from "../../../hooks/useAsync";
import { get_data } from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import PropType from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ListStok({ date }) {
  const { run, isLoading, data } = useAsync();
  const { session } = useSession();
  const [keyword, set_keyword] = useState("");
  const delay = useRef(null);
  const input_keyword_ref = useRef(null);

  const get_stocks = useCallback(() => {
    clearTimeout(delay.current);
    delay.current = setTimeout(() => {
      run(
        get_data({
          url: "/stocks?periode=" + moment(date).format("YYYYMM") + "&q=" + keyword,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
    }, 500);
  }, [run, session, date, keyword])

  useLayoutEffect(() => {
    input_keyword_ref.current.focus();
    get_stocks();
  }, [get_stocks]);

  const handle_search = useCallback(async e => {
    const { value } = e.target;
    set_keyword(value);
    clearTimeout(delay.current);
    delay.current = setTimeout(() => {
      run(
        get_data({
          url: "/stocks?periode=" + moment(date).format("YYYYMM") + "&q=" + value,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
    }, 500);
  }, [run, session, date])

  const handle_clear_keyword = useCallback(() => {
    set_keyword("");
    get_stocks();
  }, [get_stocks]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-md">List Stok</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="table-responsive">
            <div className="row mb-2 justify-between">
              <div className="col-half">
                <div className="input-group justify-start">
                  <div className="col-half p-0 input-group-prepend">
                    <label htmlFor="input_menu" className="input-group-text">
                      Cari Barang
                    </label>
                  </div>
                  <div className="relative col-half !px-0">
                    <input type="text" className="form-control w-full" id="input_menu" placeholder="Ketik Di sini ..." value={keyword} onChange={handle_search} ref={input_keyword_ref} required />
                    <button className="btn_absolute_right hover:text-primary" type="button" onClick={handle_clear_keyword}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row table-scroll mb-2">
              <table className={`table-modal table-bordered table-striped ${!isLoading ? (data?.data?.length > 0 ? "penomoran" : "") : ""}`}>
                <thead className="thead-dark">
                  <tr className="tr_head">
                    <th className="text-left align-middle">No</th>
                    <th className="text-left align-middle">Barcode</th>
                    <th className="text-left align-middle">Nama Barang</th>
                    <th className="text-left align-middle">Stok Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((item) => (
                      <tr key={item.barcode}>
                        <td className="text-left align-middle"></td>
                        <td className="text-left align-middle">{item.barcode}</td>
                        <td className="text-left align-middle">{item.nama_barang}</td>
                        <td className="text-left align-middle">{item.stock} {item.nama_satuan}</td>
                      </tr>
                    ))
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

ListStok.propTypes = {
  date: PropType.string.isRequired,
};