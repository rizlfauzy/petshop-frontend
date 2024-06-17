import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

const { VITE_TITLE_APPS, VITE_PREFIX } = import.meta.env;

export default function HeaderLogin({ title}) {
  return (
    <>
      <Helmet>
        <title>{title} - {VITE_TITLE_APPS}</title>
        <link rel="stylesheet" href={`${VITE_PREFIX}assets/plugins/sweetalert2-11.4.32/sweetalert2.min.css`} />
        <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/font-ico-fbs.css`} />
        <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/style_login.css`} />
        <script src={`${VITE_PREFIX}assets/js/kit-fontawesome.js`}></script>
      </Helmet>
    </>
  );
}

// props
HeaderLogin.propTypes = {
  title: PropTypes.string,
}