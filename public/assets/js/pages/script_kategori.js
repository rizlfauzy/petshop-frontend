// kategori
function require_get_kategori(keyword, rows = "0") {
  const select_limit_kategori = $("#select_limit_kategori").val();
  const field = ["kode", "nama", "aktif"];
  const table = "Master/Kategori";
  const wheres = {};
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
      2: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
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

function ClearScreen() {
  $("#kodekategori").val("");
  $("#namakategori").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);
  $("#tidak_aqua").prop("checked", true);

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);

  $(".aktif").hide();
}

function ValidasiSave() {
  const nama = $("#namakategori").val();

  if (nama == "" || nama == 0) {
    swalAlert("Nama tidak boleh kosong.", "error");
    $("#namakategori").focus();
    return false;
  } else return true;
}

$("#namakategori").keyup(function (e) {
  const val = $(this).val();
  if (val.length > 0 && e.keyCode == 13) $("#save").click();
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

document.getElementById("find").addEventListener("click", function (event) {
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
    if (error) throw new Error(message);
    $("#kodekategori").val(kode);
    $("#namakategori").val(data?.nama);
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    if (data?.is_aqua == "t") $("#yes_aqua").prop("checked", true);
    else $("#tidak_aqua").prop("checked", true);
    $("#update").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#find_kategori").modal("hide");
    $(".aktif").show();
    $("#kodekategori").prop("disabled", true);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchkategori", async function () {
  $("#find_kategori").modal("hide");
  const kode = $(this).attr("data-id");
  await load_kategori(kode);
});

$("#save").click(async function () {
  try {
    if (!ValidasiSave()) return;
    const nama = $("#namakategori").val();
    const is_aqua = $('input[name="aqua"]:checked').val();

    const form_data = objectToFormData({
      nama,
      is_aqua,
    });
    const { error, message } = await post_data({
      url: "/kategori",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#update").click(async function () {
  try {
    if (!ValidasiSave()) return;
    const kode = $("#kodekategori").val();
    const nama = $("#namakategori").val();
    const aktif = $('input[name="aktif"]:checked').val();
    const is_aqua = $('input[name="aqua"]:checked').val();

    const { error, message } = await put_data({
      url: "/kategori",
      body: JSON.stringify({
        kode,
        nama,
        aktif,
        is_aqua,
      }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#clear").click(function () {
  ClearScreen();
});

ClearScreen();
