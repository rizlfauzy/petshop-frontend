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

  return { swalAlert };
}