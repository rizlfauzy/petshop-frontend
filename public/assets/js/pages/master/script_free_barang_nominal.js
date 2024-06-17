// barang bonus
function require_get_barang_bonus(keyword, rows = "0") {
  const select_limit_barang_bonus = $("#select_limit_barang_bonus").val();
  const field = ["barcode", "nama", "kodesatuan", "kodemerk"];
  const table = "views/carimasterbarang";
  const wheres = `kelompok IN ('K000000004', 'K000000003') and kodeharga = '${$("#kode_harga").val()}'`;
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

// free barang nominal
function require_get_free_barang(keyword, rows = "0") {
  const select_limit_free_barang = $("#select_limit_free_barang").val();
  const field = ["kode", "namafree"];
  const table = "master/freebarangnominal";
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
  $("#namafree").val("");
  $("#aktif").prop("checked", true);
  $("#kelipatan").prop("checked", true);
  $("#barcode_bonus").val("");
  $("#nama_barang_bonus").val("");
  $("#qty_bonus").val("");
  $("#minorder").val("");
  $("#tb_detail").html(empty_table(5));
  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
  $(".aktif").hide();
  resetLocalStorage("detail");
  clearAllLocalStorage();
}

function validasi() {
  if (!$("#namafree").val()) {
    $("#namafree").focus();
    swalAlert("Nama free barang tidak boleh kosong !!!", "error");
    return false;
  } else if (!getLocalStorage("detail").length) {
    swalAlert("Barang bonus tidak boleh kosong !!!", "error");
    return false;
  } else if (!$("#minorder").val()) {
    $("#minorder").focus();
    swalAlert("Min order tidak boleh kosong !!!", "error");
    return false;
  } else return true;
}

function insert_barang_bonus(kode_pencarian, barcode, nama_barang, qty) {
  return /*html*/ `
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

// get free barang nominal
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
      url: `/free-barang-nominal/find?kode=${kode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    if (!data?.detail) throw new Error("Barang bonus tidak ditemukan !!!");
    resetLocalStorage("detail");
    $("#kodepromo").val(id);
    $("#namafree").val(data?.namafree.trim());
    $("#minorder").val(FormatRupiah(data?.minorder.trim()));
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    if (data?.kelipatan == "t") $("#kelipatan").prop("checked", true);
    else $("#tidak_kelipatan").prop("checked", true);
    const content_detail = data?.detail.map((x) => {
      const kode_pencarian = x.kodebarang.replace(/[^A-Z0-9]/gi, "");
      const item_save = { kode: kode_pencarian, barcode: x.kodebarang, nama: x.namabarang, qty: x.qty };
      saveLocalStorage("detail", item_save);
      return insert_barang_bonus(kode_pencarian, x.kodebarang, x.namabarang, x.qty);
    }).join("");
    $("#tb_detail").html(content_detail);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#kode").prop("disabled", true);
    $(".aktif").show();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// add barang bonus
$("#add_barang_bonus").click(async function (e) {
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
    const item_save = { kode: kode_pencarian, barcode: kodebarang, nama: namabarang, qty };
    saveLocalStorage("detail", item_save);
    const details = getLocalStorage("detail");
    const content_detail = details.map((x) => insert_barang_bonus(x.kode, x.barcode, x.nama, x.qty)).join("");
    $("#tb_detail").html(content_detail);
    $("#barcode_bonus").val("");
    $("#nama_barang_bonus").val("");
    $("#qty_bonus").val("");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})
$("#qty_bonus").on("keypress", function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13) $("#add_barang_bonus").click();
});

// delete detail
$(document).on("click", ".delete_detail", function () {
  const kode = $(this).attr("data-table");
  deleteLocalStorage("detail", kode.split('-')[1]);
  $(`#${kode}`).remove();
  const details = getLocalStorage("detail");
  if (details.length < 1) $("#tb_detail").html(empty_table(5));
});

// save free barang nominal
$("#save").click(async function (e) {
  try {
    if (!validasi()) return;
    const namafree = $("#namafree").val();
    const kelipatan = $("input[name='kelipatan']:checked").val();
    const details = getLocalStorage("detail");
    const minorder = $("#minorder").val();
    const form_data = objectToFormData({ namafree, kelipatan, minorder, detail: JSON.stringify(details) });
    const { error, message } = await post_data({
      url: "/free-barang-nominal",
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
$("#update").click(async function (e) {
  try {
    if (!validasi()) return;
    const kodepromo = $("#kodepromo").val();
    const namafree = $("#namafree").val();
    const kelipatan = $("input[name='kelipatan']:checked").val();
    const details = getLocalStorage("detail");
    const minorder = $("#minorder").val();
    const aktif = $("input[name='aktif']:checked").val();
    const { error, message } = await put_data({
      url: `/free-barang-nominal`,
      body: JSON.stringify({ kode: kodepromo, aktif, namafree, kelipatan, minorder, detail: JSON.stringify(details) }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#clear").click(clear_screen);

clear_screen();