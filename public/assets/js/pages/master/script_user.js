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

// group
function require_get_group(keyword, rows = "0") {
  const select_limit_group = $("#select_limit_group").val();
  const field = ["kode", "nama"];
  const table = "master/grup";
  const wheres = { aktif: "t" };
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
  const group = "tb_group";
  return {
    keyword,
    field,
    table,
    wheres,
    likes,
    order_by,
    group,
    loading_spinner: loading_spinner("#tbody_group", field.length + 1, false),
    select_limit: select_limit_group,
    rows,
  };
}

async function other_tab_group(offset) {
  try {
    const keyword = $("#input_group").val();
    const conf_table = {
      element: "#tbody_group",
      items: [],
      pagination: "",
      name_btn: "search_group",
      fields: require_get_group(keyword).field,
      tag_pagi: "#pagination_group",
      colspan: this.name_btn == "" ? require_get_group(keyword).field.length : require_get_group(keyword).field.length + 1,
    };
    loading_spinner("#tbody_group", conf_table.colspan);
    clearTimeout(delay_search_data);
    delay_search_data = setTimeout(async () => {
      const { list, pagination, total_rows } = await get_search_table(require_get_group(keyword, offset));
      template_table({
        ...conf_table,
        items: list,
        pagination,
      });
      template_pagination("#total_data_group", require_get_group(keyword).group, list.length, total_rows, "#pagination_group", arguments.callee.name, list.length > 0 ? pagination : null);
    }, 500);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

// toko
function require_get_toko(keyword, rows = "0") {
  const select_limit_toko = $("#select_limit_toko").val();
  const field = ["kode", "nama"];
  const table = "master/toko";
  const wheres = { aktif: "t" };
  const likes = ["kode", "nama"];
  const order_by = ["kode desc"];
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
      name_btn: "search_toko",
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

// clear screen
function clear_screen() {
  $("#nama_pengguna").val("").focus();
  $("#old_username").val("");
  $("#kata_sandi").val("");
  $("#nama_group").val("");
  $("#kode_group").val("");
  $("#nama_toko").val($("#nama_cabang").val());
  $("#kode_toko").val($("#cabang").val());
  $("#show_password").is(":checked") ? $('input[name="kata_sandi"]').attr("type", "text") : $('input[name="kata_sandi"]').attr("type", "password");
  $("#aktif").prop("checked", true);
  $(".aktif").hide();

  $("#save").prop("disabled", false);
  $("#update").prop("disabled", true);
}

// validasi
function validasi() {
  if (!$("#nama_pengguna").val()) {
    $("#nama_pengguna").focus();
    swalAlert("Nama Pengguna tidak boleh kosong!", "error");
    return false;
  } else if (!$("#kata_sandi").val()) {
    $("#kata_sandi").focus();
    swalAlert("Kata Sandi tidak boleh kosong!", "error");
    return false;
  } else if (!$("#kode_group").val()) {
    $("#cari_group").focus();
    swalAlert("Kode Group tidak boleh kosong!", "error");
    return false;
  } else if (!$("#kode_toko").val()) {
    $("#cari_toko").focus();
    swalAlert("Kode Toko tidak boleh kosong!", "error");
    return false;
  } else return true;
}

// get user
$("#input_user").on("input", other_tab_user.bind(this, 0));
$("#select_limit_user").on("change", other_tab_user.bind(this, 0));
$("#hapus_keyword_user").on("click", function () {
  $("#input_user").val("").focus();
  other_tab_user(0);
});
$("#find").click(function () {
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
    $("#old_username").val(data.username.trim());
    $("#kata_sandi").val(data.password.trim()).prop("disabled", false);
    $("#kode_group").val(data.kode_grup.trim()).prop("disabled", false);
    $("#nama_group").val(data.nama_grup.trim()).prop("disabled", false);
    $("#kode_toko")
      .val(data.kode_toko || "S000")
      .prop("disabled", false);
    $("#nama_toko")
      .val(data.nama_toko || "PUSAT")
      .prop("disabled", false);
    if (data.is_pusat == "t") $("#cari_toko").hide();
    else $("#cari_toko").show();
    $(data.aktif == "t" ? "#aktif" : "#tidak_aktif").prop("checked", true);
    $(".aktif").show();
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", false);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get group
$("#input_group").on("input", other_tab_group.bind(this, 0));
$("#select_limit_group").on("change", other_tab_group.bind(this, 0));
$("#hapus_keyword_group").on("click", function () {
  $("#input_group").val("").focus();
  other_tab_group(0);
});
$("#cari_group").click(function () {
  $("#find_group").modal("show");
  $("#input_group").focus().val("");
  other_tab_group(0);
});
$(".btn_close_group").click(() => {
  $("#input_group").val("").focus();
  $("#find_group").modal("hide");
});
$("#find_group").on("shown.bs.modal", function () {
  $("#input_group").val("").focus();
});
$("#find_group").on("hidden.bs.modal", function () {
  $("#input_group").val("");
  $("#pagination_group").html("");
});
$(document).on("click", ".search_group", async function () {
  $("#find_group").modal("hide");
  try {
    const id = $(this).data("id");
    const kode = encodeURIComponent(btoa(id));

    const { error, message, data } = await post_data({
      url: `/user/group/find?kode=${kode}`,
      method: "get",
    });
    if (error) throw new Error(message);
    $("#kode_group").val(data.kode.trim());
    $("#nama_group").val(data.nama.trim());
    $("#kode_toko").val(data.is_pusat == 't' ? "S000" : $("#cabang").val());
    $("#nama_toko").val(data.is_pusat == 't' ? "PUSAT" : $("#nama_cabang").val());
    if (data.is_pusat == 't') $("#cari_toko").hide();
    else $("#cari_toko").show();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// get toko
$("#input_toko").on("input", other_tab_toko.bind(this, 0));
$("#select_limit_toko").on("change", other_tab_toko.bind(this, 0));
$("#hapus_keyword_toko").on("click", function () {
  $("#input_toko").val("").focus();
  other_tab_toko(0);
});
$("#cari_toko").click(function () {
  $("#find_toko").modal("show");
  $("#input_toko").focus().val("");
  other_tab_toko(0);
});
$(".btn_close_toko").click(() => {
  $("#input_toko").val("").focus();
  $("#find_toko").modal("hide");
});
$("#find_toko").on("shown.bs.modal", function () {
  $("#input_toko").val("").focus();
});
$("#find_toko").on("hidden.bs.modal", function () {
  $("#input_toko").val("");
  $("#pagination_toko").html("");
});
$(document).on("click", ".search_toko", async function () {
  $("#find_toko").modal("hide");
  try {
    const tr = $(this).closest("tr");
    const kode = tr.find("td:eq(1)").text().trim();
    const nama = tr.find("td:eq(2)").text().trim();
    $("#kode_toko").val(kode);
    $("#nama_toko").val(nama);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

$("#show_password").click(function () {
  $(this).is(":checked") ? $('input[name="kata_sandi"]').attr("type", "text") : $('input[name="kata_sandi"]').attr("type", "password");
});

// save
$("#save").click(async function () {
  if (!validasi()) return;
  try {
    const { error, message } = await post_data({
      url: "/user",
      method: "post",
      body: objectToFormData({
        username: $("#nama_pengguna").val(),
        password: $("#kata_sandi").val(),
        kode_group: $("#kode_group").val(),
        kode_toko: $("#kode_toko").val()
      }),
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
  if (!validasi()) return;
  let message_global = '';
  try {
    const aktif = $("input[name='aktif']:checked").val();
    if (aktif == 'false') {
      const confirmation = await Swal.fire({
        title: "Apakah anda yakin?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Non Aktif kan !!!",
        cancelButtonText: "Batalkan !!!",
        input: "textarea",
        inputLabel: "Alasan Non Aktif",
        inputPlaceholder: "Ketikan Alasan Non Aktif di sini...",
        inputAttributes: {
          required: true,
          "aria-label": "Ketikan Alasan Non Aktif di sini...",
        },
        inputValidator: (result) => !result && "Alasan Non Aktif tidak boleh kosong!!!",
      });

      if (!confirmation.isConfirmed) return;
      if (!confirmation.value) throw new Error("Alasan Non Aktif tidak boleh kosong!!!");

      const { error, message } = await put_data({
        url: "/user",
        method: "DELETE",
        body: JSON.stringify({
          username: $("#nama_pengguna").val(),
          old_username: $("#old_username").val(),
          aktif: aktif,
          alasan: confirmation.value,
        }),
      });
      if (error) throw new Error(message);
      message_global = message;
    } else {
      const { error, message } = await put_data({
        url: "/user",
        body: JSON.stringify({
          username: $("#nama_pengguna").val(),
          old_username: $("#old_username").val(),
          password: $("#kata_sandi").val(),
          kode_group: $("#kode_group").val(),
          kode_toko: $("#kode_toko").val(),
          aktif: aktif,
        }),
      });
      if (error) throw new Error(message);
      message_global = message;
      $("#old_username").val($("#nama_pengguna").val());
    }
    swalAlert(message_global, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

// clear
$("#clear").click(clear_screen);

clear_screen();
