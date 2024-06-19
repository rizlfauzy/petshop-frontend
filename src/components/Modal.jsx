import PropTypes from "prop-types";
import { set_show_modal } from "../hooks/useStore";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
export default function Modal({ children, modal_title, className, btn }) {
  const dispatch = useDispatch();
  const show_modal = useSelector((state) => state.conf.show_modal);
  const handle_close_modal = useCallback(() => {
    dispatch(set_show_modal(!show_modal));
  }, [dispatch, show_modal]);
  return (
    <div id="myModal" className="modal" onClick={(e) => {
      if (e.target.id === "myModal") handle_close_modal();
    }}>
      <div className={["modal-content", ...className].join(" ")}>
        <div className="modal-header flex justify-between items-center">
          <h2>{modal_title}</h2>
          <span className="close" onClick={handle_close_modal}>&times;</span>
        </div>
        <hr className="h-[2px] text-primary bg-primary" />
        <div className="modal-body">{children}</div>
        <hr className="h-[2px] text-primary bg-primary" />
        <div className="modal-footer flex justify-end gap-2">
          {btn}
          <button type="button" className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-md" id="btn_close_modal" onClick={handle_close_modal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node,
  modal_title: PropTypes.string,
  className: PropTypes.array,
  btn: PropTypes.node,
};
