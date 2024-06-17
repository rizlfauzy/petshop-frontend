const btn_save = document.getElementById("save");
const btn_update = document.getElementById("update");
const btn_clear = document.getElementById("clear");
const btn_find = document.getElementById("find");
const form_note = document.getElementById("form_note");
const textarea_note = document.getElementById("catatan_pribadi");
const btn_note = document.getElementById("btn_note");

// sales promotion
function require_get_sales_promotion(keyword, rows = "0") {
  const select_limit_sales_promotion = $("#select_limit_sales_promotion").val();
  const field = ["barcode", "namasales", "namatoko", "aktif"];
  const table = "master/salespromotion";
  const wheres = {};
  const likes = ["barcode", "namasales", "namatoko"];
  const order_by = ["barcode desc"];
  const group = "tb_sales_promotion";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_sales_promotion", field.length + 1, false),
    select_limit: select_limit_sales_promotion,
    rows,
  };
}

async function other_tab_sales_promotion(offset) {
  try {
    const keyword = $("#input_sales_promotion").val();
    const conf_table = {
      element: "#tbody_sales_promotion",
      items: [],
      pagination: "",
      name_btn: "searchsalesp",
      fields: require_get_sales_promotion(keyword).field,
      tag_pagi: "#pagination_sales_promotion",
      colspan: this.name_btn == "" ? require_get_sales_promotion(keyword).field.length : require_get_sales_promotion(keyword).field.length + 1,
      3: (item) => (item.aktif === "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_sales_promotion", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_sales_promotion(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_sales_promotion", require_get_sales_promotion(keyword).group, list.length, total_rows, "#pagination_sales_promotion", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// toko
function require_get_toko(keyword, rows = "0") {
  const select_limit_toko = $("#select_limit_toko").val();
  const field = ["kode", "nama", "aktif"];
  const table = "master/toko";
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
      2: (item) => (item.aktif === "t" ? "Aktif" : "Tidak Aktif"),
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

$("#input_sales_promotion").on("input", () => other_tab_sales_promotion(0));
$("#select_limit_sales_promotion").on("change", () => other_tab_sales_promotion(0));
btn_find.addEventListener("click", () => {
  $("#find_sales_promotion").modal("show");
  $("#input_sales_promotion").val("").focus();
  other_tab_sales_promotion(0);
});
$(".btn_close_sales_promotion").click(() => {
  $("#input_sales_promotion").val("").focus();
  $("#find_sales_promotion").modal("hide");
});
$("#find_sales_promotion").on("shown.bs.modal", function () {
  $("#input_sales_promotion").val("").focus();
});
$("#find_sales_promotion").on("hidden.bs.modal", function () {
  $("#input_sales_promotion").val("");
  $("#pagination_sales_promotion").html("");
});
/*Get Data*/
$(document).on("click", ".searchsalesp", async function () {
  const barcode = $(this).attr("data-id");
  try {
    const { error, message, data } = await post_data({
      url: "/sales-promotion/kode?barcode=" + encodeURIComponent(btoa(barcode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(decodeURIComponent(atob(data?.kode)));
    $("#barcode").val(data?.barcode);
    $("#namasales").val(data?.namasales);
    $("#kodetoko").val(data?.kodetoko);
    $("#namatoko").val(data?.namatoko);
    $("#posisi").val(data?.posisi);
    if (data?.aktif === "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $("#update").prop("disabled", false);
    $("#save").prop("disabled", true);
    $(".aktif").show();
    $("#find_sales_promotion").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#input_toko").on("input", () => other_tab_toko(0));
$("#select_limit_toko").on("change", () => other_tab_toko(0));
$("#caritoko").click(() => {
  $("#find_toko").modal("show");
  $("#input_toko").val("").focus();
  other_tab_toko(0);
});
$(".btn_close_toko").click(() => {
  $("#input_toko").val("").focus();
  $("#find_toko").modal("hide");
});
$("#find_toko").on("shown.bs.modal", function () {
  $("#input_toko").val("").focus();
});
$("#find_toko").on("hidden.bs.modal", function () {
  $("#input_toko").val("");
  $("#pagination_toko").html("");
});
/*Get Data*/
$(document).on("click", ".searchToko", async function () {
  const kode = $(this).attr("data-id");
  try {
    const { error, message, data } = await post_data({
      url: "/toko?kode=" + kode,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kodetoko").val(data?.kode);
    $("#namatoko").val(data?.nama);
    $("#find_toko").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

async function ClearScreen() {
  $("#namasales").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);

  $(".aktif").hide();
  $("#kode").val("");
  $("#barcode").val("").prop("disabled", false);
  $("#kodetoko").val("");
  $("#namatoko").val("");
  $("#posisi").val("");

  const { error, message, data } = await post_data({
    url: "/catatan/last",
    method: "GET",
  });
  if (error) throw new Error(message);
  const note = data ? data.note : "";
  const kode_note = data ? data.kode_note : "";
  textarea_note.value = data ? data.note : "";
  textarea_note.dataset.kode = kode_note;
  btn_note.innerHTML = note ? "Ubah Catatan" : "Simpan Catatan";
  btn_note.disabled = note ? false : true;
}

function validasi_save() {
  if ($("#barcode").val() === "") {
    swalAlert("Barcode tidak boleh kosong", "error");
    $("#barcode").focus();
    return false;
  } else if ($("#kodetoko").val() === "") {
    swalAlert("Kode Toko tidak boleh kosong", "error");
    $("#kodetoko").focus();
    return false;
  } else if ($("#namatoko").val() === "") {
    swalAlert("Nama Toko tidak boleh kosong", "error");
    $("#namatoko").focus();
    return false;
  } else if ($("#posisi").val() === "") {
    swalAlert("Posisi tidak boleh kosong", "error");
    $("#posisi").focus();
    return false;
  } else if ($("#namasales").val() === "") {
    swalAlert("Nama Sales tidak boleh kosong", "error");
    $("#namasales").focus();
    return false;
  }
  return true;
}

btn_save.addEventListener("click", async function () {
  try {
    if (!validasi_save()) return;
    const data_to_upload = {
      barcode: $("#barcode").val(),
      namatoko: $("#namatoko").val(),
      kodetoko: $("#kodetoko").val(),
      posisi: $("#posisi").val(),
      namasales: $("#namasales").val(),
    };
    const form_data = objectToFormData(data_to_upload);
    const { error, message } = await post_data({
      url: "/sales-promotion",
      body: form_data,
    });
    if (error) throw new Error(message);
    ClearScreen();
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_update.addEventListener("click", async function () {
  try {
    if (!validasi_save()) return;
    const data_to_upload = {
      kode: encodeURIComponent(btoa($("#kode").val())),
      barcode: $("#barcode").val(),
      namatoko: $("#namatoko").val(),
      kodetoko: $("#kodetoko").val(),
      posisi: $("#posisi").val(),
      namasales: $("#namasales").val(),
      aktif: $('input[name="aktif"]:checked').val(),
    };
    if (data_to_upload.aktif === "false") return $("#modal_non_aktif").modal("show");
    const { error, message } = await put_data({
      url: "/sales-promotion",
      body: JSON.stringify(data_to_upload),
      method: "PUT",
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#btn_non_aktif").click(async function () {
  try {
    const data_to_upload = {
      kode: encodeURIComponent(btoa($("#kode").val())),
      alasan_non_aktif: $("#alasan_non_aktif").val(),
    };
    const form_data = objectToFormData(data_to_upload);
    const { error, message } = await post_data({
      url: "/sales-promotion/non-aktif",
      body: form_data,
    });
    if (error) throw new Error(message);
    ClearScreen();
    $("#alasan_non_aktif").val("");
    $("#modal_non_aktif").modal("hide");
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$(".btn_close_aktif").click(() => {
  $("#modal_non_aktif").modal("hide");
  $("#alasan_non_aktif").val("");
});

btn_clear.addEventListener("click", ClearScreen);

textarea_note.addEventListener("input", () => {
  if (textarea_note.value.length > 0) btn_note.disabled = false;
  else btn_note.disabled = true;
});

textarea_note.addEventListener("keypress", function (e) {
  try {
    if (e.keyCode == 13 && !e.shiftKey) {
      // this.value = this.value.replace(/(?:\r\n|\r|\n)/g, '');
      // delete content before
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
    textarea_note.value = data.note;
    textarea_note.dataset.kode = data.kode_note;
    btn_note.innerHTML = "Ubah Catatan";
    swalAlert(message, "success");
  } catch (e) {
    console.log(e);
    return swalAlert(e.message, "error");
  }
});

ClearScreen();
