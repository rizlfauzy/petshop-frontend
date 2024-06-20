import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";
import Loading from "../components/Loading";
import DataOmset from "../components/main/dashboard/DataOmset";
import OmsetBulanan from "../components/main/dashboard/OmsetBulanan";
import NotifikasiStok from "../components/main/dashboard/NotifikasiStok";
import Informasi from "../components/main/Informasi";

export default function Dashboard({ icon, title }) {
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <Loading />
      <div className="col-full table-responsive">
        <div className="row">
          <div className="sm:col-half col-full">
            <DataOmset />
          </div>
          <div className="sm:col-quarter col-full">
            <OmsetBulanan />
            <NotifikasiStok />
          </div>
          <div className="sm:col-quarter col-full">
            <Informasi />
          </div>
        </div>
      </div>
    </>
  );
}

Dashboard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};
