// kategori
function require_get_kategori(keyword, rows = "0") {
  const select_limit_kategori = $("#select_limit_kategori").val();
  const field = ["kode", "nama"];
  const table = "master/kategori";
  const wheres = `aktif = 't'`;
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
      name_btn: "select_kategori",
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

// diskon kategori
function require_get_diskon(keyword, rows = "0") {
  const select_limit_diskon = $("#select_limit_diskon").val();
  const field = ["kodemerk", "namamerk", "diskon", "aktif"];
  const table = "master/disckategori";
  const wheres = {};
  const likes = ["kodemerk", "namamerk"];
  const order_by = ["kodemerk desc"];
  const group = "tb_diskon";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_diskon", field.length + 1, false),
    select_limit: select_limit_diskon,
    rows,
  };
}

async function other_tab_diskon(offset) {
  try {
    const keyword = $("#input_diskon").val();
    const conf_table = {
      element: "#tbody_diskon",
      items: [],
      pagination: "",
      name_btn: "select_diskon",
      fields: require_get_diskon(keyword).field,
      tag_pagi: "#pagination_diskon",
      colspan: this.name_btn == "" ? require_get_diskon(keyword).field.length : require_get_diskon(keyword).field.length + 1,
      2: (item) => item.diskon + "%",
      3: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_diskon", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_diskon(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_diskon", require_get_diskon(keyword).group, list.length, total_rows, "#pagination_diskon", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen() {
  $("#kode").val("");
  $("#old_kode").val("");
  $("#nama").val("");
  $("#diskon").val("0%");
  $("#aktif").prop("checked", true);
  $(".aktif").hide();

  other_tab_diskon(0);

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi() {
  if ($("#kode").val() == "") {
    $("#cari_kategori").focus();
    swalAlert("Kode Merk tidak boleh kosong", "error");
    return false;
  } else if ($("#nama").val() == "") {
    $("#cari_kategori").focus();
    swalAlert("Nama Merk tidak boleh kosong", "error");
    return false;
  } else if ($("#diskon").val() == "") {
    $("#diskon").focus();
    swalAlert("Diskon tidak boleh kosong", "error");
    return false;
  } else return true;
}

// get kategori
$("#input_kategori").on("input", other_tab_kategori.bind(this, 0));
$("#select_limit_kategori").on("change", other_tab_kategori.bind(this, 0));
$("#hapus_keyword_kategori").on("click", function () {
  $("#input_kategori").val("").focus();
  other_tab_kategori(0);
});
$("#cari_kategori").click(function () {
  $("#find_kategori").modal("show");
  $("#input_kategori").val("").focus();
  other_tab_kategori(0);
});
$(".btn_close_kategori").click(() => {
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
$(document).on("click", ".select_kategori", function () {
  $("#find_kategori").modal("hide");
  try {
    const kode = $(this).data("id");
    const kategori = this.parentElement.parentElement;
    const nama = kategori.cells[2].innerText;
    $("#kode").val(kode);
    $("#nama").val(nama);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get diskon
$("#input_diskon").on("input", other_tab_diskon.bind(this, 0));
$("#select_limit_diskon").on("change", other_tab_diskon.bind(this, 0));
$("#hapus_keyword_diskon").on("click", function () {
  $("#input_diskon").val("").focus();
  other_tab_diskon(0);
});
$(document).on("click", ".select_diskon", function () {
  try {
    const disc_kategori = this.parentElement.parentElement;
    const kode = disc_kategori.cells[1].innerText;
    const nama = disc_kategori.cells[2].innerText;
    const diskon = disc_kategori.cells[3].innerText;
    const aktif = disc_kategori.cells[4].innerText;
    $("#kode").val(kode);
    $("#old_kode").val(kode);
    $("#nama").val(nama);
    $("#diskon").val(diskon);
    $(aktif == "AKTIF" ? "#aktif" : "#tidak_aktif").prop("checked", true);
    $(".aktif").show();
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#diskon").mask("99.99%", {
  reverse: true,
});

// btn save
$("#save").click(async function () {
  try {
    if (!validasi()) return;
    const form_data = objectToFormData({
      kode: $("#kode").val(),
      nama: $("#nama").val(),
      diskon: $("#diskon").val().replace("%", ""),
    });
    const { error, message } = await post_data({
      url: "/disc-kategori",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    clear_screen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});
$("#diskon").keypress(function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13) $("#save").click();
  if (e.keyCode == 13 && $("#kode").val() != '') $("#update").click();
})

// btn update
$("#update").click(async function () {
  try {
    if (!validasi()) return;
    const { error, message } = await put_data({
      url: "/disc-kategori",
      body: JSON.stringify({
        kode: $("#kode").val(),
        old_kode: $("#old_kode").val(),
        nama: $("#nama").val(),
        diskon: $("#diskon").val().replace("%", ""),
        aktif: $("input[name='aktif']:checked").val(),
      }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    other_tab_diskon(0);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// btn clear
$("#clear").click(clear_screen);

clear_screen();
