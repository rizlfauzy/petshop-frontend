const drop_area = document.getElementById("drop-area");
const form_import = document.getElementById("form_import");

// satuan
function require_get_satuan(keyword, rows = "0") {
  const select_limit_satuan = $("#select_limit_satuan").val();
  const field = ["kode", "nama"];
  const table = "Master/Satuan";
  const wheres = {
    aktif: "t",
  };
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
  const group = "tb_satuan";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_satuan", field.length + 1, false),
    select_limit: select_limit_satuan,
    rows,
  };
}

async function other_tab_satuan(offset) {
  try {
    const keyword = $("#input_satuan").val();
    const conf_table = {
      element: "#tbody_satuan",
      items: [],
      pagination: "",
      name_btn: "searchsatuan",
      fields: require_get_satuan(keyword).field,
      tag_pagi: "#pagination_satuan",
      colspan: this.name_btn == "" ? require_get_satuan(keyword).field.length : require_get_satuan(keyword).field.length + 1,
    };
    loading_spinner("#tbody_satuan", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_satuan(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_satuan", require_get_satuan(keyword).group, list.length, total_rows, "#pagination_satuan", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// kategori
function require_get_kategori(keyword, rows = "0") {
  const select_limit_kategori = $("#select_limit_kategori").val();
  const field = ["kode", "nama"];
  const table = "Master/Kategori";
  const wheres = {
    aktif: "t",
  };
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
  const group = "tb_kategori";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_kategori", field.length + 1, false),
    select_limit: select_limit_kategori,
    rows,
  };
}

async function other_tab_kategori(offset) {
  try {
    const keyword = $("#input_kategori").val();
    const conf_table = {
      element: "#tbody_kategori",
      items: [],
      pagination: "",
      name_btn: "searchkategori",
      fields: require_get_kategori(keyword).field,
      tag_pagi: "#pagination_kategori",
      colspan: this.name_btn == "" ? require_get_kategori(keyword).field.length : require_get_kategori(keyword).field.length + 1,
    };
    loading_spinner("#tbody_kategori", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_kategori(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_kategori", require_get_kategori(keyword).group, list.length, total_rows, "#pagination_kategori", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// barang
function require_get_barang(keyword, rows = "0") {
  const select_limit_barang = $("#select_limit_barang").val();
  const field = ["barcode", "nama", "namasatuan", "namamerk", "aktif"];
  const table = "Views/Barang";
  const wheres = {};
  const likes = ["barcode", "nama"];
  const order_by = ["barcode desc"];
  const group = "tb_barang";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_barang", field.length + 1, false),
    select_limit: select_limit_barang,
    rows,
  };
}

async function other_tab_barang(offset) {
  try {
    const keyword = $("#input_barang").val();
    const conf_table = {
      element: "#tbody_barang",
      items: [],
      pagination: "",
      name_btn: "searchbarang",
      fields: require_get_barang(keyword).field,
      tag_pagi: "#pagination_barang",
      colspan: this.name_btn == "" ? require_get_barang(keyword).field.length : require_get_barang(keyword).field.length + 1,
      4: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_barang", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_barang(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_barang", require_get_barang(keyword).group, list.length, total_rows, "#pagination_barang", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

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

async function LoadKelompok() {
  try {
    const { error, message, data } = await post_data({
      url: "/kelompok",
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    for (const item of data) {
      const is_selected = item.kode == "K000000001" ? "selected" : "";
      $("#kelompok").append(`<option value="${item.kode}" ${is_selected}>${item.nama}</option>`);
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function ValidasiImport() {
  let importdata = $("#importdata").val();
  let result;
  if (importdata == "") {
    Swal.fire({
      title: "Informasi",
      icon: "info",
      html: "Data Yang ingin di import tidak boleh kosong",
      showCloseButton: true,
      width: 350,
    });
    $("#importdata").focus();
    result = false;
  } else {
    result = true;
  }
  return result;
}

function ClearScreen() {
  $("#kelompok").empty();
  $("#kelompok").append('<option value = "" >Pilih Kelompok</option>');
  LoadKelompok();
  const options = [...document.getElementById("kelompok").options];
  options.forEach((option) => {
    if (option.value == "K000000001") {
      option.selected = true;
    }
  });
  $("#kelompok").prop("disabled", false).val("K000000001");
  $("#kode").prop("disabled", false).val("");
  $("#nama").prop("disabled", false).val("");
  $("#minstok").prop("disabled", false).val(0);
  $("#bonusbarang").prop("disabled", false).val(0);
  $("#discitem").prop("disabled", false).val(0);
  $("#kodesatuan").prop("readonly", true).val("");
  $("#namasatuan").prop("readonly", true).val("");
  $("#kodemerk").prop("readonly", true).val("");
  $("#namamerk").prop("readonly", true).val("");
  $("#komisi").prop("disabled", false).val("");
  $("#barcode").val("").focus();
  $("#aktif").prop("disabled", false);

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);
  $("#hargajual").prop("disabled", true).val(0);
  $("#hargamodal").prop("disabled", true).val(0);
  $("#carisatuan").show();
  $("#carikategori").show();

  $(".aktif").hide();
}

$("#barcode").keyup(function (e) {
  let tex = $(this).val();
  if (tex !== "" && e.keyCode === 13) {
    $("#barcode").val(tex).focus();
  }
  e.preventDefault();
});

/* Format Rupiah Saat Event Keyup */
$("#bonusbarang").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});

$("#discitem").mask("99.99%", {
  reverse: true,
});

function ValidasiSave() {
  const barcode = $("#barcode").val();
  const nama = $("#nama").val();
  const kelompok = $("#kelompok").val();
  const type = $("#type").val();
  const kodesatuan = $("#kodesatuan").val();
  const kodemerk = $("#kodemerk").val();
  const bonusbarang = $("#bonusbarang").val();

  if (barcode == "" || barcode == 0) {
    swalAlert("Barcode tidak boleh kosong.", "info");
    $("#barcode").focus();
    return false;
  } else if (nama == "" || nama == 0) {
    swalAlert("Nama tidak boleh kosong.", "info");
    $("#nama").focus();
    return false;
  } else if (kodesatuan == "") {
    swalAlert("Kode Satuan tidak boleh kosong.", "info");
    $("#kodesatuan").focus();
    return false;
  } else if (kodemerk == "") {
    swalAlert("Kode Merk tidak boleh kosong.", "info");
    $("#kodemerk").focus();
    return false;
  } else if (kelompok == "") {
    swalAlert("Pilih Kelompok terlebih Dahulu.", "info");
    $("#kelompok").focus();
    return false;
  } else if (type == "") {
    swalAlert("Pilih Type terlebih Dahulu.", "info");
    $("#type").focus();
    return false;
  } else if (bonusbarang == "") {
    swalAlert("Bonus Barang Tidak Boleh Kosong.", "info");
    $("#bonusbarang").focus();
    return false;
  } else return true;
}

$("#nama").on("input", function (e) {
  const namabarang = $(this).val();
  if (namabarang.length > 85) {
    $(this).val(namabarang.substring(0, 85));
    return swalAlert("Nama barang maksimal 85 karakter", "warning");
  }
});

// cari data satuan
$("#input_satuan").on("input", function () {
  other_tab_satuan(0);
});

$("#select_limit_satuan").change(function () {
  other_tab_satuan(0);
});

$("#hapus_keyword_satuan").click(function () {
  $("#input_satuan").val("");
  other_tab_satuan(0);
});

document.getElementById("carisatuan").addEventListener("click", function (event) {
  event.preventDefault();
  $("#find_satuan").modal("show");
  $("#input_satuan").val("").focus();
  other_tab_satuan(0);
});

$(".btn_close_satuan").click(function () {
  $("#input_satuan").val("").focus();
  $("#find_satuan").modal("hide");
});

$("#find_satuan").on("shown.bs.modal", function () {
  $("#input_satuan").val("").focus();
});

$("#find_satuan").on("hidden.bs.modal", function () {
  $("#input_satuan").val("");
  $("#pagination_satuan").html("");
});

/*Get Data Satuan */
async function load_satuan(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/satuan/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#kodesatuan").val(kode);
    $("#namasatuan").val(data?.nama);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchsatuan", async function () {
  $("#find_satuan").modal("hide");
  const kode = $(this).attr("data-id");
  await load_satuan(kode);
});

// cari data kategori
$("#input_kategori").on("input", function () {
  other_tab_kategori(0);
});

$("#select_limit_kategori").change(function () {
  other_tab_kategori(0);
});

$("#hapus_keyword_kategori").click(function () {
  $("#input_kategori").val("");
  other_tab_kategori(0);
});

document.getElementById("carikategori").addEventListener("click", function (event) {
  event.preventDefault();
  $("#find_kategori").modal("show");
  $("#input_kategori").val("").focus();
  other_tab_kategori(0);
});

$(".btn_close_kategori").click(function () {
  $("#input_kategori").val("").focus();
  $("#find_kategori").modal("hide");
});

$("#find_kategori").on("shown.bs.modal", function () {
  $("#input_kategori").val("").focus();
});

$("#find_kategori").on("hidden.bs.modal", function () {
  $("#input_kategori").val("");
  $("#pagination_kategori").html("");
});

/*Get Data Kategori */
async function load_kategori(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/kategori/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#kodemerk").val(kode);
    $("#namamerk").val(data?.nama);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchkategori", async function () {
  $("#find_kategori").modal("hide");
  const kode = $(this).attr("data-id");
  await load_kategori(kode);
});

// cari data barang
$("#input_barang").on("input", function () {
  other_tab_barang(0);
});

$("#select_limit_barang").change(function () {
  other_tab_barang(0);
});

$("#hapus_keyword_barang").click(function () {
  $("#input_barang").val("");
  other_tab_barang(0);
});

document.querySelector("#find").addEventListener("click", function () {
  $("#find_barang").modal("show");
  $("#input_barang").val("").focus();
  other_tab_barang(0);
});

$(".btn_close_barang").click(function () {
  $("#input_barang").val("").focus();
  $("#find_barang").modal("hide");
});

$("#find_barang").on("shown.bs.modal", function () {
  $("#input_barang").val("").focus();
});

$("#find_barang").on("hidden.bs.modal", function () {
  $("#input_barang").val("");
  $("#pagination_barang").html("");
});

/*Get Data Barang */
async function cek_harga(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/barang/harga?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#hargajual").val(FormatRupiah(data?.harga_jual));
    $("#hargamodal").val(FormatRupiah(data?.harga_modal));
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchbarang", async function () {
  $("#find_barang").modal("hide");
  try {
    const barcode = $(this).attr("data-id");
    const { error, message, data } = await post_data({
      url: "/barang/barcode?barcode=" + encodeURIComponent(btoa(barcode)),
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    const kode = decodeURIComponent(atob(data?.kode));
    $("#kode").val(kode);
    $("#barcode").val(barcode);
    $("#nama").val(data?.nama.trim());
    $("#kelompok").val(data?.kelompok.trim());
    $("#type").val(data?.type.trim());
    $("#kodesatuan").val(data?.kodesatuan.trim());
    $("#kodemerk").val(data?.kodemerk.trim());
    $("#minstok").val(data?.minstok.trim());
    $("#bonusbarang").val(FormatRupiah(data?.bonusbarang.trim()));
    $("#discitem").val(data?.discitem.trim() + "%");
    if (data?.aktif.trim() == "t") {
      $("#aktif").prop("checked", true);
    } else {
      $("#tidak_aktif").prop("checked", true);
    }
    if (data?.free.trim() == "t") {
      $("#free").prop("checked", true);
    } else {
      $("#tidak_free").prop("checked", true);
    }

    if (data?.target_penjualan == "t") $("#true_target").prop("checked", true);
    else $("#false_target").prop("checked", true);

    await load_satuan(data?.kodesatuan.trim());
    await load_kategori(data?.kodemerk.trim());
    await cek_harga(barcode);

    $(".aktif").show();
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

/* Save */
document.getElementById("save").addEventListener("click", async function (event) {
  event.preventDefault();
  try {
    const kode = $("#kode").val();
    const nama = $("#nama").val();
    const barcode = $("#barcode").val();
    const kelompok = $("#kelompok").val();
    const type = $("#type").val();
    const kodesatuan = $("#kodesatuan").val();
    const kodemerk = $("#kodemerk").val();
    const bonusbarang = $("#bonusbarang").val();
    const discitem = $("#discitem").val();
    const minstok = $("#minstok").val();
    const free = $('input[name="free"]:checked').val();
    const is_target = $('input[name="is_target"]:checked').val();

    if (ValidasiSave() == true) {
      const { error, message } = await post_data({
        url: "/barang",
        method: "POST",
        body: objectToFormData({
          kode,
          barcode,
          nama,
          kelompok,
          type,
          kodesatuan,
          kodemerk,
          bonusbarang: DeFormatRupiah(bonusbarang),
          discitem,
          minstok,
          free,
          is_target,
        }),
      });
      if (error) return swalAlert(message, "error");
      swalAlert(message, "success");
      ClearScreen();
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// update
document.getElementById("update").addEventListener("click", async function (event) {
  event.preventDefault();
  try {
    const kode = $("#kode").val();
    const nama = $("#nama").val();
    const kelompok = $("#kelompok").val();
    const type = $("#type").val();
    const kodesatuan = $("#kodesatuan").val();
    const kodemerk = $("#kodemerk").val();
    const barcode = $("#barcode").val();
    const bonusbarang = $("#bonusbarang").val();
    const discitem = $("#discitem").val();
    const minstok = $("#minstok").val();
    const free = $('input[name="free"]:checked').val();
    const is_target = $('input[name="is_target"]:checked').val();
    const aktif = $('input[name="aktif"]:checked').val();

    if (ValidasiSave() == true) {
      const { error, message } = await put_data({
        url: "/barang",
        body: JSON.stringify({
          kode,
          barcode,
          nama,
          kelompok,
          type,
          kodesatuan,
          kodemerk,
          bonusbarang: DeFormatRupiah(bonusbarang),
          discitem,
          minstok,
          free,
          is_target,
          aktif,
        }),
      });
      if (error) return swalAlert(message, "error");
      swalAlert(message, "success");
    }
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

document.getElementById("clear").addEventListener("click", function (event) {
  event.preventDefault();
  ClearScreen();
});

document.getElementById("import_excel").addEventListener("click", function (event) {
  event.preventDefault();
  try {
    $("#find_import").modal("show");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$(".btn_close_import").click(() => {
  $("#find_import").modal("hide").find("form").trigger("reset");
  $(".name_file").html("");
  $("#gallery").html("");
  $("#import").css("display", "none");
});

async function import_file(event) {
  event.preventDefault();
  try {
    $("#overlay-spinner").show();
    const form_data = new FormData(form_import);
    if (!form_data.has("filecsv")) throw new Error("File csv harus diisi");
    const { error, message, data } = await post_data({
      url: "/barang/import",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    $("#form_import").trigger("reset");
    $(".name_file").html("");
    $("#gallery").html("");
    $("#import").css("display", "none");
    $("#overlay-spinner").hide();
  } catch (e) {
    $("#overlay-spinner").hide();
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

drop_area.addEventListener("drop", function (e) {
  try {
    const file = e.dataTransfer.files[0];
    if (!file) return swalAlert("File belum tersedia !!!", "error");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    $("#import").css("display", "none");
    preview_file(file);
    document.getElementById("filecsv").files = e.dataTransfer.files;
    import_file(e);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

$("#filecsv").change(function () {
  try {
    const file = this.files[0];
    if (!file) throw new Error("File belum tersedia !!!");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    $("#import").css("display", "block");
    preview_file(file);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

form_import.addEventListener("submit", import_file);

$("#export_excel").click(() => {
  try {
    $("#overlay-spinner").show();
    fetch("/excel/barang", {
      headers: {
        "X-CSRF-TOKEN": $('meta[name="X-CSRF-TOKEN"]').attr("content"),
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `Laporan Semua Master Barang ${moment().format("YYYY-MM-DD hh:mm:ss")}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        $("#overlay-spinner").hide();
        swalAlert("Export berhasil", "success");
      });
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

ClearScreen();
