import PropTypes from "prop-types";
import useFormating from "../../hooks/useFormating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { set_show_qty } from "../../hooks/useStore";
import useAlert from "../../hooks/useAlert";

export default function ListBarang({ set_list_barang, list_barang, set_barang_qty, set_is_edit, is_req_harga = true, is_pro_hasil = null, set_is_pro_hasil = null, set_is_pro_hasil_dua = null, is_find_approved = null, list_barang_dua = null }) {
  const { format_rupiah } = useFormating();
  const dispatch = useDispatch();
  const { swalAlert } = useAlert();

  const handle_edit_barang = useCallback(
    (e) => {
      const barcode = e.currentTarget.dataset.barcode;
      const barang = list_barang.find((item) => item.barcode === barcode);
      set_barang_qty((prev) => ({
        ...prev,
        ...barang,
      }));
      dispatch(set_show_qty(true));
      is_pro_hasil != null && set_is_pro_hasil(true);
      set_is_pro_hasil_dua != null && set_is_pro_hasil_dua(false);
      set_is_edit(true);
    },
    [dispatch, list_barang, set_barang_qty, set_is_edit, is_pro_hasil, set_is_pro_hasil, set_is_pro_hasil_dua]
  );

  const handle_delete_barang = useCallback(
    (e) => {
      try {
        const barcode = e.currentTarget.dataset.barcode;
        if (list_barang_dua != null && list_barang_dua.length > 0) throw new Error("Barang Hasil masih ada !!!");
        const new_list_barang = list_barang.filter((item) => item.barcode !== barcode);
        set_list_barang(new_list_barang);
        is_pro_hasil != null && set_is_pro_hasil(false);
        set_is_pro_hasil_dua != null && set_is_pro_hasil_dua(false);
      } catch (e) {
        return swalAlert(e.message, "error");
      }
    },
    [set_list_barang, list_barang, is_pro_hasil, set_is_pro_hasil, swalAlert, list_barang_dua, set_is_pro_hasil_dua]
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
                        {is_req_harga && (
                          <>
                            <th className="text-left align-middle">Harga</th>
                            <th className="text-left align-middle">Total</th>
                          </>
                        )}
                        <th className="text-left align-middle">Action</th>
                      </tr>
                    </thead>
                    <tbody id="tbody_list_barang">
                      {list_barang.length > 0 ? (
                        list_barang.map((item) => {
                          return (
                            <tr key={item?.barcode}>
                              <td className="text-left align-middle" width="5"></td>
                              <td className="text-left align-middle">{item?.barcode}</td>
                              <td className="text-left align-middle">{item?.nama_barang}</td>
                              <td className="text-left align-middle">{format_rupiah(item?.qty, {})}</td>
                              {is_req_harga && (
                                <>
                                  <td className="text-left align-middle">{format_rupiah(item?.harga)}</td>
                                  <td className="text-left align-middle">{format_rupiah(item?.total_harga)}</td>
                                </>
                              )}
                              <td className="text-left align-middle">
                                <div className="flex justify-center items-center gap-2">
                                  <button
                                    className="btn-sm !bg-yellow-500 hover:!bg-yellow-700 active:!bg-yellow-900 disabled:hover:!bg-[#a7a7a769] w-12 btn_edit_barang_rusak"
                                    id={`edit_list_barang_${item?.barcode}`}
                                    data-barcode={item?.barcode}
                                    onClick={handle_edit_barang}
                                    disabled={is_find_approved != null && is_find_approved}
                                  >
                                    <FontAwesomeIcon icon={faEdit} className="text-white" />
                                  </button>
                                  <button
                                    className="btn-sm !bg-red-500 hover:!bg-red-700 active:!bg-red-900 disabled:hover:!bg-[#a7a7a769] w-12 btn_delete_barang_rusak"
                                    id={`delete_list_barang_${item?.barcode}`}
                                    data-barcode={item?.barcode}
                                    onClick={handle_delete_barang}
                                    disabled={is_find_approved != null && is_find_approved}
                                  >
                                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
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
  list_barang_dua: PropTypes.array,
  set_barang_qty: PropTypes.func,
  set_is_edit: PropTypes.func,
  is_req_harga: PropTypes.bool,
  is_pro_hasil: PropTypes.bool,
  set_is_pro_hasil: PropTypes.func,
  set_is_pro_hasil_dua: PropTypes.func,
  is_find_approved: PropTypes.bool,
};
