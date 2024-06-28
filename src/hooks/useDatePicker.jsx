import MCDatepicker from "mc-datepicker";
import moment from "moment";

export default function useDatePicker() {
  function date_picker(id) {
    return MCDatepicker.create({
      el: `#${id}`,
      bodyType: "inline",
      dateFormat: "yyyy-mm-dd",
      selectedDate: new Date(moment().format("YYYY-MM-DD")),
      minDate: new Date(moment(document.querySelector("#tglawal_periode").value).format("YYYY-MM-DD")),
      maxDate: new Date(moment().format("YYYY-MM-DD")),
      autoClose: true,
      closeOnBlur: true,
      customWeekDays: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      customMonths: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      theme: {
        weekday: {
          foreground: "#402218",
        },
        button: {
          success: {
            foreground: "#402218",
          },
          danger: {
            foreground: "#e65151",
          },
        },
        date: {
          active: {
            picked: {
              background: "#402218",
              foreground: "#ffffff",
            },
          },
        },
      },
      customOkBTN: "Pilih",
    });
  }

  return { date_picker };
}
