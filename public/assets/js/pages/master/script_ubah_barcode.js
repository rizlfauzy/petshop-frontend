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

// hist ubah barcode
function require_get_hist(keyword, rows = "0") {
  const select_limit_hist = $("#select_limit_hist").val();
  const field = ["kode","barcode_prev", "namabarang_prev", "barcode_next", "namabarang_next", "pemakai", "tglsimpan"];
  const table = "hist/ubahbarcode";
  const wheres = {};
  const likes = ["kode", "barcode_prev", "namabarang_prev"];
  const order_by = ["kode desc"];
  const group = "tb_hist";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_hist", field.length + 1, false),
    select_limit: select_limit_hist,
    rows,
  };
}

async function other_tab_hist(offset) {
  try {
    const keyword = $("#input_hist").val();
    const conf_table = {
      element: "#tbody_hist",
      items: [],
      pagination: "",
      name_btn: "search_hist",
      fields: require_get_hist(keyword).field,
      tag_pagi: "#pagination_hist",
      colspan: this.name_btn == "" ? require_get_hist(keyword).field.length : require_get_hist(keyword).field.length + 1,
      6: item => moment(item.tglsimpan).format("DD-MM-YYYY HH:mm:ss"),
    };
    loading_spinner("#tbody_hist", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_hist(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_hist", require_get_hist(keyword).group, list.length, total_rows, "#pagination_hist", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen() {
  $("#kode").val("");
  $("#barcode_lama").val("");
  $("#nama_barang_lama").val("");
  $("#barcode").val("");
  $("#nama_barang").val("");

  $("#save").prop("disabled", false);
}

// validasi
function validasi() {
  if (!$("#barcode_lama").val()) {
    $("#cari_barang").focus();
    swalAlert("Barcode lama harus diisi", "error");
    return false;
  } else if (!$("#nama_barang_lama").val()) {
    $("#cari_barang").focus();
    swalAlert("Nama barang lama harus diisi", "error");
    return false;
  } else if (!$("#barcode").val()) {
    $("#barcode").focus();
    swalAlert("Barcode baru harus diisi", "error");
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
    $("#barcode_lama").val(id);
    $("#nama_barang_lama").val(data?.nama.trim());
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get hist
$("#input_hist").on("input", other_tab_hist.bind(this, 0));
$("#select_limit_hist").on("change", other_tab_hist.bind(this, 0));
$("#hapus_keyword_hist").on("click", function () {
  $("#input_hist").val("").focus();
  other_tab_hist(0);
});
$("#find").click(function () {
  $("#find_hist").modal("show");
  $("#input_hist").focus().val("");
  other_tab_hist(0);
});
$(".btn_close_hist").click(() => {
  $("#input_hist").val("").focus();
  $("#find_hist").modal("hide");
});
$("#find_hist").on("shown.bs.modal", function () {
  $("#input_hist").val("").focus();
});
$("#find_hist").on("hidden.bs.modal", function () {
  $("#input_hist").val("");
  $("#pagination_hist").html("");
});
$(document).on("click", ".search_hist", async function () {
  $("#find_hist").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const kode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/barang/change/find?kode=${kode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(id);
    $("#barcode_lama").val(data?.barcode_prev.trim());
    $("#nama_barang_lama").val(data?.namabarang_prev.trim());
    $("#barcode").val(data?.barcode_next.trim());
    $("#nama_barang").val(data?.namabarang_next.trim());
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// btn save
$("#save").on("click", async function () {
  if (!validasi()) return;
  try {
    const barcode_lama = $("#barcode_lama").val();
    const barcode = $("#barcode").val();
    const { error, message } = await post_data({
      url: "/barang/change",
      method: "POST",
      body: objectToFormData({ barcode_lama, barcode, nama_barang_lama: $("#nama_barang_lama").val(), nama_barang: $("#nama_barang").val()}),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    clear_screen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// btn clear
$("#clear").on("click", clear_screen);

clear_screen();