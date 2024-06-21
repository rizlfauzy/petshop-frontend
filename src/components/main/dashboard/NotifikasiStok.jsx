import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import useSocketIo from "../../../hooks/useSocketIo";
import { useState, useLayoutEffect, useEffect, useCallback } from "react";
import useAlert from "../../../hooks/useAlert";

export default function NotifikasiStok() {
  moment.locale("id");
  const [goods, setGoods] = useState(null);
  const { run_socket, is_loading_socket, data_socket } = useSocketIo();
  const periode = moment().format("YYYYMM");
  const {swalAlert} = useAlert();

  useLayoutEffect(() => {
    run_socket("notif", {
      periode,
    });
  }, []);

  useEffect(() => {
    const obj = !is_loading_socket ? data_socket : null;
    setGoods(obj);
  }, [data_socket, is_loading_socket]);

  const on_delete_notif = useCallback((barcode) => {
    try {
      const new_goods = goods && goods?.data?.filter((item) => item.barcode !== barcode);
      setGoods({ ...goods, data: new_goods});
    } catch (e) {
      return swalAlert(e.message, "error");
    }
  }, [goods, swalAlert]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-[14px]">Notifikasi Stok</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="col-full">
            <div className="row mb-1">
              <span className="text-[12px] font-semibold">Barang yang akan habis</span>
            </div>
            <div className="max-h-screen overflow-auto">
              {goods && goods?.data?.length > 0 ? (
                goods?.data?.map((item) => {
                  const msg = item.stock <= 0 ? `${item.nama} habis silahkan repurchase` : `${item.nama} sisa ${item.stock} ${item.satuan} silahkan repurchase`;
                  return (
                    <div className="row notif" key={item.barcode}>
                      <div className="relative !px-0 w-full">
                        <div className="border-b-2 border-b-primary">
                          <p className="text-[11px] p-3 rounded-md">{msg}</p>
                        </div>
                        <button className="btn_absolute_right hover:text-red-600 active:text-red-900" onClick={on_delete_notif.bind(this, item.barcode)}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="row">
                  <span className="text-[12px] font-semibold">Tidak ada barang yang akan habis</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
