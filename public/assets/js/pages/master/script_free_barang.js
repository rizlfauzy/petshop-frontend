// barang
function require_get_barang(keyword, rows = "0") {
  const select_limit_barang = $("#select_limit_barang").val();
  const field = ["barcode", "nama", "kodesatuan", "kodemerk"];
  const table = "master/barang";
  const wheres = `kelompok IN ('K000000004', 'K000000003')`;
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

// barang bonus
function require_get_barang_bonus(keyword, rows = "0") {
  const select_limit_barang_bonus = $("#select_limit_barang_bonus").val();
  const field = ["barcode", "nama", "kodesatuan", "kodemerk"];
  const table = "master/barang";
  const wheres = `kelompok IN ('K000000004', 'K000000003')`;
  const likes = ["barcode", "nama"];
  const order_by = ["barcode desc"];
  const group = "tb_barang_bonus";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_barang_bonus", field.length + 1, false),
    select_limit: select_limit_barang_bonus,
    rows,
  };
}

async function other_tab_barang_bonus(offset) {
  try {
    const keyword = $("#input_barang_bonus").val();
    const conf_table = {
      element: "#tbody_barang_bonus",
      items: [],
      pagination: "",
      name_btn: "searchbarangbonus",
      fields: require_get_barang_bonus(keyword).field,
      tag_pagi: "#pagination_barang_bonus",
      colspan: this.name_btn == "" ? require_get_barang_bonus(keyword).field.length : require_get_barang_bonus(keyword).field.length + 1,
    };
    loading_spinner("#tbody_barang_bonus", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_barang_bonus(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_barang_bonus", require_get_barang_bonus(keyword).group, list.length, total_rows, "#pagination_barang_bonus", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// free barang stok
function require_get_free_barang(keyword, rows = "0") {
  const select_limit_free_barang = $("#select_limit_free_barang").val();
  const field = ["kode", "namafree"];
  const table = "master/freebarangstok";
  const wheres = {};
  const likes = ["kode", "namafree"];
  const order_by = ["kode desc"];
  const group = "tb_free_barang";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_free_barang", field.length + 1, false),
    select_limit: select_limit_free_barang,
    rows,
  };
}

async function other_tab_free_barang(offset) {
  try {
    const keyword = $("#input_free_barang").val();
    const conf_table = {
      element: "#tbody_free_barang",
      items: [],
      pagination: "",
      name_btn: "searchfree",
      fields: require_get_free_barang(keyword).field,
      tag_pagi: "#pagination_free_barang",
      colspan: this.name_btn == "" ? require_get_free_barang(keyword).field.length : require_get_free_barang(keyword).field.length + 1,
    };
    loading_spinner("#tbody_free_barang", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_free_barang(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_free_barang", require_get_free_barang(keyword).group, list.length, total_rows, "#pagination_free_barang", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function clear_screen() {
  $("#kodepromo").val("");
  $("#nama_free_barang").val("");
  $("#qty").val("");
  $("#aktif").prop("checked", true);
  $("#tidak_aktif").prop("checked", false);
  $("#barcode").val("");
  $("#nama_barang").val("");
  $("#barcode_bonus").val("");
  $("#nama_barang_bonus").val("");
  $("#qty_bonus").val("");

  $("#tb_header").html(empty_table(4));
  $("#tb_detail").html(empty_table(5));
  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
  $(".aktif").hide();
  resetLocalStorage("header");
  resetLocalStorage("detail");
  clearAllLocalStorage();
}

function validasi() {
  if (!$("#nama_free_barang").val()) {
    $("#nama_free_barang").focus();
    swalAlert("Nama Free barang tidak boleh kosong !!!", "error");
    return false;
  } else if (!$("#qty").val()) {
    $("#qty").focus();
    swalAlert("Qty tidak boleh kosong !!!", "error");
    return false;
  } else if (!getLocalStorage("header").length) {
    swalAlert("Header tidak boleh kosong !!!", "error");
    return false;
  } else if (!getLocalStorage("detail").length) {
    swalAlert("Detail tidak boleh kosong !!!", "error");
    return false;
  }
  return true;
}

function insert_barang(kode_pencarian, barcode, nama_barang) {
  return /*html*/`
      <tr id="header-${kode_pencarian}">
        <td></td>
        <td>${barcode}</td>
        <td>${nama_barang}</td>
        <td class="text-center" style="width: 200px;">
          <button type="button" class="btn btn-danger btn-sm delete_header" data-table="header-${kode_pencarian}">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
}

function insert_barang_bonus(kode_pencarian, barcode, nama_barang, qty) {
  return /*html*/`
      <tr id="detail-${kode_pencarian}">
        <td></td>
        <td>${barcode}</td>
        <td>${nama_barang}</td>
        <td>${qty}</td>
        <td class="text-center" style="width: 200px;">
          <button type="button" class="btn btn-danger btn-sm delete_detail" data-table="detail-${kode_pencarian}">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
}

function empty_table(colspan) {
  return /*html*/ `
    <tr>
      <td colspan="${colspan}" class="text-center">Inputkan data terlebih dahulu !!!</td>
    </tr>
  `;
}

// get barang
$("#input_barang").on("input", () => other_tab_barang(0));
$("#select_limit_barang").on("change", () => other_tab_barang(0));
$("#hapus_keyword_barang").click(() => {
  $("#input_barang").val("").focus();
  other_tab_barang(0);
});
$("#cari_barang").click(function (e) {
  e.preventDefault();
  $("#input_barang").val("").focus();
  $("#find_barang").modal("show");
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
    $("#add_barang").click();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get barang bonus
$("#input_barang_bonus").on("input", () => other_tab_barang_bonus(0));
$("#select_limit_barang_bonus").on("change", () => other_tab_barang_bonus(0));
$("#hapus_keyword_barang_bonus").click(() => {
  $("#input_barang_bonus").val("").focus();
  other_tab_barang_bonus(0);
});
$("#cari_barang_bonus").click(function (e) {
  e.preventDefault();
  $("#input_barang_bonus").val("").focus();
  $("#find_barang_bonus").modal("show");
  other_tab_barang_bonus(0);
});
$(".btn_close_barang_bonus").click(() => {
  $("#input_barang_bonus").val("").focus();
  $("#find_barang_bonus").modal("hide");
});
$("#find_barang_bonus").on("shown.bs.modal", function () {
  $("#input_barang_bonus").val("").focus();
});
$("#find_barang_bonus").on("hidden.bs.modal", function () {
  $("#input_barang_bonus").val("");
  $("#pagination_barang_bonus").html("");
});
$(document).on("click", ".searchbarangbonus", async function () {
  $("#find_barang_bonus").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const barcode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/barang/barcode?barcode=${barcode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#barcode_bonus").val(id);
    $("#nama_barang_bonus").val(data?.nama.trim());
    $("#qty_bonus").focus();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get free barang stok
$("#input_free_barang").on("input", () => other_tab_free_barang(0));
$("#select_limit_free_barang").on("change", () => other_tab_free_barang(0));
$("#hapus_keyword_free_barang").click(() => {
  $("#input_free_barang").val("").focus();
  other_tab_free_barang(0);
});
$("#find").click(function (e) {
  e.preventDefault();
  $("#input_free_barang").val("").focus();
  $("#find_free_barang").modal("show");
  other_tab_free_barang(0);
});
$(".btn_close_free_barang").click(() => {
  $("#input_free_barang").val("").focus();
  $("#find_free_barang").modal("hide");
});
$("#find_free_barang").on("shown.bs.modal", function () {
  $("#input_free_barang").val("").focus();
});
$("#find_free_barang").on("hidden.bs.modal", function () {
  $("#input_free_barang").val("");
  $("#pagination_free_barang").html("");
});
$(document).on("click", ".searchfree", async function () {
  $("#find_free_barang").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const kode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/free-barang-stok/find?kode=${kode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kodepromo").val(id);
    $("#nama_free_barang").val(data?.namafree.trim());
    $("#qty").val(data?.qty);
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    if (!data?.header) throw new Error("Data Header tidak ditemukan");
    if (!data?.detail) throw new Error("Data Detail tidak ditemukan");
    resetLocalStorage("header");
    resetLocalStorage("detail");
    const content_header = data?.header
      .map((item) => {
        const kode_pencarian = item.kodebarang.replace(/[^A-Z0-9]/gi, "");
        const item_save = { kode: kode_pencarian, kodebarang: item.kodebarang, namabarang: item.namabarang };
        saveLocalStorage("header", item_save, kode_pencarian);
        return insert_barang(kode_pencarian, item.kodebarang, item.namabarang);
      })
      .join("");
    $("#tb_header").html(content_header);
    const content_detail = data?.detail
      .map((item) => {
        const kode_pencarian = item.kodebarang.replace(/[^A-Z0-9]/gi, "");
        const item_save = { kode: kode_pencarian, kodebarang: item.kodebarang, namabarang: item.namabarang, qty: item.qty };
        saveLocalStorage("detail", item_save, kode_pencarian);
        return insert_barang_bonus(kode_pencarian, item.kodebarang, item.namabarang, item.qty);
      })
      .join("");
    $("#tb_detail").html(content_detail);

    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#kode").prop("disabled", true);
    $(".aktif").show();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// add header
$("#add_barang").click(async function () {
  try {
    const kodebarang = $("#barcode").val();
    const namabarang = $("#nama_barang").val();
    if (!kodebarang) return swalAlert("Barcode tidak boleh kosong !!!", "error");
    if (!namabarang) return swalAlert("Nama barang tidak boleh kosong !!!", "error");
    const form_data = objectToFormData({ barcode: kodebarang });
    const { error, message, data } = await post_data({
      url: "/free-barang-stok/cek-barcode",
      method: "POST",
      body: form_data,
    });
    if (error) throw new Error(message);
    if (data?.header) throw new Error(`Barcode sudah pernah diinput di kode ${data?.header?.kode} !!!`);
    if (data?.bundling_detail) throw new Error(`Barcode sudah pernah diinput di bundling kode ${data?.bundling_detail?.kode} !!!`);
    const kode_pencarian = kodebarang.replace(/[^A-Z0-9]/gi, "");
    saveLocalStorage("header", { kode: kode_pencarian, kodebarang, namabarang }, kode_pencarian);
    const headers = getLocalStorage("header");
    const content_header = headers.map((item) => insert_barang(item.kode, item.kodebarang, item.namabarang)).join("");
    $("#tb_header").html(content_header);
    $("#barcode").val("");
    $("#nama_barang").val("");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// delete header
$(document).on("click", ".delete_header", function () {
  const kode = $(this).attr("data-table");
  deleteLocalStorage("header", kode.split("-")[1]);
  $(`#${kode}`).remove();
  const headers = getLocalStorage("header");
  if (headers.length < 1) $("#tb_header").html(empty_table(4));
});

// add detail
$("#add_barang_bonus").click(async function () {
  try {
    const kodebarang = $("#barcode_bonus").val();
    const namabarang = $("#nama_barang_bonus").val();
    const qty = $("#qty_bonus").val();
    if (!kodebarang) throw new Error("Barcode tidak boleh kosong !!!");
    if (!namabarang) throw new Error("Nama barang tidak boleh kosong !!!");
    if (!qty) throw new Error("Qty tidak boleh kosong !!!");
    const form_data = objectToFormData({ barcode: kodebarang });
    const { error, message, data } = await post_data({
      url: "/stok",
      method: "POST",
      body: form_data,
    });
    if (error) throw new Error(message);
    if (!data?.stock) throw new Error("Stok barang tidak ada !!!");
    if (Number(qty) > Number(data?.stock)) throw new Error("Qty melebihi stok barang !!!");
    const kode_pencarian = kodebarang.replace(/[^A-Z0-9]/gi, "");
    saveLocalStorage("detail", { kode: kode_pencarian, kodebarang, namabarang, qty }, kode_pencarian);
    const details = getLocalStorage("detail");
    const content_detail = details
      .map((item) => insert_barang_bonus(item.kode, item.kodebarang, item.namabarang, item.qty))
      .join("");
    $("#tb_detail").html(content_detail);
    $("#barcode_bonus").val("");
    $("#nama_barang_bonus").val("");
    $("#qty_bonus").val("");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});
$("#qty_bonus").on("keypress", function (event) {
  if (this.value.length < 1) return;
  if (event.keyCode == 13) $("#add_barang_bonus").click();
});

// delete detail
$(document).on("click", ".delete_detail", function () {
  const kode = $(this).attr("data-table");
  deleteLocalStorage("detail", kode.split('-')[1]);
  $(`#${kode}`).remove();
  const details = getLocalStorage("detail");
  if (details.length < 1) $("#tb_detail").html(empty_table(5));
});

// save
$("#save").click(async function () {
  try {
    const namafree = $("#nama_free_barang").val();
    const qty = $("#qty").val();
    if (!validasi()) return;
    const form_data = objectToFormData({
      namafree,
      qty,
      header: JSON.stringify(getLocalStorage("header")),
      detail: JSON.stringify(getLocalStorage("detail")),
    });
    const { error, message } = await post_data({
      url: "/free-barang-stok",
      method: "POST",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    clear_screen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// update
$("#update").click(async function () {
  try {
    const kodepromo = $("#kodepromo").val();
    const namafree = $("#nama_free_barang").val();
    const qty = $("#qty").val();
    const aktif = $("input[name='aktif']:checked").val();
    if (!validasi()) return;
    const { error, message } = await put_data({
      url: "/free-barang-stok",
      body: JSON.stringify({
        kodepromo,
        namafree,
        qty,
        aktif,
        header: JSON.stringify(getLocalStorage("header")),
        detail: JSON.stringify(getLocalStorage("detail")),
      })
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#clear").click(clear_screen);

clear_screen();
