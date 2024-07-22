import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { useCallback, useRef, useState, useLayoutEffect, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import useDatePicker from "../../hooks/useDatePicker";
import useAsync from "../../hooks/useAsync";
import { fetch_data, get_data } from "../../hooks/useFetch";
import useAlert from "../../hooks/useAlert";
import useSession from "../../hooks/useSession";
import moment from "moment";
import { useDispatch } from "react-redux";
import { set_hide_all_modal } from "../../hooks/useStore";
import { useNavigate } from "react-router-dom";

const { VITE_PREFIX } = import.meta.env;

export default function PeriodeStok({ icon, title }) {
  const btn_tanggal_awal_ref = useRef(null);
  const btn_tanggal_akhir_ref = useRef(null);
  const [tanggal_awal, set_tanggal_awal] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [tanggal_akhir, set_tanggal_akhir] = useState(moment().endOf("month").format("YYYY-MM-DD"));
  const { date_picker } = useDatePicker();
  const { run } = useAsync();
  const { run: run_get_tanggal, isLoading, data } = useAsync();
  const { swalAlert } = useAlert();
  const { session, setSessionData } = useSession();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const date_awal = date_picker({id: "tanggal_awal", is_periode_page: true, selected_date: tanggal_awal});
    date_awal.onSelect((date) => {
      const tanggal_awal = moment(date).format("YYYY-MM-DD");
      set_tanggal_awal(tanggal_awal);
    });

    const open_date_awal = () => date_awal.open();

    const btn_tanggal_awal = btn_tanggal_awal_ref.current;
    btn_tanggal_awal.addEventListener("click", open_date_awal);

    const date_akhir = date_picker({id: "tanggal_akhir", maxDate: true, is_periode_page: true, selected_date: tanggal_akhir});
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
  }, [date_picker, btn_tanggal_awal_ref, tanggal_awal, tanggal_akhir]);

  useLayoutEffect(() => {
    run_get_tanggal(
      get_data({
        url: "/periode-stock",
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
  }, [run_get_tanggal, session]);

  useEffect(() => {
    const obj = !isLoading ? data : null;
    set_tanggal_awal(obj?.data?.tglawal);
    set_tanggal_akhir(obj?.data?.tglakhir);
    if (!isLoading && (data?.data?.message == "Token expired" || data?.data?.message == "Token not found")) {
      setSessionData(null);
      dispatch(set_hide_all_modal());
      navigate(`${VITE_PREFIX}login`, { replace: true });
    }
  }, [data, isLoading, navigate, setSessionData, dispatch]);

  const handle_update = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/periode-stock",
          method: "PUT",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          data: { tglawal: tanggal_awal, tglakhir: tanggal_akhir },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
    } catch (e) {
      if (e.message == "Token expired" || e.message == "Token not found") {
        setSessionData(null);
        dispatch(set_hide_all_modal());
        navigate(`${VITE_PREFIX}login`, { replace: true });
      }
      return swalAlert(e.message, "error");
    }
  }, [dispatch, navigate, setSessionData, swalAlert, run, session, tanggal_awal, tanggal_akhir]);

  return (
    <>
      <HeaderPage title={title} icon={icon}>
        <button id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <FontAwesomeIcon icon={"money-check"} className="mr-[10px]" />
          Update
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0">PERIODE</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_awal" className="input-group-text">
                        Tanggal Awal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input
                        type="text"
                        className="form-control"
                        name="tanggal_awal"
                        id="tanggal_awal"
                        value={tanggal_awal || moment().startOf("month").format("YYYY-MM-DD")}
                        onChange={(e) => {
                          set_tanggal_awal(e.target.value);
                        }}
                        required
                        readOnly
                      />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" id="btn_tanggal_awal" ref={btn_tanggal_awal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal_akhir" className="input-group-text">
                        Tanggal Akhir
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input
                        type="text"
                        className="form-control"
                        name="tanggal_akhir"
                        id="tanggal_akhir"
                        value={tanggal_akhir || moment().endOf("month").format("YYYY-MM-DD")}
                        onChange={(e) => {
                          set_tanggal_akhir(e.target.value);
                        }}
                        required
                        readOnly
                      />
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

PeriodeStok.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
