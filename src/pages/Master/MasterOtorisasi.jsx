import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh, faSave, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useLayoutEffect, useCallback } from "react";
import ModalMain from "../../components/main/ModalMain";
import useAsync from "../../hooks/useAsync";
import { fetch_data, get_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import useAlert from "../../hooks/useAlert";
import ListMenu from "../../components/main/MasterOtorisasi/ListMenu";
import { useSelector, useDispatch } from "react-redux";
import ListReport from "../../components/main/MasterOtorisasi/ListReport";
import Modal from "../../components/Modal";
import { set_show_grup, set_show_loading } from "../../hooks/useStore";

export default function MasterOtorisasi({ icon, title }) {
  const [kode_grup, set_kode_grup] = useState("");
  const [is_selected_grup, set_is_selected_grup] = useState(false);
  const [list_menu, set_list_menu] = useState([]);
  const [keyword_menu, set_keyword_menu] = useState("");
  const [menu, setMenu] = useState(null);
  const [check_all_menu, set_check_all_menu] = useState(false);
  const [list_report, set_list_report] = useState([]);
  const [report, set_report] = useState(null);
  const [keyword_report, set_keyword_report] = useState("");
  const [check_all_report, set_check_all_report] = useState(false);
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert } = useAlert();
  const { show_modal_grup } = useSelector((state) => state.conf);
  const dispatch = useDispatch();
  const [grup, set_grup] = useState({
    kode_grup: "",
    nama_grup: "",
  });

  useLayoutEffect(() => {
    async function get_grup() {
      const { error, message, data } = await run(
        get_data({
          url: "/grup?kode=" + kode_grup,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      set_grup((state) => ({ ...state, kode_grup: data.kode, nama_grup: data.nama }));
    }

    async function get_menu() {
      const { error, message, data } = await run(
        get_data({
          url: "/otority/menu?grup=" + kode_grup,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data.length > 0) {
        set_check_all_menu(data.every((item) => item.add && item.update && item.cancel && item.backdate));
        set_list_menu([...data]);
      } else set_list_menu([]);
    }

    async function get_report() {
      const { error, message, data } = await run(
        get_data({
          url: "/otority/report?grup=" + kode_grup,
          headers: { authorization: `Bearer ${session.token}` },
        })
      );
      if (error) throw new Error(message);
      if (data.length > 0) {
        set_check_all_report(data.every((item) => item.barang && item.periode && item.pdf));
        set_list_report([...data]);
      } else set_list_report([]);
    }

    if (is_selected_grup) {
      get_grup();
      get_menu();
      get_report();
    }
  }, [is_selected_grup, kode_grup, run, session]);

  const handle_change_grup = useCallback((e) => {
    const { name, value } = e.target;
    set_grup((state) => ({ ...state, [name]: value == "true" ? true : value == "false" ? false : value }));
    set_is_selected_grup(false);
  }, []);

  const handle_clear = useCallback(async () => {
    dispatch(set_show_loading(true));
    setTimeout(async () => {
      set_grup((state) => ({ ...state, kode_grup: "", nama_grup: "" }));
      set_is_selected_grup(false);

      set_keyword_menu("");
      const {
        error: e_menu,
        message: m_menu,
        data: d_menu,
      } = await run(
        get_data({
          url: "/otority/find-menu?q=",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (e_menu) throw new Error(m_menu);
      set_list_menu([]);
      setMenu({ data: d_menu });
      set_check_all_menu(false);

      set_list_report([]);
      set_keyword_report("");
      const {
        error: e_report,
        message: m_report,
        data: d_report,
      } = await run(
        get_data({
          url: "/otority/find-report?q=",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
        })
      );
      if (e_report) throw new Error(m_report);
      set_report({ data: d_report });
      set_check_all_report(false);
      dispatch(set_show_loading(false));
    }, 500);
  }, [run, session, dispatch]);

  const handle_save = useCallback(async () => {
    try {
      dispatch(set_show_loading(true));
      const { error, message } = await run(
        fetch_data({
          url: "/otority",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: { kode_grup, menus: JSON.stringify(list_menu), reports: JSON.stringify(list_report) },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
      handle_clear();
    } catch (error) {
      swalAlert(error.message, "error");
    } finally {
      dispatch(set_show_loading(false));
    }
  }, [list_menu, swalAlert, run, session, kode_grup, list_report, dispatch, handle_clear]);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <FontAwesomeIcon icon={faSave} className="mr-[10px]" />
          Save
        </button>
        <button id="clear" className="btn-sm bg-primary text-white" onClick={handle_clear}>
          <FontAwesomeIcon icon={faRefresh} className="mr-[10px]" />
          Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-md">OTORISASI</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="md:col-quarter col-half p-0 input-group-prepend">
                      <label htmlFor="nama_grup" className="input-group-text">
                        NAMA GRUP
                      </label>
                    </div>
                    <div className="relative md:col-thirdperfour col-half !px-0">
                      <input type="text" value={grup.nama_grup} className="form-control" name="nama_grup" id="nama_grup" placeholder="tekan tombol cari" required readOnly onChange={handle_change_grup} />
                      <button
                        className="btn_absolute_right hover:text-primary"
                        type="button"
                        onClick={() => {
                          dispatch(set_show_grup(true));
                          set_is_selected_grup(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faSearch} />
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
            <ListMenu list_menu={list_menu} set_list_menu={set_list_menu} keyword={keyword_menu} set_keyword={set_keyword_menu} menu={menu} setMenu={setMenu} check_all={check_all_menu} set_check_all={set_check_all_menu} />
          </div>
          <div className="md:col-half col-full">
            <ListReport
              list_report={list_report}
              set_list_report={set_list_report}
              keyword={keyword_report}
              set_keyword={set_keyword_report}
              report={report}
              set_report={set_report}
              check_all={check_all_report}
              set_check_all={set_check_all_report}
            />
          </div>
        </div>
      </div>
      {show_modal_grup && (
        <Modal modal_title="Grup" className={["md:modal-sm", "modal-xl"]} btn={<></>}>
          <ModalMain
            set={set_kode_grup}
            is_selected={set_is_selected_grup}
            conf={{
              name: "grup",
              limit: 5,
              page: 1,
              select: ["kode", "nama"],
              order: [["kode", "ASC"]],
              where: "kode <> 'ITS' and aktif = 't'",
              likes: ["kode", "nama"],
              keyword: "",
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Kode</th>
            <th className="text-left align-middle">Nama</th>
          </ModalMain>
        </Modal>
      )}
    </>
  );
}

MasterOtorisasi.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
