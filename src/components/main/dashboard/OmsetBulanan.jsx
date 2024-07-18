import moment from "moment";
import { useState, useLayoutEffect } from "react";
import useFormating from "../../../hooks/useFormating";
import useSocket from "../../../hooks/useSocket";

export default function OmsetBulanan() {
  moment.locale("id");
  const [dataOmset, setDataOmset] = useState(null);
  const firstDay = moment().startOf("month").format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD");
  const { format_rupiah } = useFormating();
  const socket = useSocket("omset", (res) => {
    setDataOmset(res);
  });

  useLayoutEffect(() => {
    socket.emit("omset", { start: firstDay, end: today });
  }, [firstDay, socket, today]);

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
              <span className="text-[12px] font-semibold">Omset : {dataOmset && dataOmset?.data ? format_rupiah(dataOmset?.data?.penjualan) : "Rp. 0"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
