import HeaderPage from "../components/HeaderPage";
import PropTypes from "prop-types";

export default function Dashboard({icon, title}) {
  return (
    <>
      <HeaderPage icon={icon} title={title} />
    </>
  );
}

Dashboard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
};