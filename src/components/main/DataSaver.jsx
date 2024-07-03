import PropTypes from 'prop-types';

export default function DataSaver({item}) {
  return (
    <>
      <input className="form-control" type="hidden" name="grup" id="grup" maxLength="50" defaultValue={item?.data?.mygrup} required readOnly />
      <input className="form-control" type="hidden" name="username" id="username" maxLength="50" defaultValue={item?.data?.myusername} required readOnly />
      <input className="form-control" type="hidden" name="cabang" id="cabang" maxLength="50" defaultValue={item?.data?.mycabang} required readOnly />
      <input className="form-control" type="hidden" name="tglawal_periode" id="tglawal_periode" maxLength="50" defaultValue={item?.data?.tglawal_periode} required readOnly />
      <input className="form-control" type="hidden" name="tglakhir_periode" id="tglakhir_periode" maxLength="50" defaultValue={item?.data?.tglakhir_periode} required readOnly />
      <input type="hidden" name="fitur_add" id="fitur_add" defaultValue={item?.data?.cek_menu?.add ?? "f"} readOnly />
      <input type="hidden" name="fitur_update" id="fitur_update" defaultValue={item?.data?.cek_menu?.update ?? "f"} readOnly />
      <input type="hidden" name="fitur_cancel" id="fitur_cancel" defaultValue={item?.data?.cek_menu?.cancel ?? "f"} readOnly />
      <input type="hidden" name="fitur_accept" id="fitur_accept" defaultValue={item?.data?.cek_menu?.accept ?? "f"} readOnly />
      <input type="hidden" name="fitur_backdate" id="fitur_backdate" defaultValue={item?.data?.cek_menu?.backdate ?? "f"} readOnly />
      <input type="hidden" name="fitur_open" id="fitur_open" defaultValue={item?.data?.cek_menu?.open ?? "f"} readOnly />
    </>
  );
}

DataSaver.propTypes = {
  item: PropTypes.object,
};