import { useState, useEffect,useLayoutEffect, useRef, useCallback } from "react";
import useAsync from "../../hooks/useAsync";
import useAlert from "../../hooks/useAlert";
import { fetch_data } from "../../hooks/useFetch";
import useSession from "../../hooks/useSession";
import useSocket from "../../hooks/useSocket";

export default function Informasi() {
  const [info, setInfo] = useState(null);
  const { swalAlert } = useAlert();
  const textarea_info = useRef(null);
  const btn_submit = useRef(null);
  const { run } = useAsync();
  const { session } = useSession();
  const socket = useSocket("info", (res) => {
    setInfo(res);
  });

  useLayoutEffect(() => {
    socket.emit("info");
  }, [socket]);

  useEffect(() => {
    if (!info) return;
    const { current: text_area } = textarea_info;
    text_area.style.height = `${text_area.scrollHeight}px`;

    const value = text_area.value;
    btn_submit.current.disabled = value.length > 0 ? false : true;
    btn_submit.current.innerHTML = value.length > 0 ? "Ubah" : "Simpan";
  }, [info]);

  const on_input_text = () => {
    const { current: text_area } = textarea_info;
    setInfo({ ...info, data: { info: text_area.value } });
    if (text_area.value.length > 0) btn_submit.current.disabled = false;
    else btn_submit.current.disabled = true;

    text_area.style.height = "5px";
    text_area.style.height = `${text_area.scrollHeight}px`;
  };

  const on_key_down = (e) => {
    try {
      const { current: text_area } = textarea_info;
      if (e.key === "Enter" && !e.shiftKey) {
        const { current: btn } = btn_submit;
        const start = text_area.selectionStart;
        const end = text_area.selectionEnd;
        const value = text_area.value;
        text_area.value = value.substring(0, start) + value.substring(end);
        text_area.selectionStart = text_area.selectionEnd = start;
        setInfo({ ...info, data: { info: text_area.value } });
        btn.click();
      }
    } catch (e) {
      swalAlert(e.message, "error");
    }
  };

  const on_submit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { current: text_area } = textarea_info;
      const value = text_area.value;
      if (value.length === 0) throw new Error("Informasi tidak boleh kosong");
      const { error, message } = await run(
        fetch_data({
          url: "/info",
          method: "POST",
          headers: {
            authorization: `Bearer ${session.token}`,
          },
          data: { info: value },
        })
      );
      if (error) throw new Error(message);
      swalAlert(message, "success");
    } catch (e) {
      swalAlert(e.message, "error");
    }
  },[run, session, swalAlert]);

  return (
    <div className="modal-content-main mb-2">
      <div className="modal-header-main !p-2">
        <h5 className="mb-0 text-[14px]">Informasi</h5>
      </div>
      <div className="modal-body-main">
        <div className="row my-2">
          <form action="#" className="col-full input-group" onSubmit={on_submit}>
            <div className="col-full input-group">
              <textarea ref={textarea_info} name="info" id="info" className="max-h-[100vh] form-control" placeholder="Informasi ..." value={info ? info?.data?.info : ""} onInput={on_input_text} onKeyDown={on_key_down}></textarea>
            </div>
            <div className="col-full mt-2">
              <div className="row justify-between items-center">
                <p className="text-gray-400 text-[11px] mb-0 w-[60%]">*Tekan enter untuk simpan informasi dan shift + enter untuk nambah baris baru</p>
                <button ref={btn_submit} type="submit" className="px-4 py-2 text-center bg-green-400 rounded text-white w-[40%] disabled:bg-green-200 hover:bg-green-600 active:bg-green-800">
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
