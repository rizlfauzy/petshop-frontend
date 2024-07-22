import PropTypes from "prop-types";

export default function HeaderPage({ icon, title, children }) {
  return (
    <>
      <div className="col-full mb-2">
        <div className="modal-header-main !p-[5px]">
          <div className="xl:max-w-full max-w-full flex-[0_0_100%]">
            <div className="row">
              <div className="col-full sm:flex-[0_0_40%] sm:mb-0 mb-3">
                <h2 className="flex items-center">
                  <span className="logo-menu">{icon}</span>
                  <span className="text-uppercase md:text-[1.7vw] !text-[1rem]">{title}</span>
                </h2>
              </div>
              <div className="col-full sm:flex-[0_0_60%]">
                <div className="form-group sm:float-right float-left flex gap-3">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

HeaderPage.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  children: PropTypes.node,
};
