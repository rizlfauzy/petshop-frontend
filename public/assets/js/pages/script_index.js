$(document).idle({
  onIdle: function () {
    location.href = "/api/logout";
  },
  idle: 18000000,
});
const add = $("#fitur_add").val();
const update = $("#fitur_update").val();
const cancel = $("#fitur_cancel").val();
const accept = $("#fitur_accept").val();
const backdate = $("#fitur_backdate").val();

if (add == "f") $("#save").hide();
if (update == "f") $("#update").hide();
if (cancel == "f") $("#cancel").hide();
if (backdate == "f") {
  $("#tanggal").prop("disabled", true);
  $("#cari_tanggal").hide();
} else {
  $("#tanggal").prop("disabled", false);
  $("#cari_tanggal").show();
}
if ($("#cabang").val() == "") {
  window.open("/api/logout", "_self");
}
$(".close").click(function () {
  $(".modal-backdrop").remove();
});

let delay_search_data = null;

function post_data({ url, method = "POST", body }) {
  return fetch(`/ci-4${url}`, {
    method,
    mode: "cors",
    headers: {
      "X-CSRF-TOKEN": $('meta[name="X-CSRF-TOKEN"]').attr("content"),
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 302) window.location.reload();
      if (res.ok) return res;
      return res;
    });
}

function put_data({ url, body, method = "PUT"}) {
  return fetch(`/ci-4${url}`, {
    method,
    mode: "cors",
    headers: {
      "X-CSRF-TOKEN": $('meta[name="X-CSRF-TOKEN"]').attr("content"),
      "Content-Type": "application/json",
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === 302) window.location.reload();
      if (res.ok) return res;
      return res;
    });
}

function objectToFormData(obj) {
  const formData = new FormData();
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      formData.append(property, obj[property]);
    }
  }
  return formData;
}

function swalAlert(msg, type) {
  Swal.fire({
    toast: true,
    showConfirmButton: false,
    position: "top-end",
    text: msg,
    icon: type,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
}

function loading_spinner(element, colspan, is_loading = true) {
  if (is_loading) {
    document.querySelector(element).innerHTML = `
					<tr>
						<td colspan='${colspan}'>
							<div class="d-flex justify-content-center">
								<div class="loader_for_table" role="status">
								</div>
								<span class="sr-only">Loading...</span>
							</div>
						</td>
					</tr>
				`;
  }
}

function template_pagination(total_data_wrapper, group, limit, total, wrapper, func, pagination = null) {
  $(total_data_wrapper).html(`
			<div>Data yang tampil <span>${limit}</span> dari total <span>${total}</span> baris</div>
		`);
  $(wrapper).html(pagination);
  const page_link = document.querySelectorAll(`${wrapper} .page-link.page-link-custom`);
  if (page_link.length == 1) {
    $(wrapper).html("");
    return;
  }
  $(wrapper)
    .children(0)
    .children(0)
    .html(
      [...page_link]
        .map((item) => {
          const li = item.parentElement;
          const is_active = li.classList[1] == "active" ? "active disabled" : "";
          const url = new URL(item.href);
          const params = url.searchParams.get(`page_${group}`);
          return `
					<li class="page-item ${is_active}">
						<a class="page-link page-link-custom" href="javascript:${func}(${params})">${item.innerHTML}</a>
					</li>
				`;
        })
        .join("")
    );
}

function template_table({ element, items, pagination = "", name_btn, fields, tag_pagi, colspan, ...funct }) {
  document.querySelector(element).innerHTML =
    items.length > 0
      ? items
          .map((item) => {
            return `
					<tr>
						${
              name_btn == ""
                ? ""
                : `
            <td class="text-center">
							<button class="btn ${name_btn}" style="margin: 0px;background-color:salmon; color:#fff;" data-id="${item[fields[0]]}"><i class="far fa-check-circle"></i></button>
						</td>`
            }
						${fields
              .map((field, index) => {
                return `<td>${funct[index] ? funct[index](item) : item[field]}</td>`;
              })
              .join("")}
					</tr>
				`;
          })
          .join("")
      : `
				<tr>
					<td colspan="${colspan}" class="text-center">Tidak ada data</td>
				</tr>
			`;

  $(tag_pagi).html(pagination);
}

async function get_search_table({ keyword, field, table, wheres, likes, order_by, group, loading_spinner, select_limit, rows = "0" }) {
  try {
    const form_data = objectToFormData({
      selects: JSON.stringify(field),
      limit: Number(select_limit),
      offset: "",
      table,
      wheres: JSON.stringify(wheres),
      likes: JSON.stringify(likes),
      keyword,
      order_by: JSON.stringify(order_by),
      group,
    });

    const {
      error: error_table,
      message: message_table,
      data: list,
      pagination,
      total_rows,
    } = await post_data({
      url: `/util/table/search?page_${group}=${rows}`,
      body: form_data,
    });

    if (error_table) return swalAlert(message_table, "error");
    loading_spinner;
    return {
      list,
      pagination,
      total_rows,
    };
  } catch (e) {
    return swalAlert(e.message, "error");
  }
}

function getLocalStorage(name_storage) {
  return JSON.parse(localStorage.getItem(name_storage)) || [];
}

function selectLocalStorage(name_storage, kode) {
  const items = getLocalStorage(name_storage);
  const is_have = items.filter((item) => item.kode === kode);
  if (is_have.length > 0) return is_have[0];
  return null;
}

function saveLocalStorage(name_storage, item, id) {
  const items = getLocalStorage(name_storage);
  const is_have = items.filter((item) => item.kode === id);
  if (is_have.length > 0) return;
  items.push(item);
  localStorage.setItem(name_storage, JSON.stringify(items));
}

function editLocalStorage(name_storage, item, id) {
  const items = getLocalStorage(name_storage);
  const delete_items = items.filter((item) => item.kode !== id);
  delete_items.push(item);
  localStorage.setItem(name_storage, JSON.stringify(delete_items));
}

function deleteLocalStorage(name_storage, id) {
  const items = getLocalStorage(name_storage);
  const delete_items = items.filter((item) => item.kode !== id);
  localStorage.setItem(name_storage, JSON.stringify(delete_items));
}

function resetLocalStorage(name_storage) {
  localStorage.setItem(name_storage, JSON.stringify([]));
}

function clearAllLocalStorage() {
  localStorage.clear();
}

/* Format Rupiah */
function FormatRupiah(angka, prefix) {
  if (!angka) {
    return "";
  }
  const vangka = angka.toString();
  let number_string = vangka
      .replace(/[^.\d]/g, "")
      .replace(/[^\w\s]/gi, "")
      .toString(),
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? "," : "";
    rupiah += separator + ribuan.join(",");
  }

  rupiah = split[1] != undefined ? rupiah + "." + split[1] : rupiah;
  return prefix == undefined ? rupiah : rupiah ? rupiah : "";
}

/* DeFormat Rupiah */
function DeFormatRupiah(angka) {
  return angka.replace(/[^\w\s]/gi, "");
}

function inputRupiah(element) {
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
  if (value.length < 1) {
    element.value = 0;
    // return;
  }
}
