async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!data.token) {
    document.getElementById("msg").innerText = "Login failed";
    return;
  }

  localStorage.setItem("token", data.token);
  window.location.href = "/dashboard.html";
}

async function checkToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/index.html";
    return;
  }

  const res = await fetch("/api/protected", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  document.getElementById("status").innerText =
    data.message || "Invalid token";
}

// run only on dashboard
if (window.location.pathname.includes("dashboard")) {
  checkToken();
}
