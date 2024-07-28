import { useRef, useEffect } from "react";
import useAlert from "../../hooks/useAlert";
import useFormating from "../../hooks/useFormating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import Modal from "../Modal";
import { fetch_file } from "../../hooks/useFetch";
import useAsync from "../../hooks/useAsync";
import useSession from "../../hooks/useSession";

export default function ModalImport() {
  const drop_area_ref = useRef(null);
  const name_file_ref = useRef(null);
  const file_xlsx_ref = useRef(null);
  const gallery_ref = useRef(null);
  const btn_import_ref = useRef(null);
  const { swalAlert } = useAlert();
  const { ext_exclude } = useFormating();
  const { run } = useAsync();
  const { session } = useSession();

  useEffect(() => {
    const events = ["dragenter", "dragover", "dragleave", "drop"];
    const drop_area = drop_area_ref.current;
    const name_file = name_file_ref.current;
    const file_xlsx = file_xlsx_ref.current;
    const gallery = gallery_ref.current;
    const btn_import = btn_import_ref.current;

    file_xlsx.value = "";
    gallery.innerHTML = "";
    name_file.innerHTML = "";
    btn_import.disabled = true;

    const preview_file = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        gallery.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
      <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
      </svg>`;
      };
    };

    function event_drag(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function event_enter() {
      drop_area.classList.add("highlight");
    }

    function event_leave() {
      drop_area.classList.remove("highlight");
    }

    function event_drop(e) {
      try {
        const file = e.dataTransfer.files[0];
        if (!file) return swalAlert("File belum tersedia !!!", "error");
        if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
        name_file.innerHTML = file.name;
        file_xlsx.files = e.dataTransfer.files;
        preview_file(file);
        btn_import.disabled = false;
      } catch (e) {
        btn_import.disabled = true;
        name_file.innerHTML = "";
        gallery.innerHTML = "";
        swalAlert(e.message, "error");
      }
    }

    function file_xlsx_change() {
      try {
        const file = this.files[0];
        if (!file) throw new Error("File belum tersedia !!!");
        if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
        name_file.innerHTML = file.name;
        preview_file(file);
        btn_import.disabled = false;
      } catch (e) {
        btn_import.disabled = true;
        name_file.innerHTML = "";
        gallery.innerHTML = "";
        swalAlert(e.message, "error");
      }
    }

    async function event_import() {
      try {
        const file = file_xlsx.files[0];
        if (!file) throw new Error("File belum tersedia !!!");
        const formData = new FormData();
        formData.append("file_xlsx", file);
        const { error, message } = await run(
          fetch_file({
            url: "/goods/import",
            method: "POST",
            headers: {
              authorization: `Bearer ${session.token}`,
            },
            data: formData,
          })
        );
        if (error) throw new Error(message);
        swalAlert("Data berhasil diimport !!!", "success");
        name_file.innerHTML = "";
        gallery.innerHTML = "";
        file_xlsx.value = "";
        btn_import.disabled = true;
      } catch (e) {
        swalAlert(e.message, "error");
      }
    }

    events.forEach((event) => {
      drop_area.addEventListener(event, event_drag, false);
    });
    ["dragenter", "dragover"].forEach((event) => {
      drop_area.addEventListener(event, event_enter, false);
    });
    ["dragleave", "drop"].forEach((event) => {
      drop_area.addEventListener(event, event_leave, false);
    });
    drop_area.addEventListener("drop", event_drop);
    file_xlsx.addEventListener("change", file_xlsx_change);
    btn_import.addEventListener("click", event_import);

    return () => {
      events.forEach((event) => {
        drop_area.removeEventListener(event, event_drag, false);
      });
      ["dragenter", "dragover"].forEach((event) => {
        drop_area.removeEventListener(event, event_enter, false);
      });
      ["dragleave", "drop"].forEach((event) => {
        drop_area.removeEventListener(event, event_leave, false);
      });
      drop_area.removeEventListener("drop", event_drop);
      file_xlsx.removeEventListener("change", file_xlsx_change);
      btn_import.removeEventListener("click", event_import);
    };
  });

  return (
    <Modal
      modal_title={"Import"}
      className={["md:modal-md", "modal-xl"]}
      btn={
        <button id="import_file" className="p-2 text-white rounded-md btn-modal" disabled ref={btn_import_ref}>
          <FontAwesomeIcon icon={faFileImport} className="mr-[10px]" /> Import
        </button>
      }
    >
      <div className="table-responsive">
        <div className="row">
          <div className="col-full">
            <div className="row my-2">
              <div className="col-full input-group">
                <label htmlFor="file_xlsx" id="drop-area" ref={drop_area_ref}>
                  <div className="my-form">
                    <p>Drag dan drop file excel untuk import data barang di kotak ini atau klik kotak ini !!!</p>
                    <input type="file" name="file_xlsx" id="file_xlsx" ref={file_xlsx_ref} />
                  </div>
                  <div id="gallery" ref={gallery_ref}></div>
                  <div className="name_file" ref={name_file_ref}></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
