import { Helmet } from "react-helmet";
import PropType from "prop-types";

const { VITE_TITLE_APPS, VITE_PREFIX } = import.meta.env;

export default function Header({ title }) {
  return (
    <Helmet>
      <title>
        {title} | {VITE_TITLE_APPS}
      </title>
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/boxicons/boxicons.min.css`} />
      <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css" />
    </Helmet>
  );
}

Header.propTypes = {
  title: PropType.string,
};
