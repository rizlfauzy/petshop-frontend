import PropTypes from "prop-types";

export default function ModalSec({ children, modal_title, className, btn, set_modal }) {
  return (
    <div id="myModal" className="modal" onClick={(e) => {
      if (e.target.id === "myModal") set_modal(false);
    }}>
      <div className={["modal-content", ...className].join(" ")}>
        <div className="modal-header flex justify-between items-center">
          <h2>{modal_title}</h2>
          <span className="close" onClick={() => set_modal(false)}>&times;</span>
        </div>
        <hr className="h-[2px] text-primary bg-primary" />
        <div className="modal-body">{children}</div>
        <hr className="h-[2px] text-primary bg-primary" />
        <div className="modal-footer flex justify-end gap-2">
          {btn}
          <button type="button" className="p-2 bg-red-500 hover:bg-red-700 text-white rounded-md" id="btn_close_modal" onClick={() => set_modal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

ModalSec.propTypes = {
  children: PropTypes.node,
  modal_title: PropTypes.string,
  className: PropTypes.array,
  btn: PropTypes.node,
  set_modal: PropTypes.func,
};