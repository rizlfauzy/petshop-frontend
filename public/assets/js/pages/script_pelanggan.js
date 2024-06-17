const cari_kodepos = document.getElementById("carikodepos");
const form_import = document.getElementById("form_import");
const drop_area = document.getElementById("drop-area");

// kode pos
function require_get_kodepos(keyword, rows = "0") {
  const select_limit_kodepos = $("#select_limit_kodepos").val();
  const field = ["kode", "kota", "kecamatan", "kelurahan"];
  const table = "Master/Kodepos";
  const wheres = { aktif: "t" };
  const likes = ["kode", "kota", "kecamatan", "kelurahan"];
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

// grup pelanggan
function require_get_grup(keyword, rows = "0") {
  const select_limit_grup = $("#select_limit_grup").val();
  const field = ["kode", "nama"];
  const table = "Master/Grupcustomer";
  const wheres = { aktif: "t" };
  const likes = ["kode", "nama"];
  const order_by = ["kode asc"];
  const group = "tb_grup";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_grup", field.length + 1, false),
    select_limit: select_limit_grup,
    rows,
  };
}

async function other_tab_grup(offset) {
  try {
    const keyword = $("#input_grup").val();
    const conf_table = {
      element: "#tbody_grup",
      items: [],
      pagination: "",
      name_btn: "searchgrupcustomer",
      fields: require_get_grup(keyword).field,
      tag_pagi: "#pagination_grup",
      colspan: this.name_btn == "" ? require_get_grup(keyword).field.length : require_get_grup(keyword).field.length + 1,
    };
    loading_spinner("#tbody_grup", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_grup(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_grup", require_get_grup(keyword).group, list.length, total_rows, "#pagination_grup", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// pelanggan
function require_get_pelanggan(keyword, rows = "0") {
  const select_limit_pelanggan = $("#select_limit_pelanggan").val();
  const field = ["kode", "nama", "nama_toko", "alamat", "notlp1"];
  const table = "Master/Customer";
  const wheres = {
    aktif: "t",
    kodecabang: $("#cabang").val(),
  };
  const likes = ["kode", "nama", "nama_toko"];
  const order_by = ["kode asc"];
  const group = "tb_pelanggan";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_pelanggan", field.length + 1, false),
    select_limit: select_limit_pelanggan,
    rows,
  };
}

async function other_tab_pelanggan(offset) {
  try {
    const keyword = $("#input_pelanggan").val();
    const conf_table = {
      element: "#tbody_pelanggan",
      items: [],
      pagination: "",
      name_btn: "searchcustomer",
      fields: require_get_pelanggan(keyword).field,
      tag_pagi: "#pagination_pelanggan",
      colspan: this.name_btn == "" ? require_get_pelanggan(keyword).field.length : require_get_pelanggan(keyword).field.length + 1,
    };
    loading_spinner("#tbody_pelanggan", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_pelanggan(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_pelanggan", require_get_pelanggan(keyword).group, list.length, total_rows, "#pagination_pelanggan", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function ext_exclude(text, ...exts) {
  try {
    if (exts.length === 0) throw new Error("Tidak ada ekstensi yang diizinkan");
    const ext = text.split(".").pop();
    if (!ext) throw new Error("File tidak memiliki ekstensi");
    return exts.includes(ext.toLowerCase());
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function ClearScreen() {
  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);
  $("#aktif").prop("disabled", false);
  $("#retail").prop("disabled", false);
  $("#tidak_retail").prop("checked", true);
  $("#kode").prop("disabled", false).val("");
  $("#nama").prop("disabled", false).val("");
  $("#kodegroup").prop("disabled", false).val("");
  $("#namagroup").prop("disabled", false).val("");
  $("#namatoko").prop("disabled", false).val("");
  $("#alamat").prop("disabled", false).val("");
  $("#kota").prop("disabled", false).val("");
  $("#notlp").prop("disabled", false).val("");
  $("#notlp2").prop("disabled", false).val("");
  $("#ig").prop("disabled", false).val("");
  $("#kodepos").prop("disabled", false).val("");
  $("#email").prop("disabled", false).val("");
  $("#cp").prop("disabled", false).val("");
  $("#no_kartu").prop("disabled", false).val("");
  $("#namabisnis").prop("disabled", false).val("");
  $("#norek").prop("disabled", false).val("");
  $("#namarek").prop("disabled", false).val("");
  $(".aktif").hide();
  if ($("#grup").val() != "ITS") {
    $(".retail").hide();
    $("#import_excel").hide();
    $("#carigroup").prop("disabled", true);
    $("#namagroup").prop("disabled", true).val("UMUM");
    $("#kodegroup").prop("disabled", true).val("GRUP000002");
    $("#namabisnis").prop("disabled", true).val("");
    $("#namarek").prop("disabled", true).val("");
    $("#norek").prop("disabled", true).val("");
    $("#namatoko").prop("disabled", true).val("");
  }
}

/* Maxlength Nomor HP */
$('#notlp[max]:not([max=""])').on("input", function (event) {
  const $this = $(this);
  const maxlength = $this.attr("max").length;
  const value = $this.val();
  if (value && value.length >= maxlength) {
    $this.val(value.substr(0, maxlength));
  }
});

/* Maxlength Nomor Telepon */
$('#notlp2[max]:not([max=""])').on("input", function (event) {
  const $this = $(this);
  const maxlength = $this.attr("max").length;
  const value = $this.val();
  if (value && value.length >= maxlength) {
    $this.val(value.substr(0, maxlength));
  }
});

/* Maxlength Nomor Telepon */
$('#cp[max]:not([max=""])').on("input", function (event) {
  const $this = $(this);
  const maxlength = $this.attr("max").length;
  const value = $this.val();
  if (value && value.length >= maxlength) {
    $this.val(value.substr(0, maxlength));
  }
});

function validasiSave() {
  const nama = $("#nama").val();
  const alamat = $("#alamat").val();
  const kota = $("#kota").val();
  const notlp = $("#notlp").val();
  const notlp2 = $("#notlp2").val();
  const kodepos = $("#kodepos").val();
  const email = $("#email").val();
  const cp = $("#cp").val();

  if (nama == "") {
    swalAlert("Nama tidak boleh kosong", "error");
    $("#nama").focus();
    return false;
  } else if (alamat == "") {
    swalAlert("Alamat tidak boleh kosong", "error");
    $("#alamat").focus();
    return false;
  } else if (kota == "") {
    swalAlert("Kota tidak boleh kosong", "error");
    $("#kota").focus();
    return false;
    // } else if (notlp == "") {
    //   swalAlert("Nomor Telepon tidak boleh kosong", "error");
    //   $("#notlp").focus();
    //   return false;
    // } else if (notlp2 == "") {
    //   swalAlert("Nomor Telepon 2 tidak boleh kosong", "error");
    //   $("#notlp2").focus();
    //   return false;
    // } else if (kodepos == "") {
    //   swalAlert("Kode Pos tidak boleh kosong", "error");
    //   $("#kodepos").focus();
    //   return false;
    // } else if (email == "") {
    //   swalAlert("Email tidak boleh kosong", "error");
    //   $("#email").focus();
    //   return false;
  } else if (cp == "") {
    swalAlert("Contact Person tidak boleh kosong", "error");
    $("#cp").focus();
    return false;
  }
  return true;
}

$("#input_kodepos").on("input", () => other_tab_kodepos(0));

$("#select_limit_kodepos").on("change", () => other_tab_kodepos(0));

$("#hapus_keyword_kodepos").on("click", () => {
  $("#input_kodepos").val("");
  other_tab_kodepos(0);
});

cari_kodepos.addEventListener("click", function (e) {
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

/*Get Data KodePOS*/
$(document).on("click", ".searchkodepos", async function () {
  const kode = $(this).attr("data-id");
  try {
    if (kode == "") throw new Error("Kode tidak boleh kosong !!!");
    const { error, message, data } = await post_data({
      url: "/kodepos/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kota").val(data?.kota);
    $("#kodepos").val(data?.kodepos);
    $("#find_kodepos").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#input_grup").on("input", () => other_tab_grup(0));

$("#select_limit_grup").on("change", () => other_tab_grup(0));

$("#hapus_keyword_grup").on("click", () => {
  $("#input_grup").val("");
  other_tab_grup(0);
});

$("#carigrup").on("click", function (e) {
  $("#find_grup").modal("show");
  $("#input_grup").val("").focus();
  other_tab_grup(0);
});

$(".btn_close_grup").click(function () {
  $("#input_grup").val("").focus();
  $("#find_grup").modal("hide");
});

$("#find_grup").on("shown.bs.modal", function () {
  $("#input_grup").val("").focus();
});

$("#find_grup").on("hidden.bs.modal", function () {
  $("#input_grup").val("").focus();
  $("#pagination_grup").html("");
});

/*Get Data Grup*/
$(document).on("click", ".searchgrupcustomer", async function () {
  const kode = $(this).attr("data-id");
  try {
    if (kode == "") throw new Error("Kode tidak boleh kosong !!!");
    const { error, message, data } = await post_data({
      url: "/grup-customer/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#namagroup").val(data?.nama);
    $("#kodegroup").val(kode);
    if (kode == "GRUP000001") $("input[name='retail'][value='true']").prop("checked", true);
    else $("input[name='retail'][value='false']").prop("checked", true);
    $("#find_grup").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#input_pelanggan").on("input", () => other_tab_pelanggan(0));

$("#select_limit_pelanggan").on("change", () => other_tab_pelanggan(0));

$("#hapus_keyword_pelanggan").on("click", () => {
  $("#input_pelanggan").val("");
  other_tab_pelanggan(0);
});

$("#find").on("click", function (e) {
  $("#find_pelanggan").modal("show");
  $("#input_pelanggan").val("").focus();
  other_tab_pelanggan(0);
});

$(".btn_close_pelanggan").click(function () {
  $("#input_pelanggan").val("").focus();
  $("#find_pelanggan").modal("hide");
});

$("#find_pelanggan").on("shown.bs.modal", function () {
  $("#input_pelanggan").val("").focus();
});

$("#find_pelanggan").on("hidden.bs.modal", function () {
  $("#input_pelanggan").val("").focus();
  $("#pagination_pelanggan").html("");
});

/*Get Data Pelanggan*/
$(document).on("click", ".searchcustomer", async function () {
  const kode = $(this).attr("data-id");
  try {
    if (kode == "") throw new Error("Kode tidak boleh kosong !!!");
    const { error, message, data } = await post_data({
      url: "/customer/kode?kode=" + encodeURIComponent(btoa(kode)),
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#kode").val(kode);
    $("#nama").val(data?.nama);
    $("#alamat").val(data?.alamat);
    $("#kota").val(data?.kota);
    $("#notlp").val(data?.notlp);
    $("#notlp2").val(data?.notlp2);
    $("#ig").val(data?.instagram);
    $("#kodepos").val(data?.kodepos);
    $("#email").val(data?.email);
    $("#cp").val(data?.cp);
    $("#kodegroup").val(data?.gruppelanggan);
    $("#namagroup").val(data?.namagrup);
    $("#namatoko").val(data?.nama_toko);
    $("#namabisnis").val(data?.nama_bisnis);
    $("#namarek").val(data?.nama_rek);
    $("#norek").val(data?.no_rek);
    $("#no_kartu").val(data?.no_kartu);
    if (data?.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    if (data?.retail == "t") $("#retail").prop("checked", true);
    else $("#tidak_retail").prop("checked", true);
    $("#statuspkp").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
    $("#nomor").prop("disabled", true);
    $(".aktif").show();
    $("#find_pelanggan").modal("hide");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// save
$("#save").on("click", async function () {
  try {
    if (!validasiSave()) return;
    const data = {
      nama: $("#nama").val(),
      alamat: $("#alamat").val(),
      kota: $("#kota").val(),
      notlp: $("#notlp").val(),
      notlp2: $("#notlp2").val(),
      instagram: $("#ig").val(),
      kodepos: $("#kodepos").val(),
      email: $("#email").val(),
      cp: $("#cp").val(),
      gruppelanggan: $("#kodegroup").val(),
      namagrup: $("#namagroup").val(),
      namatoko: $("#namatoko").val(),
      namabisnis: $("#namabisnis").val(),
      namarek: $("#namarek").val(),
      norek: $("#norek").val(),
      no_kartu: $("#no_kartu").val(),
      retail: $('input[name="retail"]:checked').val(),
    };
    const { error, message } = await post_data({
      url: "/customer",
      method: "POST",
      body: objectToFormData(data),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// update
$("#update").on("click", async function () {
  try {
    if (!validasiSave()) return;
    const data = {
      kode: $("#kode").val(),
      nama: $("#nama").val(),
      alamat: $("#alamat").val(),
      kota: $("#kota").val(),
      notlp: $("#notlp").val(),
      notlp2: $("#notlp2").val(),
      instagram: $("#ig").val(),
      gruppelanggan: $("#kodegroup").val(),
      kodepos: $("#kodepos").val(),
      email: $("#email").val(),
      cp: $("#cp").val(),
      namagrup: $("#namagroup").val(),
      namatoko: $("#namatoko").val(),
      namabisnis: $("#namabisnis").val(),
      namarek: $("#namarek").val(),
      norek: $("#norek").val(),
      no_kartu: $("#no_kartu").val(),
      retail: $('input[name="retail"]:checked').val(),
      aktif: $("input[name='aktif']:checked").val(),
    };
    const { error, message } = await put_data({
      url: "/customer",
      body: JSON.stringify(data),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#clear").click(ClearScreen);

document.getElementById("import_excel").addEventListener("click", function (event) {
  event.preventDefault();
  try {
    $("#find_import").modal("show");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$(".btn_close_import").click(() => {
  $("#find_import").modal("hide").find("form").trigger("reset");
  $(".name_file").html("");
  $("#gallery").html("");
  $("#import").css("display", "none");
});

async function import_file(event) {
  event.preventDefault();
  try {
    $("#overlay-spinner").show();
    const form_data = new FormData(form_import);
    if (!form_data.has("filecsv")) throw new Error("File csv harus diisi");
    const { error, message, data } = await post_data({
      url: "/customer/import",
      body: form_data,
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    $("#form_import").trigger("reset");
    $(".name_file").html("");
    $("#gallery").html("");
    $("#import").css("display", "none");
    $("#overlay-spinner").hide();
  } catch (e) {
    $("#overlay-spinner").hide();
    return swalAlert(e.message, "error");
  }
}

function preview_file(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    document.getElementById("gallery").innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 48 48">
      <path fill="#169154" d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"></path><path fill="#18482a" d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"></path><path fill="#0c8045" d="M14 15.003H29V24.005000000000003H14z"></path><path fill="#17472a" d="M14 24.005H29V33.055H14z"></path><g><path fill="#29c27f" d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"></path><path fill="#27663f" d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"></path><path fill="#19ac65" d="M29 15.003H44V24.005000000000003H29z"></path><path fill="#129652" d="M29 24.005H44V33.055H29z"></path></g><path fill="#0c7238" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path><path fill="#fff" d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"></path>
      </svg>`;
  };
}

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
});

["dragenter", "dragover"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function () {
      drop_area.classList.add("highlight");
    },
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  drop_area.addEventListener(
    eventName,
    function () {
      drop_area.classList.remove("highlight");
    },
    false
  );
});

drop_area.addEventListener("drop", function (e) {
  try {
    const file = e.dataTransfer.files[0];
    if (!file) return swalAlert("File belum tersedia !!!", "error");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    $("#import").css("display", "none");
    preview_file(file);
    document.getElementById("filecsv").files = e.dataTransfer.files;
    import_file(e);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

$("#filecsv").change(function () {
  try {
    const file = this.files[0];
    if (!file) throw new Error("File belum tersedia !!!");
    if (!ext_exclude(file.name, "csv", "xls", "xlsx")) throw new Error("Extensi file tidak diizinkan !!!");
    $(".name_file").html(file.name);
    $("#import").css("display", "block");
    preview_file(file);
  } catch (e) {
    $(".name_file").html("");
    $("#gallery").html("");
    $("#form_import").trigger("reset");
    $("#import").css("display", "none");
    return swalAlert(e.message, "error");
  }
});

form_import.addEventListener("submit", import_file);

ClearScreen();
