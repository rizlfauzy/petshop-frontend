const form_login = document.getElementById("form_login");

function post_data({ url, method = "POST", body }) {
  return fetch(url, {
    method,
    mode: "cors",
    headers: {
      "X-CSRF-TOKEN": document.querySelector('meta[name="X-CSRF-TOKEN"]').content,
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
  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });
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

form_login.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    const form_data = new FormData(this);
    const url = this.action;
    const method = this.method;
    const { error, message, data } = await post_data({ url, method, body: form_data });
    if (error) throw new Error(message);
    swalAlert(message, "success");
    setTimeout(() => {
      if (data == '/') {console.log('test'); location.href = data;}
      else location.reload();
    }, 800);
  } catch (e) {
    return swalAlert(e.message, "error");
  }
});
