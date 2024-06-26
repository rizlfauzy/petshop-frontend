import useAsync from "../../../hooks/useAsync";
import { get_data } from "../../../hooks/useFetch";
import useSession from "../../../hooks/useSession";
import { useState, useLayoutEffect, useEffect } from "react";

export default function ListMenu() {
  const { run, isLoading, data } = useAsync();
  const { session } = useSession();
  const [menu, setMenu] = useState(null);

  useLayoutEffect(() => {
    run(
      get_data({
        url: "/otority/menus",
        headers: { authorization: `Bearer ${session.token}` },
      })
    );
  }, [run, session]);

  useEffect(() => {
    const obj = isLoading ? null : data;
    setMenu(obj);
  }, [data, isLoading]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-md">list menu</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <div className="table-responsive">
            <div className="row mb-2 justify-between">
              <div className="col-half">
                <div className="input-group justify-start">
                  <div className="col-quarter p-0 input-group-prepend">
                    <label htmlFor="input_menu" className="input-group-text">
                      Cari Data
                    </label>
                  </div>
                  <div className="relative col-half !px-0">
                    <input type="text" className="form-control w-full" id="input_menu" placeholder="Ketik Di sini ..." required />
                    <button className="btn_absolute_right hover:text-primary" type="button">
                      <i className="far fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="row table-scroll mb-2">
              <table className="table-modal table-bordered table-striped">
                <thead className="thead-dark">
                  <tr className="tr_head">
                    <th className="text-left align-middle">Nomor</th>
                    <th className="text-left align-middle">Kode Menu</th>
                    <th className="text-left align-middle">Nama Menu</th>
                    <th className="text-left align-middle">Grup Menu</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading ?
                    menu?.data?.map((item, index) => (
                      <tr key={item.nomenu}>
                        <td className="text-left align-middle">{index + 1}</td>
                        <td className="text-left align-middle">{item.nomenu}</td>
                        <td className="text-left align-middle">{item.namamenu}</td>
                        <td className="text-left align-middle">{item.grupmenu}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          loading...
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
