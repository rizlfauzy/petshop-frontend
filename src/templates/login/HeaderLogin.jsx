import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

const { VITE_TITLE_APPS, VITE_PREFIX } = import.meta.env;

export default function HeaderLogin({ title}) {
  return (
    <>
      <Helmet>
        {/* ganti title web */}
        <title>{title} | {VITE_TITLE_APPS}</title>
        {/* tambah css tambahan */}
        <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/style_login.css`} />
      </Helmet>
    </>
  );
}

// props
HeaderLogin.propTypes = {
  title: PropTypes.string,
}