import PropTypes from "prop-types";
import useFormating from "../../../hooks/useFormating";
import { useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import useAlert from "../../../hooks/useAlert";

export default function ModalBarangQty({ barang_qty, set_barang_qty, set_show_modal_qty, list_barang, set_list_barang, is_edit }) {
  const { format_rupiah } = useFormating();
  const input_qty_ref = useRef(null);
  const { swalAlert } = useAlert();

  useEffect(() => {
    input_qty_ref.current.focus();
  }, []);

  const handle_change_qty = useCallback((e) => {
    const { name, value } = e.target;
    if (isNaN(Number(value))) e.target.value = value.substr(0, value.length - 1);
    const arr_value = value.split("");
    const first_val = arr_value[0];
    if (first_val == 0) {
      arr_value.shift();
      e.target.value = arr_value.join("");
    }
    const result_value = arr_value.map((e) => Number(e)).join("");
    e.target.value = result_value.replace(/NaN/gi, "");
    if (e.target.value.length < 1) e.target.value = 0;
    set_barang_qty((prev) => ({
      ...prev,
      total_harga: barang_qty.harga_modal * e.target.value,
      [name]: format_rupiah(e.target.value, {}),
    }));
  }, [format_rupiah, set_barang_qty, barang_qty.harga_modal]);

  const handle_input_barang = useCallback(() => {
    try {
      if (barang_qty.qty < 1) throw new Error("Qty barang tidak boleh kurang dari 1");
      // cek barang sudah ada di list barang atau belum
      const is_exist = list_barang?.find((item) => item.barcode === barang_qty.barcode);
      if (is_exist) {
        const new_list_barang = list_barang.map((item) => {
          if (item.barcode === barang_qty.barcode) {
            item.qty = is_edit ? barang_qty.qty : Number(item.qty) + Number(barang_qty.qty);
            item.total_harga = item.harga_modal * item.qty;
          }
          return item;
        });
        set_list_barang(new_list_barang);
      } else {
        set_list_barang((prev) => [
          ...prev,
          {
            barcode: barang_qty.barcode,
            nama_barang: barang_qty.nama_barang,
            qty: barang_qty.qty,
            harga_modal: barang_qty.harga_modal,
            total_harga: barang_qty.total_harga,
            stock: barang_qty.stock,
          },
        ]);
      }
      set_show_modal_qty(false);
    } catch (e) {
      swalAlert(e.message, "error");
    }
  }, [barang_qty, set_show_modal_qty, swalAlert, list_barang, set_list_barang, is_edit]);

  const handle_input_on_enter = useCallback((e) => {
    if (e.key === "Enter") handle_input_barang();
  }, [handle_input_barang]);

  return (
    <>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="barcode_qty" className="input-group-text">
              barcode
            </label>
          </div>
          <input type="text" className="form-control col-half" name="barcode_qty" id="barcode_qty" value={barang_qty.barcode} readOnly />
        </div>
      </div>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="nama_barang_qty" className="input-group-text">
              Nama Barang
            </label>
          </div>
          <input type="text" className="form-control col-half" name="nama_barang_qty" id="nama_barang_qty" value={barang_qty.nama_barang} readOnly />
        </div>
      </div>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="stock_barang_qty" className="input-group-text">
              Stock Barang
            </label>
          </div>
          <input type="text" className="form-control col-half" name="stock_barang_qty" id="stock_barang_qty" value={format_rupiah(barang_qty.stock, {})} readOnly />
        </div>
      </div>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="harga_modal_qty" className="input-group-text">
              Harga Modal
            </label>
          </div>
          <input type="text" className="form-control col-half" name="harga_modal_qty" id="harga_modal_qty" value={format_rupiah(barang_qty.harga_modal)} readOnly />
        </div>
      </div>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="total_harga_qty" className="input-group-text">
              Total Harga
            </label>
          </div>
          <input type="text" className="form-control col-half" name="total_harga_qty" id="total_harga_qty" value={format_rupiah(barang_qty.total_harga)} readOnly />
        </div>
      </div>
      <div className="row my-2">
        <div className="col-full input-group">
          <div className="col-half p-0 input-group-prepend">
            <label htmlFor="qty" className="input-group-text">
              Qty Barang
            </label>
          </div>
          <div className="relative col-half !px-0">
            <input ref={input_qty_ref} type="text" className="form-control" name="qty" id="qty" value={barang_qty.qty} onChange={handle_change_qty} onKeyDown={handle_input_on_enter} />
            <button className="btn_absolute_right !right-2 text-primary hover:text-primary" type="button" onClick={handle_input_barang}>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

ModalBarangQty.propTypes = {
  barang_qty: PropTypes.object,
  set_barang_qty: PropTypes.func,
  set_show_modal_qty: PropTypes.func,
  list_barang: PropTypes.array,
  set_list_barang: PropTypes.func,
  is_edit: PropTypes.bool,
};