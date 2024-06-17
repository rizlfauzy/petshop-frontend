const form_note = document.getElementById("form_note");
const textarea_note = document.getElementById("catatan_pribadi");
const btn_note = document.getElementById("btn_note");
const btn_clear = document.getElementById("clear");
const form_import = document.getElementById("form_import");
const drop_area = document.getElementById("drop-area");

function ext_exclude(text, ...exts) {
  try {
    if (exts.length === 0) throw new Error("Tidak ada ekstensi yang diizinkan");
    const ext = text.split(".").pop();
    if (!ext) throw new Error("File tidak memiliki ekstensi");
    return exts.includes(ext.toLowerCase());
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function preview_file(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    document.getElementById("gallery").innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
      <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
      </svg>`;
  };
}

const pusher = new Pusher("8a96db14926c443312a7", {
  cluster: "ap1",
  useTLS: false,
});

const inform = pusher.subscribe("informasi");

inform.bind("show", function ({ note, kode_note }) {
  try {
    if (!note) return swalAlert("Data tidak ditemukan", "error");
    textarea_note.value = note;
    textarea_note.dataset.kode = kode_note;
    textarea_note.style.height = textarea_note.scrollHeight + "px";
    btn_note.innerHTML = "Ubah Catatan";
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

async function LoadHargaTingkatan() {
  try {
    const { error, message, data } = await post_data({
      url: "/tingkatan-harga",
      method: "GET",
    });
    if (error) throw new Error(message);
    const html = data
      .map((item) => {
        const kodepencarian = item.kode.replace(/[^a-zA-Z0-9 ]/g, "");
        return /*html*/ `
            <tr class="prices tr_checkbox" id="${kodepencarian}">
              <td nowrap>${item.kode}</td>
              <td nowrap>${item.nama}</td>
              <td nowrap style="display: none;" id="value_${item.kode}">
                false
              </td>
            </tr>
          `;
      })
      .join("");
    $("#tb_detail").html(html);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function ClearScreen() {
  $("#tb_detail").empty();
  LoadHargaTingkatan();

  $(".name_file").html("");
  $("#gallery").html("");
  $("#form_import").trigger("reset");

  const { error, message, data } = await post_data({
    url: "/catatan/last",
    method: "GET",
  });
  if (error) throw new Error(message);
  const note = data ? data.note : "";
  const kode_note = data ? data.kode_note : "";
  textarea_note.value = data ? data.note : "";
  textarea_note.dataset.kode = kode_note;
  textarea_note.style.height = textarea_note.scrollHeight + "px";
  btn_note.innerHTML = note ? "Ubah Catatan" : "Simpan Catatan";
  btn_note.disabled = note ? false : true;

  resetLocalStorage("list_harga");
  clearAllLocalStorage();
}

$("#selectall").on("change", function () {
  try {
    const prices = document.querySelectorAll(".prices");
    prices.forEach((item) => item.classList.remove("clicked-event"));
    const checked = $(this).prop("checked");
    if (checked) {
      prices.forEach((item) => {
        item.classList.add("clicked-event");
        const is_checked = item.classList.contains("clicked-event");
        const kode_harga = item.id;
        const nama_harga = item.children[1].innerHTML;
        if (is_checked) saveLocalStorage("list_harga", { kode: kode_harga, nama: nama_harga }, kode_harga);
        else deleteLocalStorage("list_harga", kode_harga);
      });
    } else {
      prices.forEach((item) => {
        item.classList.remove("clicked-event");
      });
      resetLocalStorage("list_harga");
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$(document).on("click", ".prices", async function (e) {
  try {
    const tr = e.target.parentElement;
    tr.classList.toggle("clicked-event");
    const checked = tr.classList.contains("clicked-event");
    const kode_harga = tr.id;
    const nama_harga = tr.children[1].innerHTML;
    if (checked) saveLocalStorage("list_harga", { kode: kode_harga, nama: nama_harga }, kode_harga);
    else deleteLocalStorage("list_harga", kode_harga);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#export_excel").click(async () => {
  $("#overlay-spinner").show();
  try {
    const { error, message, filename } = await post_data({
      url: "/excel/list-harga",
      method: "GET",
    });
    if (error) throw new Error(message);
    const url = "/assets/excels/" + filename;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    $("#overlay-spinner").hide();
    swalAlert(message, "success");
  } catch (e) {
    $("#overlay-spinner").hide();
    return swalAlert(e.message, "error");
  }
});

$("#format").click(async () => {
  $("#overlay-spinner").show();
  try {
    const { error, message, filename } = await post_data({
      url: "/excel/list-harga/format",
      method: "GET",
    });
    if (error) throw new Error(message);
    const url = "/assets/excels/" + filename;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    $("#overlay-spinner").hide();
    swalAlert(message, "success");
  } catch (e) {
    $("#overlay-spinner").hide();
    return swalAlert(e.message, "error");
  }
});

btn_clear.addEventListener("click", ClearScreen);

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
});

["dragenter", "dragover"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function () {
      drop_area.classList.add("highlight");
    },
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function () {
      drop_area.classList.remove("highlight");
    },
    false
  );
});

async function import_file(event) {
  event.preventDefault();
  try {
    $("#overlay-spinner").show();
    const form_data = new FormData(form_import);
    form_data.append("data_detail", JSON.stringify(getLocalStorage("list_harga")));
    if (getLocalStorage("list_harga").length < 1) throw new Error("Data harga belum dipilih");
    if ($("#filecsv").val() == '') throw new Error("File csv harus diisi");
    const { error, message, data } = await post_data({
      url: "/list-harga/import",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    ClearScreen();
    // $("#import").css("display", "none");
    $("#overlay-spinner").hide();
  } catch (e) {
    $("#overlay-spinner").hide();
    return swalAlert(e.message, "error");
  }
}

drop_area.addEventListener("drop", function (e) {
  try {
    const file = e.dataTransfer.files[0];
    if (!file) return swalAlert("File belum tersedia !!!", "error");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    // $("#import").css("display", "none");
    preview_file(file);
    document.getElementById("filecsv").files = e.dataTransfer.files;
    // import_file(e);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    // $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

$("#filecsv").change(function () {
  try {
    const file = this.files[0];
    if (!file) throw new Error("File belum tersedia !!!");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    preview_file(file);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    // $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

document.querySelector("#import").addEventListener("click", import_file);

textarea_note.addEventListener("input", function () {
  if (textarea_note.value.length > 0) btn_note.disabled = false;
  else btn_note.disabled = true;

  this.style.height = "5px";
  this.style.height = this.scrollHeight + "px";
});

textarea_note.addEventListener("keypress", function (e) {
  try {
    if (e.keyCode == 13 && !e.shiftKey) {
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const target = e.target;
      const value = target.value;
      target.value = value.substring(0, start) + value.substring(end);
      this.selectionStart = this.selectionEnd = start;
      e.preventDefault();
      btn_note.click();
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

form_note.addEventListener("submit", async function (e) {
  try {
    e.preventDefault();
    const form_data = new FormData(this);
    form_data.append("kode_note", textarea_note.dataset.kode);

    if (form_data.get("catatan_pribadi") == "") throw new Error("Catatan Pribadi Harus Diisi");
    const { error, message, data } = await post_data({
      url: "/catatan",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    console.log(e);
    return swalAlert(e.message, "error");
  }
});

ClearScreen();
