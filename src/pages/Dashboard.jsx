import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";
import Loading from "../components/Loading";
import DataOmset from "../components/main/Dashboard/DataOmset";
import OmsetBulanan from "../components/main/Dashboard/OmsetBulanan";
import NotifikasiStok from "../components/main/Dashboard/NotifikasiStok";
import Informasi from "../components/main/Informasi";

export default function Dashboard({ icon, title }) {
  return (
    <>
      <HeaderPage icon={icon} title={title} />
      <Loading />
      <div className="col-full table-responsive">
        <div className="row">
          <div className="md:col-half col-full">
            <DataOmset />
          </div>
          <div className="md:col-quarter col-full">
            <OmsetBulanan />
            <NotifikasiStok />
          </div>
          <div className="md:col-quarter col-full">
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
