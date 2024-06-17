import { Helmet } from "react-helmet";
import PropType from "prop-types";

const { VITE_TITLE_APPS, VITE_PREFIX } = import.meta.env;

export default function Header({ title }) {
  return (
    <Helmet>
      <title>
        {title} - {VITE_TITLE_APPS}
      </title>
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/lite-purple.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/font-awesome.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/fontawesome/css/all.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/boxicons/boxicons.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/perfect-scrollbar.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/jquery-confirm.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/jTippy-master/jTippy.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/datepicker/css/bootstrap-datepicker.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/datatables/dataTables.bootstrap4.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/plugins/sweetalert2-11.4.32/sweetalert2.min.css`} />
      <link rel="stylesheet" href={`${VITE_PREFIX}assets/css/jquery.scrolling-tabs.css`} />

      <link href="https://cdn.jsdelivr.net/npm/mc-datepicker/dist/mc-calendar.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css" />
    </Helmet>
  );
}

Header.propTypes = {
  title: PropType.string,
};
