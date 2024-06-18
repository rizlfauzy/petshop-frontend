import PropTypes from "prop-types";

export default function ChangePassword({ icon, title }) {
  return (
    <>
      <div className="col-xl-12 mb-2">
        <div className="modal-header p-[5px]">
          <div className="col-xl-12">
            <div className="row">
              <div className="col-md-5">
                <h2>
                  <span className="logo-menu">{icon}</span>
                  <span className="text-uppercase">{title}</span>
                </h2>
              </div>
              <div className="col-md-7">
                <div className="form-group float-right">
                  <button id="update" type="button" className="btn btn-sm btn-dark mt-1 mr-1 ml-1 mb-0">
                    <i className="far fa-money-check-edit mr-[10px]"></i>Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

ChangePassword.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
