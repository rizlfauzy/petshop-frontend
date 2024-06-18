import PropTypes from 'prop-types';

export default function DataSaver({item}) {
  return (
    <>
      <input className="form-control" type="hidden" name="grup" id="grup" maxLength="50" value={item?.data?.mygrup} required />
      <input className="form-control" type="hidden" name="username" id="username" maxLength="50" value={item?.data?.myusername} required />
      <input className="form-control" type="hidden" name="cabang" id="cabang" maxLength="50" value={item?.data?.mycabang} required />
      <input className="form-control" type="hidden" name="tglawal_periode" id="tglawal_periode" maxLength="50" value={item?.data?.tglawal_periode} required />
      <input className="form-control" type="hidden" name="tglakhir_periode" id="tglakhir_periode" maxLength="50" value={item?.data?.tglakhir_periode} required />
      <input type="hidden" name="fitur_add" id="fitur_add" value={item?.data?.cek_menu?.add ?? "f"} />
      <input type="hidden" name="fitur_update" id="fitur_update" value={item?.data?.cek_menu?.update ?? "f"} />
      <input type="hidden" name="fitur_cancel" id="fitur_cancel" value={item?.data?.cek_menu?.cancel ?? "f"} />
      <input type="hidden" name="fitur_accept" id="fitur_accept" value={item?.data?.cek_menu?.accept ?? "f"} />
      <input type="hidden" name="fitur_backdate" id="fitur_backdate" value={item?.data?.cek_menu?.backdate ?? "f"} />
      <input type="hidden" name="fitur_open" id="fitur_open" value={item?.data?.cek_menu?.open ?? "f"} />
    </>
  );
}

DataSaver.propTypes = {
  item: PropTypes.object,
};