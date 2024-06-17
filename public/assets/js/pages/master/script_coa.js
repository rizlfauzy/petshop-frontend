// coa
function require_get_coa(keyword, rows = "0") {
  const select_limit_coa = $("#select_limit_coa").val();
  const field = ["nomor", "nama", "aktif"];
  const table = "master/account";
  const wheres = {};
  const likes = ["nomor", "nama"];
  const order_by = ["tglsimpan desc"];
  const group = "tb_coa";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_coa", field.length + 1, false),
    select_limit: select_limit_coa,
    rows,
  };
}

async function other_tab_coa(offset) {
  try {
    const keyword = $("#input_coa").val();
    const conf_table = {
      element: "#tbody_coa",
      items: [],
      pagination: "",
      name_btn: "search_coa",
      fields: require_get_coa(keyword).field,
      tag_pagi: "#pagination_coa",
      colspan: this.name_btn == "" ? require_get_coa(keyword).field.length : require_get_coa(keyword).field.length + 1,
      2: item => item.aktif == 't' ? 'Aktif' : 'Tidak Aktif',
    };
    loading_spinner("#tbody_coa", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_coa(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_coa", require_get_coa(keyword).group, list.length, total_rows, "#pagination_coa", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen() {
  $("#nomor").val("");
  $("#nama").val("");
  $("#jenis").val("").prop("disabled", false);
  $("#aktif").prop("checked", true);
  $(".aktif").hide();

  $("#nama").focus();

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi() {
  if ($("#nama").val() == "") {
    swalAlert("Nama harus diisi", "error");
    $("#nama").focus();
    return false;
  } else if ($("#jenis").val() == "") {
    swalAlert("Jenis harus diisi", "error");
    $("#jenis").focus();
    return false;
  } else return true;
}

// get coa
$("#input_coa").on("input", other_tab_coa.bind(this, 0));
$("#select_limit_coa").on("change", other_tab_coa.bind(this, 0));
$("#hapus_keyword_coa").on("click", function () {
  $("#input_coa").val("").focus();
  other_tab_coa(0);
});
$("#find").click(function () {
  $("#find_coa").modal("show");
  $("#input_coa").focus().val("");
  other_tab_coa(0);
});
$(".btn_close_coa").click(() => {
  $("#input_coa").val("").focus();
  $("#find_coa").modal("hide");
});
$("#find_coa").on("shown.bs.modal", function () {
  $("#input_coa").val("").focus();
});
$("#find_coa").on("hidden.bs.modal", function () {
  $("#input_coa").val("");
  $("#pagination_coa").html("");
});
$(document).on("click", ".search_coa", async function () {
  try {
    $("#find_coa").modal("hide");
    const id = $(this).data("id");
    const nomor = encodeURIComponent(btoa(id));

    const { error, message, data } = await post_data({
      url: `/coa/find?nomor=${nomor}`,
      method: "get"
    });

    if (error) throw new Error(message);
    $("#nomor").val(id);
    $("#nama").val(data?.nama).focus();
    $("#jenis").val(data?.jenisaccount).prop("disabled", true);
    $(".aktif").show();
    $(data?.aktif == 't' ? "#aktif" : "tidak_aktif").prop("checked", true);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})

$("#nama").keypress(function (e) {
  if (this.value.length < 1) return;
  if (e.keyCode == 13) {
    if ($("#save").prop("disabled")) $("#update").click();
    else $("#save").click();
  }
})

// save
$("#save").click(async function () {
  if (!validasi()) return;
  try {
    const { error, message } = await post_data({
      url: "/coa",
      body: objectToFormData({
        nama: $("#nama").val(),
        jenis: $("#jenis").val()
      })
    });
    if (error) throw new Error(message);
    clear_screen();
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})

// update
$("#update").click(async function () {
  if (!validasi()) return;
  try {
    const { error, message, nomor } = await put_data({
      url: "/coa",
      body: JSON.stringify({
        nomor: $("#nomor").val(),
        nama: $("#nama").val(),
        jenis: $("#jenis").val(),
        aktif: $("input[name='aktif']:checked").val()
      })
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    $("#nomor").val(nomor);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
})

// btn clear
$("#clear").click(clear_screen);

clear_screen();