const ctx = document.getElementById("myChart");
const dec_chart = document.getElementById("desc_chart");
const select_year = document.querySelector("#select_year");
const btn_prev = document.querySelector("#btn_prev");
const btn_next = document.querySelector("#btn_next");
const form_informasi = document.getElementById("form_informasi");
const textarea_informasi = document.getElementById("informasi_global");
const btn_informasi = document.getElementById("btn_informasi");

const pusher = new Pusher("8a96db14926c443312a7", {
  cluster: "ap1",
  useTLS: false,
});

const graph = pusher.subscribe("graph");
const inform = pusher.subscribe("informasi");
const omset = pusher.subscribe("omset");

graph.bind("show", function ({ sales, kode_toko }) {
  try {
    if (kode_toko != $("#cabang").val()) return;
    $("#overlay-spinner").show();
    setTimeout(() => {
      if (!sales) return swalAlert("Data tidak ditemukan", "error");
      const data = {
        labels: sales.map(({ periode }) =>
          new Date(periode).toLocaleDateString("id-ID", {
            month: "short",
            // year: 'numeric'
          })
        ),
        datasets: [
          {
            label: `Omset Bulanan Tahun ${sales[0].periode.split("-")[0]}`,
            data: sales.map(({ penjualan }) => Number(penjualan)),
            borderColor: "green",
            fill: false,
          },
        ],
      };
      new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Chart.js Line Chart",
            },
          },
        },
      });
      const content = sales
        .map(({ periode, penjualan }) => {
          const period = new Date(periode).toLocaleDateString("id-ID", {
            month: "short",
          });
          return `
      <div class="col-3">
        <div class="card">
          <div class="card-body">
            <span>${period}</span>  <p class="card-text">${FormatRupiah(penjualan, "Rp. ")}</p>
          </div>
        </div>
      </div>

        `;
        })
        .join("");
      dec_chart.innerHTML = content;
      $("#overlay-spinner").hide();
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

inform.bind("show", function ({ note, kode_note }) {
  try {
    if (!note) return swalAlert("Data tidak ditemukan", "error");
    textarea_informasi.value = note;
    textarea_informasi.dataset.kode = kode_note;
    textarea_informasi.style.height = textarea_informasi.scrollHeight + "px";
    btn_informasi.innerHTML = "Ubah Informasi";
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

omset.bind("show", function ({ sale_toko, sale_grooming, kode_toko }) {
  if (kode_toko != $("#cabang").val()) return;
  try {
    if (!sale_toko) return swalAlert("Omset toko tidak ditemukan", "error");
    if (!sale_grooming) return swalAlert("Omset grooming tidak ditemukan", "error");
    $("#omset_toko").html(FormatRupiah(sale_toko?.penjualan ?? "0", "Rp. "));
    $("#omset_grooming").html(FormatRupiah(sale_grooming?.penjualan ?? "0", "Rp. "));
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

async function show_graph(year = select_year.innerHTML) {
  try {
    const { error, message } = await post_data({
      url: "/dashboard/graph",
      method: "post",
      body: objectToFormData({
        year,
        kode_toko: $("#cabang").val(),
      }),
    });
    if (error) throw new Error(message);
  } catch (e) {
    console.error(e);
    return swalAlert(e.message, "error");
  }
}

btn_prev.addEventListener("click", () => {
  select_year.innerHTML = Number(select_year.innerHTML) - 1;
  if (select_year.innerHTML == new Date().getFullYear()) btn_next.disabled = true;
  else btn_next.disabled = false;
  show_graph(select_year.innerHTML);
});

btn_next.addEventListener("click", () => {
  select_year.innerHTML = Number(select_year.innerHTML) + 1;
  if (select_year.innerHTML == new Date().getFullYear()) btn_next.disabled = true;
  else btn_next.disabled = false;
  show_graph(select_year.innerHTML);
});

(async function () {
  if (select_year.innerHTML == new Date().getFullYear()) btn_next.disabled = true;
  else btn_next.disabled = false;

  try {
    const {
      error: e_informasi,
      message: m_informasi,
      data: d_informasi,
    } = await post_data({
      url: "/catatan/last",
      method: "GET",
    });
    if (e_informasi) throw new Error(m_informasi);
    const informasi = d_informasi ? d_informasi.note : "";
    const kode_informasi = d_informasi ? d_informasi.kode_note : "";
    textarea_informasi.value = d_informasi ? d_informasi.note : "";
    textarea_informasi.dataset.kode = kode_informasi;
    textarea_informasi.style.height = textarea_informasi.scrollHeight + "px";
    btn_informasi.innerHTML = informasi ? "Ubah Informasi" : "Simpan Informasi";
    btn_informasi.disabled = informasi ? false : true;

    if ($("#grup").val() != "ITS") {
      textarea_informasi.disabled = true;
      btn_informasi.disabled = true;
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})();

textarea_informasi.addEventListener("input", function () {
  if (textarea_informasi.value.length > 0) btn_informasi.disabled = false;
  else btn_informasi.disabled = true;

  this.style.height = "5px";
  this.style.height = this.scrollHeight + "px";
});

textarea_informasi.addEventListener("keypress", function (e) {
  try {
    if (e.keyCode == 13 && !e.shiftKey) {
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const target = e.target;
      const value = target.value;
      target.value = value.substring(0, start) + value.substring(end);
      this.selectionStart = this.selectionEnd = start;
      e.preventDefault();
      btn_informasi.click();
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

form_informasi.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const form_data = new FormData(this);
    form_data.append("kode_note", textarea_informasi.dataset.kode);

    if (form_data.get("catatan_pribadi") == "") throw new Error("Informasi Harus Diisi");
    const { error, message } = await post_data({
      url: "/catatan",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

show_graph();
