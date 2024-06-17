const btn_save = document.getElementById("save");
const btn_update = document.getElementById("update");
const btn_clear = document.getElementById("clear");
const btn_find = document.getElementById("find");

// tingkatan harga
function require_get_tingkatan(keyword, rows = "0") {
  const select_limit_tingkatan = $("#select_limit_tingkatan").val();
  const field = ["kode", "nama", "aktif"];
  const table = "master/tingkatanharga";
  const wheres = {};
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
  const group = "tb_tingkatan";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_tingkatan", field.length + 1, false),
    select_limit: select_limit_tingkatan,
    rows,
  };
}

async function other_tab_tingkatan(offset) {
  try {
    const keyword = $("#input_tingkatan").val();
    const conf_table = {
      element: "#tbody_tingkatan",
      items: [],
      pagination: "",
      name_btn: "searchHarga",
      fields: require_get_tingkatan(keyword).field,
      tag_pagi: "#pagination_tingkatan",
      colspan: this.name_btn == "" ? require_get_tingkatan(keyword).field.length : require_get_tingkatan(keyword).field.length + 1,
      2: (item) => (item.aktif === "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_tingkatan", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_tingkatan(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_tingkatan", require_get_tingkatan(keyword).group, list.length, total_rows, "#pagination_tingkatan", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$("#input_tingkatan").on("input", () => other_tab_tingkatan(0));
$("#select_limit_tingkatan").on("change", () => other_tab_tingkatan(0));
btn_find.addEventListener("click", function (e) {
  e.preventDefault();
  $("#input_tingkatan").val("").focus();
  $("#find_tingkatan").modal("show");
  other_tab_tingkatan(0);
});
$(".btn_close_tingkatan").click(() => {
  $("#input_tingkatan").val("").focus();
  $("#find_tingkatan").modal("hide");
});
$("#find_tingkatan").on("shown.bs.modal", function () {
  $("#input_tingkatan").val("").focus();
});
$("#find_tingkatan").on("hidden.bs.modal", function () {
  $("#input_tingkatan").val("");
  $("#pagination_tingkatan").html("");
});

// get data
$(document).on("click", ".searchHarga", async function () {
  try {
    const kode = encodeURIComponent(btoa($(this).data("id")));
    const { error, message, data } = await post_data({
      url: "/tingkatan-harga/find?kode=" + kode,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(decodeURIComponent(atob(data?.kode)));
    $("#nama").val(data?.nama);
    $(`input[name=aktif][value=${data?.aktif == "t" ? "true" : "false"}]`).prop("checked", true);
    $(".aktif").show();
    $("#update").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#kode").prop("disabled", true);
    $("#find_tingkatan").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

function ClearScreen() {
  $("#kode").prop("disabled", true).val("");
  $("#nama").prop("disabled", false).val("");
  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);
  $(".aktif").hide();
}

function validasi() {
  if ($("#nama").val() == "") {
    swalAlert("Nama tidak boleh kosong", "error");
    $("#nama").focus();
    return false;
  }
  return true;
}

$("#btn_non_aktif").click(async function () {
  try {
    const data_to_upload = {
      kode: encodeURIComponent(btoa($("#kode").val())),
      alasan_non_aktif: $("#alasan_non_aktif").val(),
    };
    const form_data = objectToFormData(data_to_upload);
    const { error, message } = await post_data({
      url: "/tingkatan-harga/non-aktif",
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

btn_save.addEventListener("click", async function () {
  try {
    if (!validasi()) return;
    const data_to_upload = {
      nama: $("#nama").val(),
      aktif: $("input[name=aktif]:checked").val(),
    };
    const form_data = objectToFormData(data_to_upload);
    const { error, message } = await post_data({
      url: "/tingkatan-harga",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_update.addEventListener("click", async function () {
  try {
    if (!validasi()) return;
    const data_to_upload = {
      kode: encodeURIComponent(btoa($("#kode").val())),
      nama: $("#nama").val(),
      aktif: $("input[name=aktif]:checked").val(),
    };
    if (data_to_upload.aktif === "false") return $("#modal_non_aktif").modal("show");
    const { error, message } = await put_data({
      url: "/tingkatan-harga",
      body: JSON.stringify(data_to_upload),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#export_excel").click(async () => {
  $("#overlay-spinner").show();
  try {
    const {error, message, filename} = await post_data({
      url: "/excel/harga",
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

ClearScreen();
