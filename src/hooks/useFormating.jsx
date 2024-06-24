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
    return angka > 100 ? 100 + '%' : angka + '%';
  }

  return { format_rupiah, format_disc };
}