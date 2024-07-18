import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useLayoutEffect } from "react";
import moment from "moment";
import useDatePicker from "../../hooks/useDatePicker";
import ListStok from "../../components/main/Stok/ListStok";

export default function CekStok({ icon, title }) {
  const btn_tanggal_ref = useRef(null);
  const [tanggal, set_tanggal] = useState(moment().format("YYYY-MM-DD"));
  const { date_picker } = useDatePicker();

  useLayoutEffect(() => {
    const date = date_picker({id:"tanggal", selected_date: tanggal});
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_tanggal(tanggal);
    });

    const open_date = () => date.open();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref, tanggal]);
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-quarter col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">FILTER STOK</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={tanggal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal" ref={btn_tanggal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="md:col-half col-full">
            <ListStok date={tanggal} />
          </div>
        </div>
      </div>
    </>
  );
}

CekStok.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};