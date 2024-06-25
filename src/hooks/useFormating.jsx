export default function useFormating() {
  // format rupiah
  function format_rupiah(
    angka,
    options = {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }
  ) {
    return new Intl.NumberFormat("id-ID", options).format(Number(angka));
  }

  // format disc max 100%
  function format_disc(angka) {
    return angka > 100 ? 100 : angka;
  }

  const val_format_rupiah = (angka, prefix = "Rp. ") => {
    let number_string = angka.toString();
    let split = number_string.split(",");
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
      let separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return prefix === undefined ? rupiah : rupiah ? prefix + rupiah : "";
  };

  const ext_exclude = (text, ...exts) => {
    return exts.some((ext) => text.endsWith(ext));
  }

  return { format_rupiah, format_disc, val_format_rupiah, ext_exclude };
}