// barang
function require_get_barang(keyword, rows = "0") {
  const select_limit_barang = $("#select_limit_barang").val();
  const field = ["barcode", "nama"];
  const table = "master/barang";
  const wheres = `aktif = 't'`;
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

// toko
function require_get_toko(keyword, rows = "0") {
  const select_limit_toko = $("#select_limit_toko").val();
  const field = ["kode", "nama"];
  const table = "master/toko";
  const wheres = `aktif = 't'`;
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
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
      name_btn: "searchtoko",
      fields: require_get_toko(keyword).field,
      tag_pagi: "#pagination_toko",
      colspan: this.name_btn == "" ? require_get_toko(keyword).field.length : require_get_toko(keyword).field.length + 1,
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

// level diskon
function require_get_level(keyword, rows = "0") {
  const select_limit_level = $("#select_limit_level").val();
  const field = ["kode", "kodebarang", "namabarang", "diskon", "jumlah_maks_qty", "aktif"];
  const table = "master/leveldiskon";
  const wheres = {
    kodecabang: $("#cabang").val(),
  };
  const likes = ["kode", "kodebarang", "namabarang"];
  const order_by = ["kode desc"];
  const group = "tb_level";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_level", field.length + 1, false),
    select_limit: select_limit_level,
    rows,
  };
}

async function other_tab_level(offset) {
  try {
    const keyword = $("#input_level").val();
    const conf_table = {
      element: "#tbody_level",
      items: [],
      pagination: "",
      name_btn: "searchdiskon",
      fields: require_get_level(keyword).field,
      tag_pagi: "#pagination_level",
      colspan: this.name_btn == "" ? require_get_level(keyword).field.length : require_get_level(keyword).field.length + 1,
      3: (item) => item.diskon + "%",
      4: item => FormatRupiah(item.jumlah_maks_qty),
      5: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
    };
    loading_spinner("#tbody_level", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_level(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_level", require_get_level(keyword).group, list.length, total_rows, "#pagination_level", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen() {
  $("#kode").val("");
  $("#barcode").val("");
  $("#nama_barang").val("");
  $("#kode_toko").val($("#cabang").val());
  $("#diskon").val("0%");
  $("#jumlah_maks_qty").val("");
  $("#aktif").prop("checked", true);
  $(".aktif").hide();
  other_tab_level(0);

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi() {
  if ($("#barcode").val() == "") {
    $("#barcode").focus();
    swalAlert("Barcode harus diisi", "error");
    return false;
  } else if ($("#nama_barang").val() == "") {
    $("#nama_barang").focus();
    swalAlert("Nama barang harus diisi", "error");
    return false;
  } else if ($("#kode_toko").val() == "") {
    $("#kode_toko").focus();
    swalAlert("Kode toko harus diisi", "error");
    return false;
  } else if ($("#diskon").val() == "") {
    $("#diskon").focus();
    swalAlert("Diskon harus diisi", "error");
    return false;
  } else if ($("#jumlah_maks_qty").val() == "") {
    $("#jumlah_maks_qty").focus();
    swalAlert("Jumlah maks qty harus diisi", "error");
    return false;
  } else return true;
}

// get barang
$("#input_barang").on("input", other_tab_barang.bind(this, 0));
$("#select_limit_barang").on("change", other_tab_barang.bind(this, 0));
$("#hapus_keyword_barang").on("click", function () {
  $("#input_barang").val("").focus();
  other_tab_barang(0);
});
$("#cari_barang").click(function () {
  $("#find_barang").modal("show");
  $("#input_barang").focus().val("");
  other_tab_barang(0);
})
$(".btn_close_barang").click(() => {
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
$(document).on("click", ".searchbarang", async function () {
  $("#find_barang").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const barcode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/barang/barcode?barcode=${barcode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#barcode").val(id);
    $("#nama_barang").val(data?.nama.trim());
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get toko
$("#input_toko").on("input", other_tab_toko.bind(this, 0));
$("#select_limit_toko").on("change", other_tab_toko.bind(this, 0));
$("#hapus_keyword_toko").on("click", function () {
  $("#input_toko").val("").focus();
  other_tab_toko(0);
});
$("#cari_toko").click(function () {
  $("#find_toko").modal("show");
  $("#input_toko").focus().val("");
  other_tab_toko(0);
})
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
$(document).on("click", ".searchtoko", async function () {
  $("#find_toko").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const { error, message, data } = await post_data({
      url: `/toko?kode=${id}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode_toko").val(id);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get level diskon
$("#input_level").on("input", other_tab_level.bind(this, 0));
$("#select_limit_level").on("change", other_tab_level.bind(this, 0));
$("#hapus_keyword_level").on("click", function () {
  $("#input_level").val("").focus();
  other_tab_level(0);
});
$(document).on("click", ".searchdiskon", async function () {
  try {
    const id = $(this).data("id");
    const kode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/level-diskon/find?kode=${kode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(data.kode);
    $("#barcode").val(data.kodebarang);
    $("#nama_barang").val(data.namabarang);
    $("#kode_toko").val(data.kodecabang);
    $("#diskon").val(data.diskon + "%");
    $("#jumlah_maks_qty").val(FormatRupiah(data?.jumlah_maks_qty));
    $(data.aktif == "t" ? "#aktif" : "#tidak_aktif").prop("checked", true);
    $(".aktif").show();
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})

$("#diskon").mask("99.99%", {
  reverse: true,
});

$("#jumlah_maks_qty").keypress(function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13) $("#save").click();
})

// save button
$("#save").click(async function () {
  if (!validasi()) return;
  try {
    const form_data = objectToFormData({
      kodebarang: $("#barcode").val(),
      namabarang: $("#nama_barang").val(),
      kodecabang: $("#kode_toko").val(),
      diskon: $("#diskon").val(),
      jumlah_maks_qty: DeFormatRupiah($("#jumlah_maks_qty").val()),
    });
    const { error, message } = await post_data({
      url: "/level-diskon",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    clear_screen();
    other_tab_level(0);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// update button
$("#update").click(async function () {
  if (!validasi()) return;
  try {
    const { error, message, kode } = await put_data({
      url: "/level-diskon",
      body: JSON.stringify({
        kode: $("#kode").val(),
        kodebarang: $("#barcode").val(),
        namabarang: $("#nama_barang").val(),
        kodecabang: $("#kode_toko").val(),
        diskon: $("#diskon").val(),
        aktif: $("input[name='aktif']:checked").val(),
        jumlah_maks_qty: DeFormatRupiah($("#jumlah_maks_qty").val()),
      }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    $("#kode").val(kode);
    other_tab_level(0);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// clear button
$("#clear").click(clear_screen);

clear_screen();