import { Helmet } from "react-helmet";
import PropType from "prop-types";

const { VITE_TITLE_APPS, VITE_PREFIX } = import.meta.env;

export default function Header({ title }) {
  // template untuk header semua halaman kecuali login
  return (
    <Helmet>
      <title>
        {title.toUpperCase()} | {VITE_TITLE_APPS.toUpperCase()}
      </title>
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/boxicons/boxicons.min.css`} />
      <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    </Helmet>
  );
}

Header.propTypes = {
  title: PropType.string,
};
