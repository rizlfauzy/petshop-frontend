import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function useAlert() {
  const MySwal = withReactContent(Swal);

  function swalAlert(msg, type) {
    MySwal.fire({
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      text: msg,
      icon: type,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", MySwal.stopTimer);
        toast.addEventListener("mouseleave", MySwal.resumeTimer);
      },
    });
  }

  async function swalAlertConfirm(msg, type) {
    return await MySwal.fire({
      title: "Apakah anda yakin?",
      text: msg,
      icon: type,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya !!!",
      cancelButtonText: "Tidak !!!",
    });
  }

  async function swalAlertInput(msg, type) {
    return await MySwal.fire({
      title: "Apakah anda yakin?",
      text: msg,
      icon: type,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya !!!",
      cancelButtonText: "Tidak !!!",
      input: "textarea",
      inputLabel: "Alasan",
      inputPlaceholder: "Ketikan Alasan di sini...",
      inputAutoTrim: true,
      inputAttributes: {
        required: true,
        "aria-label": "Ketikan Alasan di sini...",
      },
      inputValidator: (result) => !result && "Alasan tidak boleh kosong!!!",
      didOpen: (toast) => {
        [...toast.children].forEach(ele => {
          if (ele.nodeName == 'TEXTAREA') {
            ele.addEventListener("keydown", function (e) {
              if (e.key === 'Enter') {
                // jika textarea tidak kosong maka
                if (e.target.value.trim() !== '') {
                  MySwal.clickConfirm();
                }
              }
            })
          }
        })
      }
    });
  }

  return { swalAlert, swalAlertConfirm, swalAlertInput };
}