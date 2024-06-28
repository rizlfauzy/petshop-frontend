import PropTypes from "prop-types";
import HeaderPage from "../../components/HeaderPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useLayoutEffect, useCallback } from "react";
import ModalSec from "../../components/ModalSec";
import ModalMain from "../../components/main/ModalMain";
import useAsync from "../../hooks/useAsync";
import { fetch_data, get_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import useAlert from "../../hooks/useAlert";
import ListMenu from "../../components/main/MasterOtorisasi/ListMenu";

export default function MasterOtorisasi({ icon, title }) {
  const [show_modal_grup, set_show_modal_grup] = useState(false);
  const [kode_grup, set_kode_grup] = useState("");
  const [is_selected_grup, set_is_selected_grup] = useState(false);
  const [list_menu, set_list_menu] = useState([]);
  const [keyword, set_keyword] = useState("");
  const [menu, setMenu] = useState(null);
  const { run } = useAsync();
  const { session } = useSession();
  const { swalAlert } = useAlert();
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
      if (data.length > 0) set_list_menu([...data]);
      else set_list_menu([]);
    }

    if (is_selected_grup) {
      get_grup();
      get_menu();
      set_show_modal_grup(false);
    }
  }, [is_selected_grup, kode_grup, run, session]);

  const handle_change_grup = useCallback((e) => {
    const { name, value } = e.target;
    set_grup((state) => ({ ...state, [name]: value == "true" ? true : value == "false" ? false : value }));
    set_is_selected_grup(false);
  }, []);

  const handle_save = useCallback(async () => {
    try {
      const { error, message } = await run(
        fetch_data({
          url: "/otority",
          method: "POST",
          headers: { authorization: `Bearer ${session.token}` },
          data: { kode_grup, menus: JSON.stringify(list_menu) },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
    } catch (error) {
      swalAlert(error.message, "error");
    }
  }, [list_menu, swalAlert, run, session, kode_grup]);

  const handle_clear = useCallback(async () => {
    set_list_menu([]);
    set_grup((state) => ({ ...state, kode_grup: "", nama_grup: "" }));
    set_keyword("");
    const { error, message, data } = await run(
      get_data({
        url: "/otority/find-menu?q=",
        headers: {
          authorization: `Bearer ${session.token}`,
        },
      })
    );
    if (error) throw new Error(message);
    setMenu({ data });
    set_is_selected_grup(false);
  }, [run, session]);

  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="save" className="btn-sm bg-primary text-white" onClick={handle_save}>
          <i className="far fa-save mr-[10px]"></i>Save
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
                <h5 className="mb-0 text-md">OTORISASI</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="col-full input-group">
                    <div className="col-quarter p-0 input-group-prepend">
                      <label htmlFor="nama_grup" className="input-group-text">
                        NAMA GRUP
                      </label>
                    </div>
                    <div className="relative col-thirdperfour !px-0">
                      <input type="text" value={grup.nama_grup} className="form-control" name="nama_grup" id="nama_grup" placeholder="tekan tombol cari" required readOnly onChange={handle_change_grup} />
                      <button className="btn_absolute_right hover:text-primary" type="button" onClick={() => {
                        set_show_modal_grup(true);
                        set_is_selected_grup(false);
                      }}>
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
            <ListMenu list_menu={list_menu} set_list_menu={set_list_menu} keyword={keyword} set_keyword={set_keyword} menu={menu} setMenu={setMenu} />
          </div>
        </div>
      </div>
      {show_modal_grup && (
        <ModalSec modal_title="Grup" className={["modal-md"]} btn={<></>} set_modal={set_show_modal_grup}>
          <ModalMain
            set={set_kode_grup}
            is_selected={set_is_selected_grup}
            conf={{
              name: "grup",
              limit: 5,
              page: 1,
              select: ["kode", "nama", "aktif"],
              order: [["kode", "ASC"]],
              where: "kode <> 'ITS' and aktif = 't'",
              likes: ["kode", "nama"],
              keyword: "",
              func_item: {
                aktif: (item) => (item.aktif ? "Aktif" : "Non Aktif"),
              },
            }}
          >
            <th className="text-left align-middle">Action</th>
            <th className="text-left align-middle">Kode</th>
            <th className="text-left align-middle">Nama</th>
            <th className="text-left align-middle">Aktif</th>
          </ModalMain>
        </ModalSec>
      )}
    </>
  );
}

MasterOtorisasi.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
