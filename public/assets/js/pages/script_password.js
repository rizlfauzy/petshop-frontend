const btn_update = document.getElementById("update");
const btn_password = document.getElementById("kata_sandi");

function post_data({ url, method = "POST", body }) {
  return fetch(url, {
    method,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
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

function objectToFormData(obj) {
  const formData = new FormData();
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      formData.append(property, obj[property]);
    }
  }
  return formData;
}

$("#show_password").click(function () {
  $(this).is(":checked") ? $('input[name="kata_sandi"]').attr("type", "text") : $('input[name="kata_sandi"]').attr("type", "password");
});

btn_password.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    btn_update.click();
  }
});

btn_update.addEventListener("click", async function () {
  try {
    const username = document.getElementById("nama_pengguna").value;
    const password = document.getElementById("kata_sandi").value;

    const formData = objectToFormData({
      username,
      password,
    });

    const { error, message, code } = await post_data({
      url: "api/change/password",
      method: "PUT",
      body: JSON.stringify({ username, password }),
    });

    if (error) throw new Error(message);
    if (code == 500) throw new Error(message);
    return swalAlert(message, "success");
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});

(() => {
  $("#show_password").prop("checked", false);
  $("#show_password").is(":checked") ? $('input[name="kata_sandi"]').attr("type", "text") : $('input[name="kata_sandi"]').attr("type", "password");
})();
