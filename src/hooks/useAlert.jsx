import { useReducer } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function useAlert() {
  const MySwal = withReactContent(Swal);
  const initialState = {
    show: false,
    message: "",
    type: "info",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "show":
        return { show: true, message: action.message, type: action.type };
      case "hide":
        return { show: false, message: "", type: "info" };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  function swalAlert(msg, type) {
    dispatch({ show: true, message: msg, type });
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

  return { state, dispatch,swalAlert };
}