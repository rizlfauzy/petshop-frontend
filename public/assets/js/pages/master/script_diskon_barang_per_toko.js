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

// diskon barang per toko
function require_get_diskon(keyword, rows = "0") {
  const select_limit_diskon = $("#select_limit_diskon").val();
  const field = ["kode_disc", "barcode", "namabarang", "diskon", "aktif"];
  const table = "master/disctoko";
  const wheres = {
    kodetoko: $("#cabang").val(),
  };
  const likes = ["kode_disc", "barcode", "namabarang"];
  const order_by = ["kode_disc desc"];
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
      name_btn: "searchdiskon",
      fields: require_get_diskon(keyword).field,
      tag_pagi: "#pagination_diskon",
      colspan: this.name_btn == "" ? require_get_diskon(keyword).field.length : require_get_diskon(keyword).field.length + 1,
      3: (item) => item.diskon + "%",
      4: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
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
  $("#kode_disc").val("");
  $("#diskon").val("0%");
  $("#barcode").val("");
  $("#nama_barang").val("");
  $("#cari_barang").focus();
  $("#aktif").prop("checked", true);
  $(".aktif").hide();
  $("#keterangan").val("");

  other_tab_diskon(0);

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi() {
  if (!$("#diskon").val()) {
    $("#diskon").focus();
    swalAlert("Diskon harus diisi", "error");
    return false;
  } else if (!$("#barcode").val()) {
    $("#cari_barang").focus();
    swalAlert("Barcode harus diisi", "error");
    return false;
  } else if (!$("#nama_barang").val()) {
    $("#cari_barang").focus();
    swalAlert("Nama barang harus diisi", "error");
    return false;
  } else return true;
}

// get data barang
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
});
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
    if ($("#diskon").val() == "0%") $("#diskon").focus();
    else $("#keterangan").focus();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get data diskon
$("#input_diskon").on("input", other_tab_diskon.bind(this, 0));
$("#select_limit_diskon").on("change", other_tab_diskon.bind(this, 0));
$("#hapus_keyword_diskon").on("click", function () {
  $("#input_diskon").val("").focus();
  other_tab_diskon(0);
});
$(document).on("click", ".searchdiskon", async function () {
  try {
    const id = $(this).attr("data-id");
    const kode_disc = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/disc-toko/find?kode=${kode_disc}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode_disc").val(id);
    $("#diskon").val(data.diskon + "%");
    $("#barcode").val(data.barcode);
    $("#nama_barang").val(data.namabarang);
    $("#keterangan").val(data.keterangan);
    $(data?.aktif == 't' ? "#aktif" : "#tidak_aktif").prop("checked", true);
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

$("#diskon").keypress(function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13 && $("#kode_disc").val() == ""){
    if ($("#keterangan").val() == "") $("#keterangan").focus();
    else $("#save").click();
  } else if (e.keyCode == 13 && $("#kode_disc").val() != '') {
    if ($("#keterangan").val() == "") $("#keterangan").focus();
    else $("#update").click();
  }
})

$("#keterangan").keypress(function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13 && $("#kode_disc").val() == "") {
    if ($("#diskon").val() == "0%") $("#diskon").focus();
    else $("#save").click();
  } else if (e.keyCode == 13 && $("#kode_disc").val() != "") {
    if ($("#diskon").val() == "0%") $("#diskon").focus();
    else $("#update").click();
  };
})

// btn save
$("#save").on("click", async function () {
  if (!validasi()) return;
  try {
    const form_data = objectToFormData({
      barcode: $("#barcode").val(),
      namabarang: $("#nama_barang").val(),
      diskon: $("#diskon").cleanVal(),
      keterangan: $("#keterangan").val(),
    });
    const { error, message } = await post_data({
      url: "/disc-toko",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    clear_screen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// btn update
$("#update").on("click", async function () {
  if (!validasi()) return;
  try {
    const { error, message } = await put_data({
      url: "/disc-toko",
      body: JSON.stringify({
        kode_disc: $("#kode_disc").val(),
        barcode: $("#barcode").val(),
        namabarang: $("#nama_barang").val(),
        diskon: $("#diskon").cleanVal(),
        keterangan: $("#keterangan").val(),
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
$("#clear").on("click", clear_screen);

clear_screen();