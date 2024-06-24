import moment from "moment";
import useSocketIo from "../../../hooks/useSocketIo";
import { useState, useLayoutEffect, useEffect } from "react";
import useFormating from "../../../hooks/useFormating";

export default function OmsetBulanan() {
  moment.locale("id");
  const [dataOmset, setDataOmset] = useState(null);
  const { run_socket, is_loading_socket, data_socket } = useSocketIo();
  const firstDay = moment().startOf("month").format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD");
  const { format_rupiah } = useFormating();

  useLayoutEffect(() => {
    run_socket("omset", {
      start: firstDay,
      end: today,
    });
  }, []);

  useEffect(() => {
    const obj = !is_loading_socket ? data_socket : null;
    setDataOmset(obj);
  }, [data_socket, is_loading_socket]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-[14px]">Omset Toko Bulanan</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="col-full">
            <div className="row">
              <span className="text-[12px] font-semibold">
                Periode : {firstDay} s/d {today}
              </span>
            </div>
            <div className="row">
              <span className="text-[12px] font-semibold">Omset : {dataOmset && format_rupiah(dataOmset?.data?.penjualan)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
