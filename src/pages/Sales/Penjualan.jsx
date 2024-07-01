import PropTypes from 'prop-types';
import HeaderPage from '../../components/HeaderPage';
import { useRef, useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import useDatePicker from '../../hooks/useDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { set_show_penjualan } from '../../hooks/useStore';
import Modal from '../../components/Modal';
import ModalMain from '../../components/main/ModalMain';
import useAsync from '../../hooks/useAsync';
import { get_data } from '../../hooks/useFetch';
import useSession from '../../hooks/useSession';

export default function Penjualan({ icon, title }) {
  moment.locale("id");
  const btn_save = useRef(null);
  const btn_update = useRef(null);
  const btn_cancel = useRef(null);
  const btn_tanggal_ref = useRef(null);
  const [nomor, set_nomor] = useState("");
  const [is_selected_penjualan, set_is_selected_penjualan] = useState(false);
  const [penjualan, set_penjualan] = useState({
    nomor: "",
    tanggal: moment().format("YYYY-MM-DD"),
    keterangan: "",
  });
  const { date_picker } = useDatePicker();
  const dispatch = useDispatch();
  const { show_modal_penjualan } = useSelector((state) => state.conf);
  const { run } = useAsync();
  const { session } = useSession();

  useLayoutEffect(() => {
    const date = date_picker('tanggal');
    date.onSelect((date) => {
      const tanggal = moment(date).format("YYYY-MM-DD");
      set_penjualan((prev) => ({
        ...prev,
        tanggal,
      }));
    });
    const open_date = () => date.open();

    const btn_tanggal = btn_tanggal_ref.current;
    btn_tanggal.addEventListener("click", open_date);
    return () => {
      btn_tanggal.removeEventListener("click", open_date);
      date.destroy();
    };
  }, [date_picker, btn_tanggal_ref])

  useEffect(() => {
    async function get_penjualan() {
      const { error, message, data } = await run(get_data({
        url: "/sales?nomor=" + nomor,
        headers: { authorization: `Bearer ${session.token}` },
      }))
      if (error) throw new Error(message);
      if (data) set_penjualan(prev => ({ ...prev, ...data }));
    }

    if (is_selected_penjualan) {
      get_penjualan();
      btn_save.current.disabled = true;
      btn_update.current.disabled = false;
      btn_cancel.current.disabled = false;
    } else if (!is_selected_penjualan) {
      btn_save.current.disabled = false;
      btn_update.current.disabled = true;
      btn_cancel.current.disabled = true;
    }
  }, [run, nomor, is_selected_penjualan, session])

  const handle_save = useCallback(() => {
    console.log("Save");
  }, []);

  const handle_update = useCallback(() => {
    console.log("Update");
  }, []);

  const handle_find_penjualan = useCallback(() => {
    dispatch(set_show_penjualan(true));
  }, [dispatch]);

  const handle_cancel = useCallback(() => {
    console.log("Cancel");
  }, []);

  const handle_clear = useCallback(() => {
    console.log("Clear");
  }, []);

  const handle_change_penjualan = useCallback((e) => {
    const { name, value } = e.target;
    set_penjualan((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handle_keterangan = useCallback((e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }, []);
  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button ref={btn_save} id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <i className="far fa-save mr-[10px]"></i>Save
        </button>
        <button ref={btn_update} id="update" type="button" className="btn-sm bg-primary text-white" onClick={handle_update}>
          <i className="far fa-money-check-edit mr-[10px]"></i>Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white" onClick={handle_find_penjualan}>
          <i className="far fa-file-search mr-[10px]"></i>Find
        </button>
        <button id="cancel" className="btn-sm bg-red-600 hover:bg-red-800 active:bg-red-950 text-white" ref={btn_cancel} onClick={handle_cancel}>
          <FontAwesomeIcon icon={faCancel} className="mr-[10px]" />
          Cancel
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
                <h5 className="mb-0 text-md">DATA DOKUMEN</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="md:col-half col-full input-group md:mb-0 mb-2">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nomor" className="input-group-text">
                        Nomor SO
                      </label>
                    </div>
                    <input type="text" className="form-control col-half" name="nomor" id="nomor" required placeholder="No. Sales Order" value={penjualan.nomor} onChange={handle_change_penjualan} readOnly />
                  </div>
                  <div className="md:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="tanggal" className="input-group-text">
                        Tanggal
                      </label>
                    </div>
                    <div className="relative col-half !px-0">
                      <input type="text" className="form-control" name="tanggal" id="tanggal" value={penjualan.tanggal} required readOnly />
                      <button className="btn_absolute_right !right-1 text-primary hover:text-primary" type="button" ref={btn_tanggal_ref}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-full input-group !items-start">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="keterangan" className="input-group-text">
                        Keterengan
                      </label>
                    </div>
                    <textarea
                      name="keterangan"
                      id="keterangan"
                      className="form-control md:col-thirdperfour col-half"
                      rows={5}
                      placeholder="Keterangan ..."
                      value={penjualan.keterangan}
                      onInput={handle_change_penjualan}
                      onKeyDown={handle_keterangan}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {show_modal_penjualan && (
        <Modal modal_title="Penjualan" className={["modal-md"]} btn={<></>}>
          <ModalMain
            set={set_nomor}
            is_selected={set_is_selected_penjualan}
            conf={{
              name: "penjualan",
              limit: 5,
              page: 1,
              select: ["nomor", "tanggal", "keterangan", "pemakai", "tglsimpan"],
              order: [["nomor", "ASC"]],
              where: { batal: false },
              likes: ["nomor"],
              keyword: "",
              func_item: {
                tanggal: (item) => moment(item.tanggal).format("DD MMMM YYYY"),
                tglsimpan: (item) => moment(item.tglsimpan).format("DD MMMM YYYY HH:mm:ss"),
              },
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Nomor</th>
            <th className="text-left align-middle">Tanggal</th>
            <th className="text-left align-middle">Keterangan</th>
            <th className="text-left align-middle">Penginput</th>
            <th className="text-left align-middle">Tgl Simpan</th>
          </ModalMain>
        </Modal>
      )}
    </>
  );
}

Penjualan.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string
}