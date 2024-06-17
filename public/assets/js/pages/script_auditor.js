/* Function ClearScreen */
function ClearScreen() {
  $("#kodeauditor").prop("disabled", false).val("");
  $("#namaauditor").prop("disabled", false).val("");
  $("#aktif").prop("disabled", false);

  $("#update").prop("disabled", true);
  $("#save").prop("disabled", false);

  $(".aktif").hide();
}

// auditor
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

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

$("#namaauditor").on("change", function (e) {
  try {
    const value = e.target.value;

    const arr_value = value.split("(", 2);
    const value_email = arr_value[1] ? arr_value[1].replace(")", "") : "";
    if (!isValidEmail(value_email)) throw new Error("Email tidak valid");
    if (!value_email) throw new Error("Email tidak ditemukan");

    e.target.value = arr_value[0].toUpperCase() + "(" + value_email + ")";
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

/* Save */
document.getElementById("save").addEventListener("click", async function (event) {
  event.preventDefault();
  try {
    const nama = $("#namaauditor").val();

    const { error, message } = await post_data({
      url: "/auditor/save",
      body: objectToFormData({ nama }),
    });

    if (error) return swalAlert(message, "error");
    swalAlert(message, "success");
    ClearScreen();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

/* Cari Data */
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

document.getElementById("find").addEventListener("click", function (event) {
  event.preventDefault();
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

/*Get Data*/
async function get_data(kode) {
  try {
    const { error, message, data } = await post_data({
      url: "/auditor",
      body: objectToFormData({ kode }),
    });
    if (error) return swalAlert(message, "error");
    $("#findauditor").modal("hide");
    $("#kodeauditor").val(data.kode);
    $("#namaauditor").val(data.nama);
    if (data.aktif == "t") $("#aktif").prop("checked", true);
    else $("#tidak_aktif").prop("checked", true);
    $("#update").prop("disabled", false);
    $("#save").prop("disabled", true);
    $(".aktif").show();
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

$(document).on("click", ".searchauditor", async function () {
  const kode = $(this).attr("data-id");
  await get_data(kode);
});

/* Update */
document.getElementById("update").addEventListener("click", async function (event) {
  event.preventDefault();
  try {
    const kode = $("#kodeauditor").val();
    const nama = $("#namaauditor").val();
    const aktif = $('input[name="aktif"]:checked').val();

    const { error, message, data } = await put_data({
      url: "/auditor",
      body: JSON.stringify({ kode, nama, aktif }),
    });

    if (error) return swalAlert(message, "error");
    swalAlert(message, "success");
    await get_data(data.kode);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

/* Clear */
document.getElementById("clear").addEventListener("click", function (event) {
  event.preventDefault();
  ClearScreen();
});

ClearScreen();
