// toko
function require_get_toko(keyword, rows = "0") {
  const select_limit_toko = $("#select_limit_toko").val();
  const field = ["kode", "nama", "pemegang_toko", "admin_toko", "tipe_gaji", "komisi", "kodeauditor", "namaauditor"];
  const table = "Master/Toko";
  const wheres = {};
  const likes = ["nama"];
  const order_by = ["nama asc"];
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
      name_btn: "searchToko",
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

// auditor
function require_get_auditor(keyword, rows = "0") {
  const select_limit_auditor = $("#select_limit_auditor").val();
  const field = ["kode", "nama", "aktif"];
  const table = "Auditor";
  const wheres = {};
  const likes = ["kode", "nama"];
  const order_by = ["kode asc"];
  const group = "tb_auditor";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_auditor", field.length + 1, false),
    select_limit: select_limit_auditor,
    rows,
  };
}

async function other_tab_auditor(offset) {
  try {
    const keyword = $("#input_auditor").val();
    const conf_table = {
      element: "#tbody_auditor",
      items: [],
      pagination: "",
      name_btn: "searchauditor",
      fields: require_get_auditor(keyword).field,
      tag_pagi: "#pagination_auditor",
      colspan: this.name_btn == "" ? require_get_auditor(keyword).field.length : require_get_auditor(keyword).field.length + 1,
      2: (item) => {
        return item.aktif == "t" ? "Aktif" : "Tidak Aktif";
      },
    };
    loading_spinner("#tbody_auditor", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_auditor(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_auditor", require_get_auditor(keyword).group, list.length, total_rows, "#pagination_auditor", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function LoadHarga() {
  try {
    const { error, message, data } = await post_data({
      url: "/harga",
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    data.forEach((item) => {
      $("#pakaiharga").append(`<option value="${item.kode}">${item.nama}</option>`);
    });
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$("#selectall").on("click", function () {
  if (this.checked) {
    $(".checksales").each(function () {
      this.checked = true;

      const kode = this.parentElement.parentElement.children[0].innerHTML;
      const nama = this.parentElement.parentElement.children[1].innerHTML;
      const kondisi = this.parentElement.parentElement.children[2].innerHTML;
      const jumlah_none = this.parentElement.parentElement.children[3].innerHTML;
      const jumlah = this.parentElement.parentElement.children[4].children[0].value;
      // save to local storage for checked sales
      if (this.checked) saveLocalStorage("checked_sales", { kode, nama, kondisi: "t", jumlah_none, jumlah }, kode);
      else deleteLocalStorage("checked_sales", kode);
    });
  } else {
    $(".checksales").each(function () {
      this.checked = false;

      const kode = this.parentElement.parentElement.children[0].innerHTML;
      const nama = this.parentElement.parentElement.children[1].innerHTML;
      const kondisi = this.parentElement.parentElement.children[2].innerHTML;
      const jumlah_none = this.parentElement.parentElement.children[3].innerHTML;
      const jumlah = this.parentElement.parentElement.children[4].children[0].value;
      // save to local storage for checked sales
      if (this.checked) saveLocalStorage("checked_sales", { kode, nama, kondisi: "t", jumlah_none, jumlah }, kode);
      else deleteLocalStorage("checked_sales", kode);
    });
  }
});

$(document).on("change", ".checksales", function () {
  if ($(".checksales:checked").length == $(".checksales").length) {
    $("#selectall").prop("checked", true);
  } else {
    $("#selectall").prop("checked", false);
  }

  const kode = this.parentElement.parentElement.children[0].innerHTML;
  const nama = this.parentElement.parentElement.children[1].innerHTML;
  const kondisi = this.parentElement.parentElement.children[2].innerHTML;
  const jumlah_none = this.parentElement.parentElement.children[3].innerHTML;
  const jumlah = this.parentElement.parentElement.children[4].children[0].value;
  // save to local storage for checked sales
  if (this.checked) saveLocalStorage("checked_sales", { kode, nama, kondisi: "t", jumlah_none, jumlah }, kode);
  else deleteLocalStorage("checked_sales", kode);
});

$(document).on("change", "#selectall", function () {
  var arrData = [];
  if (this.checked) {
    $("#t_detail tr").each(function () {
      var currentRow = $(this);

      var K_true = currentRow.find("td:eq(2)").text("true");
      // var K_false = currentRow.find('td:eq(2)').text('false');
      var obj = {};
      obj.kondisi_true = K_true;
      // obj.kondisi_false = K_false;

      arrData.push(obj);
    });
  } else {
    $("#t_detail tr").each(function () {
      var currentRow = $(this);

      var K_false = currentRow.find("td:eq(2)").text("false");
      // var K_false = currentRow.find('td:eq(2)').text('false');
      var obj = {};
      obj.kondisi_false = K_false;
      // obj.kondisi_false = K_false;

      arrData.push(obj);
    });
  }
});

$(document).on("change", ".checksales", function () {
  const dataid = $(this).attr("data-id");
  if (this.checked) {
    $("#value_" + dataid + "").text("true");
  } else {
    $("#value_" + dataid + "").text("false");
  }
});

async function LoadJenisPembayaran(kode_toko = $("#cabang").val()) {
  try {
    const { error, message, data } = await post_data({
      url: "/jenis-pembayaran/toko?kode_toko=" + kode_toko,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    let content = "";
    data.forEach((item) => {
      const kode = item.kode;
      const nama = item.nama;
      const jumlah = item.jumlah;
      const check = item.check;

      const is_checked = check == "t" ? "checked" : "";
      const is_disabled = kode == "JP00000015" ? "disabled" : "";
      if (check == "t") saveLocalStorage("checked_sales", { kode, nama, kondisi: check, jumlah_none: jumlah, jumlah }, kode);
      else deleteLocalStorage("checked_sales", kode);
      content += `
        <tr id="${kode}">
          <td nowrap>${kode}</td>
          <td nowrap>${nama}</td>
          <td style="display: none;" id="value_${kode}">${check}</td>
          <td style="display: none;" id="text_${kode}" nowrap>${jumlah}</td>
          <td style="text-align: center;">
            <input type="text" ${is_disabled} class="jumlah" id="ket_${kode}" data-id="${kode}" value="${jumlah}">
          </td>
          <td style="text-align: center;">
            <input type="checkbox" class="checksales" data-id="${kode}" value="true" ${is_checked}>
          </td>
        </tr>
      `;
    });
    $("#tb_detail").html(content);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("keyup", ".jumlah", function () {
  const dataid = $(this).attr("data-id");
  const data = $(this).val();
  $("#text_" + dataid + "").text(data);
  $("#ket_" + dataid + "").mask("99.99%", {
    reverse: true,
  });
});

function AmbilDataDetail() {
  var table = document.getElementById("t_detail");
  var arr2 = [];
  for (var r = 1, n = table.rows.length; r < n; r++) {
    var string = "";
    for (var c = 0, m = table.rows[r].cells.length; c < m - 1; c++) {
      if (c == 0) {
        string = "{" + table.rows[0].cells[c].innerHTML + " : '" + table.rows[r].cells[c].innerHTML + "'";
      } else {
        string = string + ", " + table.rows[0].cells[c].innerHTML + " : '" + table.rows[r].cells[c].innerHTML + "'";
      }
    }
    string = string + "}";
    var obj = JSON.stringify(eval("(" + string + ")"));
    var arr = $.parseJSON(obj);
    arr2.push(arr);
  }
  return arr2;
}

/* Function ClearScreen */
function ClearScreen() {
  $("#pakaiharga").empty();
  $("#pakaiharga").append('<option value = "" >Pilih Harga</option>');
  LoadHarga();
  LoadJenisPembayaran($("#kode").val());
  $("#pakaiharga").prop("disabled", false).val("");
  // $('#kode').prop("disabled", false).val("");
  $("#nama").prop("disabled", false).val("");
  $("#pemegang").prop("disabled", false).val("");
  $("#admin").prop("disabled", false).val("");
  $("#tipegaji").prop("disabled", false).val("");
  // $('#gaji').prop("disabled", false).val("");
  $("#komisi").prop("disabled", false).val("");
  $("#auditor").prop("disabled", false).val("");
  // $('#diskontoko').prop("disabled", false).val("");
  $("#namaauditor").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);
  $("#tidak_aktif_toko").prop("disabled", false);

  $("#alamat").prop("disabled", false).val("");
  // $('#kodepos').prop("disabled", false).val("");
  $("#hppemegangtoko").prop("disabled", false).val("");
  $("#hptoko").prop("disabled", false).val("");
  $("#phone1").prop("disabled", false).val("");
  $("#phone2").prop("disabled", false).val("");
  // $('#fax').prop("disabled", false).val("");
  $("#email").prop("disabled", false).val("");
  // $('#adminn').prop("disabled", false).val("");

  $("#bcavm").prop("disabled", false).val("");
  $("#mandirivm").prop("disabled", false).val("");
  $("#bcadebit").prop("disabled", false).val("");
  $("#bcavisa").prop("disabled", false).val("");
  $("#bcaqr").prop("disabled", false).val("");
  $("#bcajcb").prop("disabled", false).val("");
  $("#mandiridebit").prop("disabled", false).val("");
  $("#mandirivisa").prop("disabled", false).val("");
  $("#mandiriqr").prop("disabled", false).val("");
  $("#mandirijcb").prop("disabled", false).val("");
  $("#bcacard").prop("disabled", false).val("");
  $("#mandiricard").prop("disabled", false).val("");
  $("#bcalain").prop("disabled", false).val("");

  $("#targetpenjualan").prop("disabled", false).val("");
  $("#kenaikanpenjualan").prop("disabled", false).val("");
  $("#bonuspenjualan").prop("disabled", false).val("");

  $("#bank1").prop("disabled", false).val("");
  $("#rek1").prop("disabled", false).val("");
  $("#nama1").prop("disabled", false).val("");
  $("#bank2").prop("disabled", false).val("");
  $("#rek2").prop("disabled", false).val("");
  $("#nama2").prop("disabled", false).val("");

  $("#ket").prop("disabled", false).val("");

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);

  $(".aktif").hide();
  resetLocalStorage("checked_sales");
  clearAllLocalStorage();
}

// $('#gaji').keyup(function() {
//   $(this).val(FormatRupiah($(this).val()));
// });
$("#targetpenjualan").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});
$("#kenaikanpenjualan").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});
$("#bonuspenjualan").keyup(function () {
  $(this).val(FormatRupiah($(this).val()));
});
// $('#saldokas').keyup(function() {
//   $(this).val(FormatRupiah($(this).val()));
// });
// $('#formulaharga').keyup(function() {
//   $(this).val(FormatRupiah($(this).val()));
// });
$("#komisi").mask("99.99%", {
  reverse: true,
});
$("#bcavm").mask("99.99%", {
  reverse: true,
});
$("#mandirivm").mask("99.99%", {
  reverse: true,
});
// $('#diskontoko').mask('99.99%', {
//     reverse: true
// });

$("#bcavisa").mask("99.99%", {
  reverse: true,
});
$("#bcaqr").mask("99.99%", {
  reverse: true,
});
$("#bcajcb").mask("99.99%", {
  reverse: true,
});
$("#mandiridebit").mask("99.99%", {
  reverse: true,
});
$("#mandirivisa").mask("99.99%", {
  reverse: true,
});
$("#mandiriqr").mask("99.99%", {
  reverse: true,
});
$("#mandirijcb").mask("99.99%", {
  reverse: true,
});
$("#bcacard").mask("99.99%", {
  reverse: true,
});
$("#mandiricard").mask("99.99%", {
  reverse: true,
});
$("#bcalain").mask("99.99%", {
  reverse: true,
});
$("#inputhasil").mask("99.99%", {
  reverse: true,
});

$("#tipegaji").change(function () {
  var tipe = $(this).val();
  if (tipe == "1") {
    // $('#gaji').val("").prop('disabled', false);
    $("#komisi").val(0).prop("disabled", false);
  } else if (tipe == "2") {
    // $('#gaji').val(0).prop('disabled', true);
    $("#komisi").val("").prop("disabled", false);
  } else if (tipe == "3") {
    // $('#gaji').val("").prop('disabled', false);
    $("#komisi").val("").prop("disabled", false);
  } else {
    // $('#gaji').val("").prop('disabled', false);
    $("#komisi").val("").prop("disabled", false);
  }
});

function inputBonus(element) {
  if (element.dataset.tipe == "1") {
    const { value } = element;
    if (isNaN(value)) element.value = value.substr(0, value.length - 1);
    const arr_value = value.split("");
    const first_val = arr_value[0];
    if (first_val == 0) {
      arr_value.shift();
      element.value = arr_value.join("");
    }
    const result_value = arr_value.map((e) => Number(e)).join("");
    element.value = FormatRupiah(result_value.replace(/NaN/gi, ""));
    if (value.length < 1) element.value = 0;
  } else {
    let value = element.value;
    value = value.replace(/[^0-9]/g, "");
    if (value.length > 2) value = value.slice(0, 2);
    const arr_value = value.split("");
    const first_val = arr_value[0];
    if (first_val == 0) {
      arr_value.shift();
      value = arr_value.join("");
    }
    if (value.length < 1) value = 0;
    element.value = value + "%";
  }
}

/* Validasi Kosong */
function ValidasiSave() {
  const nama = $("#nama").val();

  if (nama == "" || nama == "0") {
    Swal.fire({
      title: "Informasi",
      icon: "info",
      html: "Nama Tidak Boleh Kosong.",
      showCloseButton: true,
      width: 350,
    });
    $("#nama").focus();
    var result = false;
  } else {
    var result = true;
  }
  return result;
}

/* Cari Data Auditor*/
$("#input_auditor").on("input", function () {
  other_tab_auditor(0);
});

$("#select_limit_auditor").on("change", function () {
  other_tab_auditor(0);
});

$("#hapus_keyword_auditor").click(function () {
  $("#input_auditor").val("").focus();
  other_tab_auditor(0);
});

document.getElementById("cariauditor").addEventListener("click", function (event) {
  event.preventDefault();
  $("#input_auditor").val("");
  $("#findauditor").modal("show");
  other_tab_auditor(0);
});

$(".btn_close_auditor").click(function () {
  $("#input_auditor").val("").focus();
  $("#findauditor").modal("hide");
});

$("#findauditor").on("shown.bs.modal", function () {
  $("#input_auditor").val("").focus();
});

$("#findauditor").on("hidden.bs.modal", function () {
  $("#input_auditor").val("");
  $("#pagination_auditor").html("");
});

/*Get Data Auditor*/
$(document).on("click", ".searchauditor", async function () {
  const kode = $(this).attr("data-id");
  const { error, message, data } = await post_data({
    url: "/auditor",
    body: objectToFormData({ kode }),
  });
  if (error) return swalAlert(message, "error");
  $("#namaauditor").val(data.nama);
  $("#auditor").val(data.kode);
  $("#findauditor").modal("hide");
});

/* Cari Data Toko */
$("#input_toko").on("input", function () {
  other_tab_toko(0);
});

$("#select_limit_toko").change(function () {
  other_tab_toko(0);
});

$("#hapus_keyword_toko").click(function () {
  $("#input_toko").val("");
  other_tab_toko(0);
});

document.getElementById("find").addEventListener("click", function (event) {
  event.preventDefault();
  $("#input_toko").val("");
  $("#findtoko").modal("show");
  other_tab_toko(0);
});

$(".btn_close_toko").click(function () {
  $("#input_toko").val("").focus();
  $("#findtoko").modal("hide");
});

$("#findtoko").on("shown.bs.modal", function () {
  $("#input_toko").val("").focus();
});

$("#findtoko").on("hidden.bs.modal", function () {
  $("#input_toko").val("");
  $("#pagination_toko").html("");
});

/*Get Data Toko*/
$(document).on("click", ".searchToko", async function () {
  $("#findtoko").modal("hide");
  try {
    const kode = $(this).attr("data-id");
    $("#overlay-spinner").show();
    clearTimeout(delay_search_data);
    setTimeout(async () => {
      $("#overlay-spinner").hide();
      const { error, message, data } = await post_data({
        url: "/toko?kode=" + kode,
        method: "GET",
      });
      if (error) return swalAlert(message, "error");
      $("#kode").val(data?.kode);
      $("#nama").val(data?.nama);
      $("#pemegang").val(data?.pemegang_toko);
      $("#admin").val(data?.admin_toko);
      $("#komisi").val(data?.komisi + "%");
      $("#tipegaji").val(data?.tipe_gaji);
      $("#auditor").val(data?.kodeauditor);
      $("#namaauditor").val(data?.namaauditor);
      if (data.toko_bb == "t") $("#aktif_toko").prop("checked", true);
      else $("#tidak_aktif_toko").prop("checked", true);

      GetAlamatToko(kode);
      DataKasDanTarget(kode);
      DataRekeningPenanggungJawab(kode);
      DataKeterangan(kode);
      DataBagihasil(kode);
      DataFormulaHarga(kode);
      LoadJenisPembayaran(kode);
      $("#update").prop("disabled", false);
      $("#save").prop("disabled", true);
      $("#kode").prop("disabled", true);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

async function GetAlamatToko(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/alamat?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#alamat").val(data?.alamat);
    $("#hppemegangtoko").val(data?.hp_pemegang_toko);
    $("#hptoko").val(data?.hp_toko);
    $("#phone1").val(data?.phone1);
    $("#phone2").val(data?.phone2);
    $("#email").val(data?.email);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function DataRekeningPenanggungJawab(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/rekening?kode=" + kode,
      method: "GET",
    });
    if (error) throw new Error(message);
    $("#bank1").val(data?.nama_bank);
    $("#rek1").val(data?.rekening);
    $("#nama1").val(data?.nama_penanggung);
    $("#bank2").val(data?.nama_bank);
    $("#rek2").val(data?.rekening);
    $("#nama2").val(data?.nama_penanggung);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function DataKasDanTarget(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/kas-target?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#targetpenjualan").val(FormatRupiah(data?.target_penjualan));
    $("#kenaikanpenjualan").val(FormatRupiah(data?.kenaikan_penjualan));
    $("#bonuspenjualan").val(FormatRupiah(data?.bonus_penjualan));
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function DataKeterangan(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/keterangan?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#ket").val(data?.keterangan);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function DataBagihasil(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/bagi-hasil?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#inputhasil").val(data?.bagihasil + "%");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

async function DataFormulaHarga(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/toko/formula-harga?kode=" + kode,
      method: "GET",
    });
    if (error) return swalAlert(message, "error");
    $("#pakaiharga").val(data?.pakaiharga);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

/* Save */
document.getElementById("save").addEventListener("click", async function (event) {
  event.preventDefault();
  // console.log(this); return;
  try {
    const kode = $("#kode").val();
    const nama = $("#nama").val();
    const pemegang = $("#pemegang").val();
    const admin = $("#admin").val();
    const tipegaji = $("#tipegaji").val();
    // const gaji = $('#gaji').val();
    const komisi = $("#komisi").val();
    const auditor = $("#auditor").val();
    // const diskontoko = $('#diskontoko').val();
    const namaauditor = $("#namaauditor").val();

    const alamat = $("#alamat").val();
    // const kodepos = $('#kodepos').val();
    const hppemegangtoko = $("#hppemegangtoko").val();
    const hptoko = $("#hptoko").val();
    const phone1 = $("#phone1").val();
    const phone2 = $("#phone2").val();
    // const fax = $('#fax').val();
    // const adminn = $('#adminn').val();
    const email = $("#email").val();

    const bcavm = $("#bcavm").val();
    const mandirivm = $("#mandirivm").val();
    const bcadebit = $("#bcadebit").val();
    const mandiridebit = $("#mandiridebit").val();
    const bcacard = $("#bcacard").val();
    const mandiricard = $("#mandiricard").val();
    const bcalain = $("#bcalain").val();
    const bcavisa = $("#bcavisa").val();
    const mandirivisa = $("#mandirivisa").val();
    const bcaqr = $("#bcaqr").val();
    const mandiriqr = $("#mandiriqr").val();
    const bcajcb = $("#bcajcb").val();
    const mandirijcb = $("#mandirijcb").val();

    const targetpenjualan = $("#targetpenjualan").val();
    const kenaikanpenjualan = $("#kenaikanpenjualan").val();
    const bonuspenjualan = $("#bonuspenjualan").val();
    // const periodekas = $('#periodekas').val();
    // const saldokas = $('#saldokas').val();
    // const hitungbonus = $('#hitungbonus').val();
    const pakaiharga = $("#pakaiharga").val();
    // const formulaharga = $('#formulaharga').val();
    // const bonustargetpenjualan = $('#bonustargetpenjualan').val();

    const bank1 = $("#bank1").val();
    const rek1 = $("#rek1").val();
    const nama1 = $("#nama1").val();
    const bank2 = $("#bank2").val();
    const rek2 = $("#rek2").val();
    const nama2 = $("#nama2").val();

    const ket = $("#ket").val();

    const inputhasil = $("#inputhasil").val();
    const datadetail = getLocalStorage("checked_sales");
    const is_some_kondisi_true = datadetail.some((item) => item.kondisi == "t" || item.kondisi == "true");
    if (!is_some_kondisi_true) return swalAlert("Jenis pembayaran minimal harus diisi satu !!!", "warning");

    const toko_sendiri = $('input[name="toko_sendiri"]:checked').val();
    if (!toko_sendiri) return swalAlert("Grup Happy Pets Harus Dipilih", "error");
    $("#overlay-spinner").show();
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      $("#overlay-spinner").hide();
      if (ValidasiSave() == true) {
        const { error, message, data } = await post_data({
          url: "/toko",
          method: "POST",
          body: objectToFormData({
            kode,
            nama,
            pemegang,
            admin,
            tipegaji,
            komisi,
            auditor,
            namaauditor,
            alamat,
            hppemegangtoko,
            hptoko,
            phone1,
            phone2,
            email,
            bcavm,
            mandirivm,
            bcadebit,
            mandiridebit,
            bcacard,
            mandiricard,
            bcalain,
            bcavisa,
            mandirivisa,
            bcaqr,
            mandiriqr,
            bcajcb,
            mandirijcb,
            targetpenjualan,
            kenaikanpenjualan,
            bonuspenjualan,
            pakaiharga,
            bank1,
            rek1,
            nama1,
            bank2,
            rek2,
            nama2,
            ket,
            inputhasil,
            datadetail: JSON.stringify(datadetail),
            toko_sendiri,
          }),
        });
        if (error) return swalAlert(message, "error");
        ClearScreen();
        swalAlert(message, "success");
      }
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

/* Update */
document.getElementById("update").addEventListener("click", function (event) {
  event.preventDefault();
  const kode = $("#kode").val();
  const nama = $("#nama").val();
  const pemegang = $("#pemegang").val();
  const admin = $("#admin").val();
  const tipegaji = $("#tipegaji").val();
  // const gaji = $('#gaji').val();
  const komisi = $("#komisi").val();
  const auditor = $("#auditor").val();
  // const diskontoko = $('#diskontoko').val();
  const namaauditor = $("#namaauditor").val();

  const alamat = $("#alamat").val();
  // const kodepos = $('#kodepos').val();
  const hppemegangtoko = $("#hppemegangtoko").val();
  const hptoko = $("#hptoko").val();
  const phone1 = $("#phone1").val();
  const phone2 = $("#phone2").val();
  // const fax = $('#fax').val();
  // const adminn = $('#adminn').val();
  const email = $("#email").val();

  const targetpenjualan = $("#targetpenjualan").val();
  const kenaikanpenjualan = $("#kenaikanpenjualan").val();
  const bonuspenjualan = $("#bonuspenjualan").val();
  // const periodekas = $('#periodekas').val();
  // const saldokas = $('#saldokas').val();
  // const hitungbonus = $('#hitungbonus').val();
  const pakaiharga = $("#pakaiharga").val();
  // const formulaharga = $('#formulaharga').val();
  // const bonustargetpenjualan = $('#bonustargetpenjualan').val();

  const bank1 = $("#bank1").val();
  const rek1 = $("#rek1").val();
  const nama1 = $("#nama1").val();
  const bank2 = $("#bank2").val();
  const rek2 = $("#rek2").val();
  const nama2 = $("#nama2").val();

  const ket = $("#ket").val();
  const inputhasil = $("#inputhasil").val();
  const datadetail = getLocalStorage("checked_sales");
  const toko_sendiri = $('input[name="toko_sendiri"]:checked').val();
  const is_some_kondisi_true = datadetail.some((item) => item.kondisi == "t" || item.kondisi == "true");
  if (!is_some_kondisi_true) return swalAlert("Jenis pembayaran minimal harus diisi satu !!!", "warning");
  if (!toko_sendiri) return swalAlert("Grup Happy Pets Harus Dipilih", "error");

  try {
    $("#overlay-spinner").show();
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      $("#overlay-spinner").hide();
      const { error, message, data } = await put_data({
        url: "/toko",
        method: "PUT",
        body: JSON.stringify({
          kode,
          nama,
          pemegang,
          admin,
          tipegaji,
          komisi,
          auditor,
          namaauditor,
          alamat,
          hppemegangtoko,
          hptoko,
          phone1,
          phone2,
          email,
          targetpenjualan,
          kenaikanpenjualan,
          bonuspenjualan,
          pakaiharga,
          bank1,
          rek1,
          nama1,
          bank2,
          rek2,
          nama2,
          ket,
          inputhasil,
          datadetail: JSON.stringify(datadetail),
          toko_sendiri,
        }),
      });
      if (error) return swalAlert(message, "error");
      swalAlert(message, "success");
    }, 500);
  } catch (e) {
    $("#overlay-spinner").hide();
    return swalAlert(e.message, "error");
  }
});

function BersihkanLayar() {
  location.reload(true);
}

/* Clear */
document.getElementById("clear").addEventListener("click", function (event) {
  event.preventDefault();
  BersihkanLayar();
});
ClearScreen();
