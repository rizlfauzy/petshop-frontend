import PropTypes from "prop-types";
import HeaderPage from "../components/HeaderPage";

export default function MasterGrup({ icon, title }) {
  return (
    <>
      <HeaderPage icon={icon} title={title}>
        <button id="save" className="btn-sm bg-primary text-white">
          <i className="far fa-save mr-[10px]"></i>Save
        </button>
        <button id="update" type="button" className="btn-sm bg-primary text-white">
          <i className="far fa-money-check-edit mr-[10px]"></i>Update
        </button>
        <button id="find" className="btn-sm bg-primary text-white">
          <i className="far fa-file-search mr-[10px]"></i>Find
        </button>
        <button id="clear" className="btn-sm bg-primary text-white">
          <i className="far fa-refresh mr-[10px]"></i>Clear
        </button>
      </HeaderPage>
      <div className="col-full table-responsive">
        <div className="row">
          <div className="col-half">
            <div className="modal-content-main mb-2">
              <div className="modal-header-main !p-2">
                <h5 className="mb-0 text-lg">GRUP</h5>
              </div>
              <div className="modal-body-main">
                <div className="row my-2">
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="kode" className="input-group-text">
                        KODE GRUP
                      </label>
                    </div>
                    <input type="text" defaultValue={""} className="form-control col-half" name="kode" id="username" required />
                  </div>
                  <div className="sm:col-half col-full input-group">
                    <div className="col-half p-0 input-group-prepend">
                      <label htmlFor="nama" className="input-group-text">
                        NAMA GRUP
                      </label>
                    </div>
                    <input type="text" defaultValue={""} className="form-control col-half" name="nama" id="username" required />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

MasterGrup.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string,
};