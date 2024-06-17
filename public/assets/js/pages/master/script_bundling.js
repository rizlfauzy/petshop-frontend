// barang
function require_get_barang(keyword, rows = "0") {
  const select_limit_barang = $("#select_limit_barang").val();
  const field = ["barcode", "nama", "kodesatuan", "kodemerk"];
  const table = "master/barang";
  const wheres = {};
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

// bundling
function require_get_bundling(keyword, rows = "0") {
  const select_limit_bundling = $("#select_limit_bundling").val();
  const field = ["kode", "namafree"];
  const table = "master/bundling";
  const wheres = {};
  const likes = ["kode", "namafree"];
  const order_by = ["kode desc"];
  const group = "tb_bundling";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_bundling", field.length + 1, false),
    select_limit: select_limit_bundling,
    rows,
  };
}

async function other_tab_bundling(offset) {
  try {
    const keyword = $("#input_bundling").val();
    const conf_table = {
      element: "#tbody_bundling",
      items: [],
      pagination: "",
      name_btn: "searchbundling",
      fields: require_get_bundling(keyword).field,
      tag_pagi: "#pagination_bundling",
      colspan: this.name_btn == "" ? require_get_bundling(keyword).field.length : require_get_bundling(keyword).field.length + 1,
    };
    loading_spinner("#tbody_bundling", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_bundling(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_bundling", require_get_bundling(keyword).group, list.length, total_rows, "#pagination_bundling", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen() {
  $("#barcode").val("");
  $("#nama_barang").val("");
  $("#minqty").val("");
  $("#kode").val("");
  $("#nama_bundling").val("");
  $("#harga").val("");
  $("#cari_barang").focus();
  $("#tb_detail").html(empty_table(4));

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);

  $(".aktif").hide();
  resetLocalStorage("barang");
  clearAllLocalStorage();
}

// validasi
function validasi() {
  if (!$("#nama_bundling").val()) {
    $("#nama_bundling").focus();
    swalAlert("Nama bundling tidak boleh kosong !!!", "error");
    return false;
  } else if (!$("#harga").val()) {
    $("#harga").focus();
    swalAlert("Harga bundling tidak boleh kosong !!!", "error");
    return false;
  } else if (!$("#minqty").val()) {
    $("#minqty").focus();
    swalAlert("Minimal qty tidak boleh kosong !!!", "error");
    return false;
  } else if (!getLocalStorage("barang").length) {
    $("#cari_barang").focus();
    swalAlert("Data Barang tidak boleh kosong !!!", "error");
    return false;
  } else return true;
}

function empty_table(colspan) {
  return /*html*/ `
    <tr>
      <td colspan="${colspan}" class="text-center">Inputkan data terlebih dahulu !!!</td>
    </tr>
  `;
}

function insert_barang(kode_pencarian, barcode, nama_barang) {
  return /*html*/ `
      <tr id="barang-${kode_pencarian}">
        <td></td>
        <td>${barcode}</td>
        <td>${nama_barang}</td>
        <td class="text-center" style="width: 200px;">
          <button type="button" class="btn btn-danger btn-sm delete_barang" data-table="barang-${kode_pencarian}">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
}

// get data barang
$("#input_barang").on("input", other_tab_barang.bind(this, 0));
$("#select_limit_barang").on("change", other_tab_barang.bind(this, 0));
$("#hapus_keyword_barang").on("click", function () {
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

// get bundling
$("#input_bundling").on("input", other_tab_bundling.bind(this, 0));
$("#select_limit_bundling").on("change", other_tab_bundling.bind(this, 0));
$("#hapus_keyword_bundling").on("click", function () {
  $("#input_bundling").val("").focus();
  other_tab_bundling(0);
});
$("#find").click(function (e) {
  e.preventDefault();
  $("#input_bundling").val("").focus();
  $("#find_bundling").modal("show");
  other_tab_bundling(0);
});
$(".btn_close_bundling").click(() => {
  $("#input_bundling").val("").focus();
  $("#find_bundling").modal("hide");
});
$("#find_bundling").on("shown.bs.modal", function () {
  $("#input_bundling").val("").focus();
});
$("#find_bundling").on("hidden.bs.modal", function () {
  $("#input_bundling").val("");
  $("#pagination_bundling").html("");
});
$(document).on("click", ".searchbundling", async function () {
  $("#find_bundling").modal("hide");
  try {
    const id = $(this).attr("data-id");
    const kode = encodeURIComponent(btoa(id));
    const { error, message, data } = await post_data({
      url: `/bundling/find?kode=${kode}`,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(id);
    $("#nama_bundling").val(data?.namafree.trim());
    $("#harga").val(FormatRupiah(data?.harga_bulat));
    $("#minqty").val(data?.minorder);
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $(".aktif").show();
    if (!data?.detail) throw new Error("Data barang tidak ditemukan !!!");
    resetLocalStorage("barang");
    const content_barang = data?.detail
      .map((item) => {
        const kode_pencarian = item.kodebarang.replace(/[^A-Z0-9]/gi, "");
        const item_barang = { kode: kode_pencarian, barcode: item.kodebarang, nama: item.namabarang };
        saveLocalStorage("barang", item_barang, kode_pencarian);
        return insert_barang(kode_pencarian, item.kodebarang, item.namabarang);
      })
      .join("");
    $("#tb_detail").html(content_barang);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// add barang
$("#add_barang").click(async function (e) {
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
    saveLocalStorage("barang", { kode: kode_pencarian, barcode: kodebarang,nama:  namabarang }, kode_pencarian);
    const goods = getLocalStorage("barang");
    const content_barang = goods.map((item) => insert_barang(item.kode, item.barcode, item.nama)).join("");
    $("#tb_detail").html(content_barang);
    $("#barcode").val("");
    $("#nama_barang").val("");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// delete barang
$(document).on("click", ".delete_barang", function () {
  const kode = $(this).data("table");
  deleteLocalStorage("barang", kode.split("-")[1]);
  $(`#${kode}`).remove();
  const goods = getLocalStorage("barang");
  if (goods.length == 0) $("#tb_detail").html(empty_table(4));
});

// save
$("#save").click(async function () {
  try {
    if (!validasi()) return;
    const form_data = objectToFormData({
      namafree: $("#nama_bundling").val(),
      harga_bulat: $("#harga").val(),
      minorder: $("#minqty").val(),
      detail: JSON.stringify(getLocalStorage("barang")),
    });
    const { error, message } = await post_data({
      url: "/bundling",
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
    if (!validasi()) return;
    const { error, message } = await put_data({
      url: "/bundling",
      body: JSON.stringify({
        kode: $("#kode").val(),
        namafree: $("#nama_bundling").val(),
        harga_bulat: $("#harga").val(),
        minorder: $("#minqty").val(),
        detail: getLocalStorage("barang"),
        aktif: $("input[name='aktif']:checked").val(),
      }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// clear
$("#clear").click(clear_screen);

clear_screen();
