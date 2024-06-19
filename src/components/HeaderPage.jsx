import PropTypes from 'prop-types';

export default function HeaderPage({ icon, title, children }) {
  return (
    <>
      <div className="col-full mb-2">
        <div className="modal-header-main !p-[5px]">
          <div className="xl:max-w-full max-w-full flex-[0_0_100%]">
            <div className="row">
              <div className="col-full md:flex-[0_0_40%] md:w-[40%]">
                <h2>
                  <span className="logo-menu">{icon}</span>
                  <span className="text-uppercase">{title}</span>
                </h2>
              </div>
              <div className="col-full md:flex-[0_0_60%] md:w-[60%]">
                <div className="form-group float-right">
                  {children}
                </div>
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