import PropTypes from "prop-types";
import useFormating from "../../../hooks/useFormating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { set_show_qty } from "../../../hooks/useStore";

export default function ListBarang({ set_list_barang, list_barang, set_barang_qty, set_is_edit }) {
  const { format_rupiah, format_disc } = useFormating();
  const dispatch = useDispatch();

  const handle_edit_barang = useCallback(
    (e) => {
      const barcode = e.target.dataset.barcode || e.target.parentElement.dataset.barcode || e.target.parentElement.parentElement.dataset.barcode;
      const barang = list_barang.find((item) => item.barcode === barcode);
      set_barang_qty((prev) => ({
        ...prev,
        ...barang,
      }));
      dispatch(set_show_qty(true));
      set_is_edit(true);
    },
    [dispatch, list_barang, set_barang_qty, set_is_edit]
  );

  const handle_delete_barang = useCallback(
    (e) => {
      const barcode = e.target.dataset.barcode || e.target.parentElement.dataset.barcode || e.target.parentElement.parentElement.dataset.barcode;
      const new_list_barang = list_barang.filter((item) => item.barcode !== barcode);
      set_list_barang(new_list_barang);
    },
    [set_list_barang, list_barang]
  );

  return (
    <div className="row">
      <div className="col-full">
        <div className="modal-content-main mb-2">
          <div className="modal-header-main !p-2">
            <h5 className="mb-0 text-md">List Barang</h5>
          </div>
          <div className="modal-body-main">
            <div className="row my-2">
              <div className="table-responsive">
                <div className="row table-scroll mb-2">
                  <table className={`table-modal table-bordered table-striped ${list_barang.length > 0 ? "penomoran" : ""}`}>
                    <thead className="thead-dark">
                      <tr className="tr_head">
                        <th className="text-left align-middle !w-[10px]">No</th>
                        <th className="text-left align-middle">Barcode</th>
                        <th className="text-left align-middle">Nama Barang</th>
                        <th className="text-left align-middle">Qty</th>
                        <th className="text-left align-middle">Harga</th>
                        <th className="text-left align-middle">Disc</th>
                        <th className="text-left align-middle">Nilai Disc</th>
                        <th className="text-left align-middle">Total</th>
                        <th className="text-left align-middle">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list_barang.length > 0 ? (
                        list_barang.map((item) => {
                          return (
                            <tr key={item.barcode}>
                              <td className="text-left align-middle" width="5"></td>
                              <td className="text-left align-middle">{item.barcode}</td>
                              <td className="text-left align-middle">{item.nama_barang}</td>
                              <td className="text-left align-middle">{format_rupiah(item.qty, {})}</td>
                              <td className="text-left align-middle">{format_rupiah(item.harga)}</td>
                              <td className="text-left align-middle">{format_disc(item.disc)}%</td>
                              <td className="text-left align-middle">{format_rupiah(item.nilai_disc)}</td>
                              <td className="text-left align-middle">{format_rupiah(item.total_harga)}</td>
                              <td className="text-left align-middle">
                                <div className="flex justify-center items-center gap-2">
                                  <button className="btn-sm !bg-yellow-500 hover:!bg-yellow-700 active:!bg-yellow-900 w-12" data-barcode={item.barcode} onClick={handle_edit_barang}>
                                    <FontAwesomeIcon icon={faEdit} className="text-white" />
                                  </button>
                                  <button className="btn-sm !bg-red-500 hover:!bg-red-700 active:!bg-red-900 w-12" data-barcode={item.barcode} onClick={handle_delete_barang}>
                                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center">
                            Data tidak ditemukan
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
      </div>
    </div>
  );
}

ListBarang.propTypes = {
  set_list_barang: PropTypes.func,
  list_barang: PropTypes.array,
  set_barang_qty: PropTypes.func,
  set_is_edit: PropTypes.func,
};