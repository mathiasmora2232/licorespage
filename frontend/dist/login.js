// ts/auth.ts
async function apiLogin(email, password) {
  const base = typeof window !== "undefined" && window.__API_BASE__ ? window.__API_BASE__ : "";
  try {
    const res = await fetch(base + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    const json = await res.json();
    return json;
  } catch (err) {
    if (email === "admin@demo" && password === "admin") {
      return { token: "mock-admin-token", user: { name: "Administrador", roles: ["ADMIN"] } };
    }
    if (email === "user@demo" && password === "user") {
      return { token: "mock-user-token", user: { name: "Usuario demo", roles: ["USER"] } };
    }
    throw err;
  }
}
function saveToken(token) {
  try {
    localStorage.setItem("authToken", token);
  } catch (e) {
  }
}

// ts/login.ts
var form = document.getElementById("loginForm");
var resultEl = document.getElementById("loginResult");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    if (!email || !password) {
      if (resultEl)
        resultEl.textContent = "Completa email y contrase\xF1a.";
      return;
    }
    try {
      if (resultEl)
        resultEl.textContent = "Iniciando sesi\xF3n...";
      const res = await apiLogin(email, password);
      saveToken(res.token);
      if (resultEl)
        resultEl.textContent = "Inicio exitoso. Redirigiendo...";
      const isAdmin = res.user?.roles?.includes("ADMIN");
      setTimeout(() => {
        window.location.href = isAdmin ? "admin/index.html" : "cuenta.html";
      }, 500);
    } catch (err) {
      console.error(err);
      if (resultEl)
        resultEl.textContent = "Correo o contrase\xF1a incorrectos (o backend no disponible).";
    }
  });
}
