const { VITE_PREFIX } = import.meta.env;
export default function Footer() {
  return (
    <>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/jquery-1.10.2.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/jquery-ui.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/autocomplete.js`}></script>

      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/bootstrap.min.js`}></script>

      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/custom.js`}></script>

      <script src={`${VITE_PREFIX}assets/jquery/jquery.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/bootstrap/js/bootstrap.bundle.min.js`}></script>

      <script src={`${VITE_PREFIX}assets/js/perfect-scrollbar.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/js/script.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/js/sidebar.large.script.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/js/mhpro-sidebar.js`}></script>

      <script src={`${VITE_PREFIX}assets/jquery-easing/jquery.easing.min.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/jquery/jquery-confirm.min.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/jquery/popover.min.js`}></script>

      <script src={`${VITE_PREFIX}assets/fullcalender/js/jquery-ui.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/fullcalender/js/moment.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/fullcalender/js/fullcalendar.min.js`}></script>

      <script src={`${VITE_PREFIX}assets/datepicker/js/bootstrap-datepicker.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/datepicker/js/bootstrap-datepicker.js`}></script>
      <script src="https://cdn.jsdelivr.net/npm/mc-datepicker/dist/mc-calendar.min.js"></script>

      <script type="text/javascript" src={`${VITE_PREFIX}assets/chart.js/Chart.min.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/chart.js/chartjs-plugin-datalabels.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/jspdf.min.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/js/fuse.js`}></script>
      <script type="text/javascript" src={`${VITE_PREFIX}assets/jTippy-master/jTippy.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/datatables/jquery.dataTables.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/datatables/dataTables.bootstrap4.min.js`}></script>
      <script src={`${VITE_PREFIX}assets/js/demo/datatables-demo.js`}></script>

      <script src={`${VITE_PREFIX}assets/js/sweetalert2@11.js`}></script>

      <script src={`${VITE_PREFIX}assets/js/datetime.js`}></script>
      <script src={`${VITE_PREFIX}assets/js/moment-with-locales.min.js`}></script>

      <script src={`${VITE_PREFIX}assets/js/jquery.mask.min.js`}></script>

      <script src={`${VITE_PREFIX}assets/js/select2.min.js`} rel="stylesheet"></script>
      {/* <!-- <script src="assets/js/ajaxmask.js"></script> --> */}

      {/* <!-- <script src="<?= base_url(); ?>assets/js/select2.min.js" rel="stylesheet"></script> -->
      <!-- <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script> -->

      <!-- <script src="assets/js/jquery.idle.js"></script> --> */}
      <script src="https://cdn.jsdelivr.net/npm/jquery.idle@1.3.0/jquery.idle.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
    </>
  );
}