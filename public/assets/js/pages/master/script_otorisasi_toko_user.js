// user
function require_get_user(keyword, rows = "0") {
  const select_limit_user = $("#select_limit_user").val();
  const field = ["username", "nama_grup", "nama_toko", "aktif"];
  const table = "views/user";
  const wheres = {};
  const likes = ["username", "nama_grup", "nama_toko"];
  const order_by = ["username desc"];
  const group = "tb_user";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_user", field.length + 1, false),
    select_limit: select_limit_user,
    rows,
  };
}

async function other_tab_user(offset) {
  try {
    const keyword = $("#input_user").val();
    const conf_table = {
      element: "#tbody_user",
      items: [],
      pagination: "",
      name_btn: "search_user",
      fields: require_get_user(keyword).field,
      tag_pagi: "#pagination_user",
      colspan: this.name_btn == "" ? require_get_user(keyword).field.length : require_get_user(keyword).field.length + 1,
      3: (item) => (item.aktif == "t" ? "Aktif" : "Tidak Aktif"),
      2: (item) => item.nama_toko || "PUSAT",
    };
    loading_spinner("#tbody_user", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_user(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_user", require_get_user(keyword).group, list.length, total_rows, "#pagination_user", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// get user
$("#input_user").on("input", other_tab_user.bind(this, 0));
$("#select_limit_user").on("change", other_tab_user.bind(this, 0));
$("#hapus_keyword_user").on("click", function () {
  $("#input_user").val("").focus();
  other_tab_user(0);
});
$("#cari_user").click(function () {
  $("#find_user").modal("show");
  $("#input_user").focus().val("");
  other_tab_user(0);
});
$(".btn_close_user").click(() => {
  $("#input_user").val("").focus();
  $("#find_user").modal("hide");
});
$("#find_user").on("shown.bs.modal", function () {
  $("#input_user").val("").focus();
});
$("#find_user").on("hidden.bs.modal", function () {
  $("#input_user").val("");
  $("#pagination_user").html("");
});
$(document).on("click", ".search_user", async function () {
  $("#find_user").modal("hide");
  try {
    const id = $(this).data("id");
    const username = encodeURIComponent(btoa(id));

    const { error, message, data } = await post_data({
      url: `/user/find?username=${username}`,
      method: "get",
    });
    if (error) throw new Error(message);
    $("#nama_pengguna").val(data.username.trim()).prop("disabled", false);

  } catch (e) {
    return swalAlert(e.message, "error");
  }
});