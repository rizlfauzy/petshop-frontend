const btn_save = document.getElementById("save");
const btn_update = document.getElementById("update");
const btn_clear = document.getElementById("clear");
const btn_find = document.getElementById("find");

// kode pos
function require_get_kodepos(keyword, rows = "0") {
  const select_limit_kodepos = $("#select_limit_kodepos").val();
  const field = ["kode", "kodepos", "kota", "kecamatan", "kelurahan", "aktif"];
  const table = "Master/Kodepos";
  const wheres = {};
  const likes = ["kode", "kodepos", "kota", "kecamatan", "kelurahan"];
  const order_by = ["kode asc"];
  const group = "tb_kodepos";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_kodepos", field.length + 1, false),
    select_limit: select_limit_kodepos,
    rows,
  };
}

async function other_tab_kodepos(offset) {
  try {
    const keyword = $("#input_kodepos").val();
    const conf_table = {
      element: "#tbody_kodepos",
      items: [],
      pagination: "",
      name_btn: "searchkodepos",
      fields: require_get_kodepos(keyword).field,
      tag_pagi: "#pagination_kodepos",
      colspan: this.name_btn == "" ? require_get_kodepos(keyword).field.length : require_get_kodepos(keyword).field.length + 1,
      5: (item) => (item.aktif === "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_kodepos", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_kodepos(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_kodepos", require_get_kodepos(keyword).group, list.length, total_rows, "#pagination_kodepos", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function ClearScreen() {
  $("#kode").val("");
  $("#kodepos").prop("disabled", false).val("");
  $("#kota").prop("disabled", false).val("");
  $("#kecamatan").prop("disabled", false).val("");
  $("#kelurahan").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);
  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);
  $(".aktif").hide();
}

/* Maxlength Nomor HP */
$('#kodepos[max]:not([max=""])').on("input", function () {
  const $this = $(this);
  const maxlength = $this.attr("max").length;
  const value = $this.val();
  if (value && value.length >= maxlength) $this.val(value.substr(0, maxlength));
});

function validasiSave() {
  const kota = $("#kota").val();
  const kecamatan = $("#kecamatan").val();
  const kelurahan = $("#kelurahan").val();

  if (kota === "" || kota === 0) {
    swalAlert("Kota tidak boleh kosong", "error");
    $("#kota").focus();
    return false;
  } else if (kecamatan === "" || kecamatan === 0) {
    swalAlert("Kecamatan tidak boleh kosong", "error");
    $("#kecamatan").focus();
    return false;
  } else if (kelurahan === "" || kelurahan === 0) {
    swalAlert("Kelurahan tidak boleh kosong", "error");
    $("#kelurahan").focus();
    return false;
  } else return true;
}

$("#input_kodepos").on("input", () => other_tab_kodepos(0));

$("#select_limit_kodepos").on("change", () => other_tab_kodepos(0));

$("#hapus_keyword_kodepos").on("click", () => {
  $("#input_kodepos").val("");
  other_tab_kodepos(0);
});

btn_find.addEventListener("click", function () {
  $("#find_kodepos").modal("show");
  $("#input_kodepos").val("").focus();
  other_tab_kodepos(0);
});

$(".btn_close_kodepos").click(function () {
  $("#input_kodepos").val("").focus();
  $("#find_kodepos").modal("hide");
});

$("#find_kodepos").on("shown.bs.modal", function () {
  $("#input_kodepos").val("").focus();
});

$("#find_kodepos").on("hidden.bs.modal", function () {
  $("#input_kodepos").val("").focus();
  $("#pagination_kodepos").html("");
});

// get data kode pos
$(document).on("click", ".searchkodepos", async function () {
  try {
    const kode = $(this).data("id");
    const { error, message, data } = await post_data({
      url: "/kodepos/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(kode);
    $("#kodepos").val(data?.kodepos);
    $("#kota").val(data?.kota);
    $("#kecamatan").val(data?.kecamatan);
    $("#kelurahan").val(data?.kelurahan);
    if (data?.aktif === "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#kodepos").prop("disabled", true);
    $(".aktif").show();
    $("#find_kodepos").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_save.addEventListener("click", async function () {
  try {
    if (!validasiSave()) return;
    const kodepos = $("#kodepos").val();
    const kota = $("#kota").val();
    const kecamatan = $("#kecamatan").val();
    const kelurahan = $("#kelurahan").val();
    const { error, message } = await post_data({
      url: "/kodepos",
      body: objectToFormData({ kodepos, kota, kecamatan, kelurahan }),
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
    if (!validasiSave()) return;
    const kode = $("#kode").val();
    const kodepos = $("#kodepos").val();
    const kota = $("#kota").val();
    const kecamatan = $("#kecamatan").val();
    const kelurahan = $("#kelurahan").val();
    const aktif = $("input[name='aktif']:checked").val();
    const { error, message } = await put_data({
      url: "/kodepos",
      method: "PUT",
      body: JSON.stringify({ kode, kodepos, kota, kecamatan, kelurahan, aktif }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

btn_clear.addEventListener("click", ClearScreen);

ClearScreen();
