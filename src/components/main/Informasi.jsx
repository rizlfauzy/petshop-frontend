import useSocketIo from "../../hooks/useSocketIo";
import { useState, useLayoutEffect, useEffect, useRef, useCallback } from "react";
import useAlert from "../../hooks/useAlert";

export default function Informasi() {
  const [info, setInfo] = useState(null);
  const { run_socket, is_loading_socket, data_socket } = useSocketIo();
  const { swalAlert } = useAlert();
  const textarea_info = useRef(null);
  const btn_submit = useRef(null);

  useLayoutEffect(() => {
    run_socket("info", {});
  }, []);

  useEffect(() => {
    const obj = !is_loading_socket ? data_socket : null;
    setInfo(obj);
  }, [data_socket, is_loading_socket]);

  useEffect(() => {
    if (info) {
      const { current: text_area } = textarea_info;
      text_area.style.height = '5px';
      text_area.style.height = `${text_area.scrollHeight}px`;
    }
  })

  const on_change_text = useCallback(() => {
    const {current: text_area} = textarea_info;
    text_area.style.height = `${text_area.scrollHeight}px`;
    setInfo({ ...info, data: { info: text_area.value } });
    const informasi = info?.data?.info || '';
    console.log(informasi, btn_submit.current.innerHTML, informasi == '');
    btn_submit.current.innerHTML = informasi == "" ? "Ubah" : "Simpan";
    btn_submit.current.disabled = informasi == '' ? false : true;
  }, [info]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-[14px]">Informasi</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <form action="#" className="col-full input-group">
            <div className="col-full input-group">
              <textarea ref={textarea_info} name="info" id="info" className="max-h-[100vh] form-control" placeholder="Informasi ..." value={info ? info?.data?.info : ''} onInput={on_change_text}></textarea>
            </div>
            <div className="col-full mt-2">
              <div className="row justify-between items-center">
                <p className="text-gray-400 text-[11px] mb-0 w-[60%]">*Tekan enter untuk simpan informasi dan shift + enter untuk nambah baris baru</p>
                <button ref={btn_submit} type="submit" className="px-4 py-2 text-center bg-green-400 rounded text-white w-[40%]">
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
