import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCalendarDays, faPrint } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";
import { get_data } from "../../hooks/useFetch";
import useDatePicker from "../../hooks/useDatePicker";
import moment from "moment";

export default function Laporan({ icon, title }) {
  const btn_tanggal_awal_ref = useRef(null);
  const btn_tanggal_akhir_ref = useRef(null);
  const [tanggal_awal, set_tanggal_awal] = useState(moment().startOf('month').format("YYYY-MM-DD"));
  const [tanggal_akhir, set_tanggal_akhir] = useState(moment().endOf("month").format("YYYY-MM-DD"));
  const { date_picker } = useDatePicker();

  useLayoutEffect(() => {
    const date_awal = date_picker("tanggal_awal");
    date_awal.onSelect((date) => {
      const tanggal_awal = moment(date).format("YYYY-MM-DD");
      set_tanggal_awal(tanggal_awal);
    });

    const open_date_awal = () => date_awal.open();

    const btn_tanggal_awal = btn_tanggal_awal_ref.current;
    btn_tanggal_awal.addEventListener("click", open_date_awal);

    const date_akhir = date_picker("tanggal_akhir", true);
    date_akhir.onSelect((date) => {
      const tanggal_akhir = moment(date).format("YYYY-MM-DD");
      set_tanggal_akhir(tanggal_akhir);
    });

    const open_date_akhir = () => date_akhir.open();

    const btn_tanggal_akhir = btn_tanggal_akhir_ref.current;
    btn_tanggal_akhir.addEventListener("click", open_date_akhir);
    return () => {
      btn_tanggal_awal.removeEventListener("click", open_date_awal);
      btn_tanggal_akhir.removeEventListener("click", open_date_akhir);
      date_awal.destroy();
    };
  }, [date_picker, btn_tanggal_awal_ref]);

  const handle_clear = useCallback(() => {
    console.log("clear");
  }, []);
  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="clear" className="btn-sm bg-red-600 text-white">
          <FontAwesomeIcon icon={faPrint} className="mr-[10px]" />
          Print
        </button>
        <button id="clear" className="btn-sm bg-primary text-white" onClick={handle_clear}>
          <i className="far fa-refresh mr-[10px]"></i>Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">FILTER LAPORAN</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2" id="periode">
                  <div className="col-half input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_awal" className="input-group-text">
                        Tanggal Awal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal_awal" id="tanggal_awal" value={tanggal_awal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal_awal" ref={btn_tanggal_awal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                  <div className="col-half input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_akhir" className="input-group-text">
                        Tanggal Akhir
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal_akhir" id="tanggal_akhir" value={tanggal_akhir} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal_akhir" ref={btn_tanggal_akhir_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Laporan.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
