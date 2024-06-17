// jenis pembayaran
function require_get_jenis(keyword, rows = "0") {
  const select_limit_jenis = $("#select_limit_jenis").val();
  const field = ["kode", "nama"];
  const table = "master/jenispembayaran";
  const wheres = {};
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
  const group = "tb_jenis";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_jenis", field.length + 1, false),
    select_limit: select_limit_jenis,
    rows,
  };
}

async function other_tab_jenis(offset) {
  try {
    const keyword = $("#input_jenis").val();
    const conf_table = {
      element: "#tbody_jenis",
      items: [],
      pagination: "",
      name_btn: "search_jenis",
      fields: require_get_jenis(keyword).field,
      tag_pagi: "#pagination_jenis",
      colspan: this.name_btn == "" ? require_get_jenis(keyword).field.length : require_get_jenis(keyword).field.length + 1,
    };
    loading_spinner("#tbody_jenis", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_jenis(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_jenis", require_get_jenis(keyword).group, list.length, total_rows, "#pagination_jenis", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// clear screen
function clear_screen()
{
  $("#kode").val("");
  $("#nama").val("");
  $("#aktif").prop("checked", true);
  $(".aktif").hide();

  $("#nama").focus();

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi()
{
  if ($("#nama").val() == "") {
    swalAlert("Nama harus diisi!", "error");
    $("#nama").focus();
    return false;
  } else return true;
}

// get jenis
$("#input_jenis").on("input", other_tab_jenis.bind(this, 0));
$("#select_limit_jenis").on("change", other_tab_jenis.bind(this, 0));
$("#hapus_keyword_jenis").on("click", function () {
  $("#input_jenis").val("").focus();
  other_tab_jenis(0);
});
$("#find").click(function () {
  $("#find_jenis").modal("show");
  $("#input_jenis").focus().val("");
  other_tab_jenis(0);
});
$(".btn_close_jenis").click(() => {
  $("#input_jenis").val("").focus();
  $("#find_jenis").modal("hide");
});
$("#find_jenis").on("shown.bs.modal", function () {
  $("#input_jenis").val("").focus();
});
$("#find_jenis").on("hidden.bs.modal", function () {
  $("#input_jenis").val("");
  $("#pagination_jenis").html("");
});
$(document).on("click", ".search_jenis", async function () {
  $("#find_jenis").modal("hide");
  try {
    const id = $(this).data("id");
    const kode = encodeURIComponent(btoa(id));

    const { error, message, data } = await post_data({
      url: `/jenis-pembayaran/find?kode=${kode}`,
      method: "get",
    });

    if (error) throw new Error(message);
    $("#kode").val(id);
    $("#nama").val(data?.nama).focus();
    $(".aktif").show();
    $(data?.aktif == 't' ? "#aktif" : "#tidak_aktif").prop("checked", true);
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
  try {
    if (!validasi()) return;
    const { error, message } = await post_data({
      url: "/jenis-pembayaran",
      method: "POST",
      body: objectToFormData({ nama: $("#nama").val() }),
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
      url: "/jenis-pembayaran",
      body: JSON.stringify({ kode: $("#kode").val(), nama: $("#nama").val(), aktif: $("input[name='aktif']:checked").val() }),
    });
    if (error) throw new Error(message);
    swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// btn clear
$("#clear").click(clear_screen);

clear_screen();