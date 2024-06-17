// satuan
function require_get_satuan(keyword, rows = "0") {
  const select_limit_satuan = $("#select_limit_satuan").val();
  const field = ["kode", "nama", "aktif"];
  const table = "Master/Satuan";
  const wheres = {};
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
      2: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
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

function ClearScreen() {
  $("#kodesatuan").prop("disabled", false).val("");
  $("#namasatuan").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);

  $(".aktif").hide();
}

function ValidasiSave() {
  const kode = $("#kodesatuan").val();
  const nama = $("#namasatuan").val();
  if (kode == "" || kode == 0) {
    swalAlert("Kode tidak boleh kosong", "error");
    $("#kodesatuan").focus();
    return false;
  } else if (nama == "" || nama == 0) {
    swalAlert("Nama tidak boleh kosong", "error");
    $("#namasatuan").focus();
    return false;
  } else return true;
}

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

document.getElementById("find").addEventListener("click", function (event) {
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
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#kodesatuan").prop("disabled", true);
    $("#namasatuan").prop("disabled", true);
    $(".aktif").show();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchsatuan", async function () {
  $("#find_satuan").modal("hide");
  const kode = $(this).attr("data-id");
  await load_satuan(kode);
});

document.querySelector("#save").addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    if (!ValidasiSave()) return;
    const form_data = objectToFormData({
      kode: $("#kodesatuan").val().toUpperCase(),
      nama: $("#namasatuan").val().toUpperCase(),
    });
    const { error, message } = await post_data({
      url: "/satuan",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

document.querySelector("#update").addEventListener("click", async function (e) {
  try {
    e.preventDefault();
    if (!ValidasiSave()) return;
    const { error, message } = await put_data({
      url: "/satuan",
      body: JSON.stringify({
        kode: $("#kodesatuan").val().toUpperCase(),
        nama: $("#namasatuan").val().toUpperCase(),
        aktif: $("#aktif").prop("checked") ? "t" : "f",
      }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

document.querySelector("#clear").addEventListener("click", function () {
  ClearScreen();
});

ClearScreen();
