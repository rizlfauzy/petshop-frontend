const cari_toko = document.getElementById("caritoko");
const find_jasa = document.getElementById("find");
const btn_save = document.getElementById("save");
const btn_update = document.getElementById("update");

// jasa
function require_get_jasa(keyword, rows = "0") {
  const select_limit_jasa = $("#select_limit_jasa").val();
  const field = ["kode", "namajasa"];
  const table = "Master/Jasa";
  const wheres = {};
  const likes = ["kode", "namajasa"];
  const order_by = ["kode desc"];
  const group = "tb_jasa";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_jasa", field.length + 1, false),
    select_limit: select_limit_jasa,
    rows,
  };
}

async function other_tab_jasa(offset) {
  try {
    const keyword = $("#input_jasa").val();
    const conf_table = {
      element: "#tbody_jasa",
      items: [],
      pagination: "",
      name_btn: "searchjasa",
      fields: require_get_jasa(keyword).field,
      tag_pagi: "#pagination_jasa",
      colspan: this.name_btn == "" ? require_get_jasa(keyword).field.length : require_get_jasa(keyword).field.length + 1,
    };
    loading_spinner("#tbody_jasa", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_jasa(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_jasa", require_get_jasa(keyword).group, list.length, total_rows, "#pagination_jasa", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// toko
function require_get_toko(keyword, rows = "0") {
  const select_limit_toko = $("#select_limit_toko").val();
  const field = ["kode", "nama", "pemegang_toko", "admin_toko", "tipe_gaji", "gaji", "komisi", "kodeauditor", "namaauditor"];
  const table = "Master/Toko";
  const wheres = {};
  const likes = ["kode", "nama"];
  const order_by = ["kode asc"];
  const group = "tb_toko";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_toko", field.length + 1, false),
    select_limit: select_limit_toko,
    rows,
  };
}

async function other_tab_toko(offset) {
  try {
    const keyword = $("#input_toko").val();
    const conf_table = {
      element: "#tbody_toko",
      items: [],
      pagination: "",
      name_btn: "searchToko",
      fields: require_get_toko(keyword).field,
      tag_pagi: "#pagination_toko",
      colspan: this.name_btn == "" ? require_get_toko(keyword).field.length : require_get_toko(keyword).field.length + 1,
      2: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_toko", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_toko(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_toko", require_get_toko(keyword).group, list.length, total_rows, "#pagination_toko", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

/* Function ClearScreen */
function ClearScreen() {
  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);
  $("#aktif").prop("disabled", false);

  $("#kode").prop("disabled", false).val("");
  $("#nama").prop("disabled", false).val("");
  $("#ketjasa").prop("disabled", false).val("");
  $("#kodetoko").prop("disabled", false).val("");
  $("#hrgbeli").prop("disabled", false).val("");
  $("#hrgjual").prop("disabled", false).val("");
  $("#hrgtoko").prop("disabled", true).val("");
  $(".aktif").hide();
}

/* Format Rupiah Saat Event Keyup */
$("#hrgbeli").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});
$("#hrgjual").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});
$("#hrgtoko").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});

$("#nama, #hrgtoko").change(function () {
  const nama = $("#nama").val();

  if (nama == "Grooming" || nama == "Hotel") $("#hrgtoko").prop("disabled", false);
  else if (nama == "Dokter") $("#hrgtoko").prop("disabled", true);
  else $("#hrgtoko").prop("disabled", true);
});

/* Function Validasi Save */
function ValidasiSave() {
  const kode = $("#kode").val();
  const nama = $("#nama").val();
  const ketjasa = $("#ketjasa").val();
  const kodetoko = $("#kodetoko").val();
  const hrgbeli = $("#hrgbeli").val();
  const hrgjual = $("#hrgjual").val();
  const hrgtoko = $("#hrgtoko").val();

  if (kode == "" || kode == 0) {
    swalAlert("Kode tidak boleh kosong.", "error");
    $("#kode").focus();
    return false;
  } else if (nama == "" || nama == 0) {
    swalAlert("Nama tidak boleh kosong.", "error");
    $("#nama").focus();
    return false;
  } else if (hrgbeli == "" || hrgbeli == 0) {
    swalAlert("Harga Beli tidak boleh kosong.", "error");
    $("#hrgbeli").focus();
    return false;
  } else if (hrgjual == "" || hrgjual == 0) {
    swalAlert("Harga Jual tidak boleh kosong.", "error");
    $("#hrgjual").focus();
    return false;
  } else if (hrgtoko == "" || hrgtoko == 0) {
    swalAlert("Harga Toko tidak boleh kosong.", "error");
    $("#hrgtoko").focus();
    return false;
  } else if (ketjasa == "" || ketjasa == 0) {
    swalAlert("Keterangan Jasa tidak boleh kosong.", "error");
    $("#ketjasa").focus();
    return false;
  } else if (kodetoko == "" || kodetoko == 0) {
    swalAlert("Kode Toko tidak boleh kosong.", "error");
    $("#kodetoko").focus();
    return false;
  } else return true;
}

$("#input_toko").on("input", () => other_tab_toko(0));

$("#select_limit_toko").change(() => other_tab_toko(0));

$("#hapus_keyword_toko").click(function () {
  $("#input_toko").val("");
  other_tab_toko(0);
});

cari_toko.addEventListener("click", function () {
  $("#find_toko").modal("show");
  $("#input_toko").val("").focus();
  other_tab_toko(0);
});

$(".btn_close_toko").click(function () {
  $("#input_toko").val("").focus();
  $("#find_toko").modal("hide");
});

$("#find_toko").on("shown.bs.modal", function () {
  $("#input_toko").val("").focus();
});

$("#find_toko").on("hidden.bs.modal", function () {
  $("#input_toko").val("").focus();
  $("#pagination_kategori").html("");
});

$(document).on("click", ".searchToko", async function () {
  const kode = $(this).attr("data-id");
  try {
    if (kode == "") throw new Error("Kode Toko tidak ditemukan");
    const { error, message, data } = await post_data({
      url: "/toko?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#kodetoko").val(data?.kode);
    $("#find_toko").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#input_jasa").on("input", () => other_tab_jasa(0));

$("#select_limit_jasa").change(() => other_tab_jasa(0));

$("#hapus_keyword_jasa").click(function () {
  $("#input_jasa").val("");
  other_tab_jasa(0);
});

find_jasa.addEventListener("click", function () {
  $("#find_jasa").modal("show");
  $("#input_jasa").val("").focus();
  other_tab_jasa(0);
});

$(".btn_close_jasa").click(function () {
  $("#input_jasa").val("").focus();
  $("#find_jasa").modal("hide");
});

$("#find_jasa").on("shown.bs.modal", function () {
  $("#input_jasa").val("").focus();
});

$("#find_jasa").on("hidden.bs.modal", function () {
  $("#input_jasa").val("").focus();
  $("#pagination_jasa").html("");
});

$(document).on("click", ".searchjasa", async function () {
  const kode = $(this).attr("data-id");
  try {
    const { error, message, data } = await post_data({
      url: "/jasa/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(kode);
    $("#nama").val(data?.namakategori.toUpperCase());
    $("#ketjasa").val(data?.namajasa);
    $("#kodetoko").val(data?.kodetoko);
    $("#hrgbeli").val(FormatRupiah(data?.hargabeli));
    $("#hrgjual").val(FormatRupiah(data?.hargajual));
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#nomor").prop("disabled", true);
    $(".aktif").show();
    $("#find_jasa").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_save.addEventListener("click", async function () {
  try {
    if (!ValidasiSave()) return;
    const kode = $("#kode").val();
    const nama = $("#nama").val();
    const ketjasa = $("#ketjasa").val();
    const kodetoko = $("#kodetoko").val();
    const hrgbeli = DeFormatRupiah($("#hrgbeli").val().toString());
    const hrgjual = DeFormatRupiah($("#hrgjual").val().toString());
    const { error, message } = await post_data({
      url: "/jasa",
      method: "POST",
      body: objectToFormData({ kode, nama, ketjasa, kodetoko, hrgbeli, hrgjual }),
    });
    if (error) throw new Error(message);
    swalAlert("Data Jasa berhasil disimpan.", "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_update.addEventListener("click", async function () {
  try {
    const kode = $("#kode").val();
    const nama = $("#nama").val();
    const ketjasa = $("#ketjasa").val();
    const kodetoko = $("#kodetoko").val();
    const hrgbeli = DeFormatRupiah($("#hrgbeli").val().toString());
    const hrgjual = DeFormatRupiah($("#hrgjual").val().toString());
    const aktif = $('input[name="aktif"]:checked').val();
    const { error, message } = await put_data({
      url: "/jasa",
      body: JSON.stringify({ kode, nama, ketjasa, kodetoko, hrgbeli, hrgjual, aktif }),
    });
    if (error) throw new Error(message);
    swalAlert("Data Jasa berhasil diupdate.", "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#clear").click(function () {
  ClearScreen();
});

ClearScreen();
