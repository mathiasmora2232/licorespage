// ts/admin/products.ts
var tbody = document.querySelector("#productsTable tbody");
var createForm = document.getElementById("createProductForm");
var createResult = document.getElementById("createResult");
function authHeader() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("authToken");
  if (token)
    headers["Authorization"] = "Bearer " + token;
  return headers;
}
async function fetchProductos() {
  const headers = authHeader();
  const base = typeof window !== "undefined" && window.__API_BASE__ ? window.__API_BASE__ : "";
  const res = await fetch(base + "/api/productos", { headers });
  if (!res.ok)
    throw new Error("fetch productos failed: " + res.status);
  return res.json();
}
function renderProductos(list) {
  if (!tbody)
    return;
  tbody.innerHTML = "";
  list.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id ?? ""}</td>
      <td>${p.nombre}</td>
      <td>${p.precio ?? ""}</td>
      <td>${p.stock ?? ""}</td>
      <td class="product-row-actions">
        <button data-id="${p.id}" class="btn-ghost edit">Editar</button>
        <button data-id="${p.id}" class="btn-ghost del">Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
async function loadAndRender() {
  try {
    const list = await fetchProductos();
    renderProductos(list);
  } catch (err) {
    console.error(err);
    if (createResult)
      createResult.textContent = "No se pudieron cargar productos.";
  }
}
async function createProduct(p) {
  const headers = authHeader();
  const base = typeof window !== "undefined" && window.__API_BASE__ ? window.__API_BASE__ : "";
  const res = await fetch(base + "/api/productos", { method: "POST", headers, body: JSON.stringify(p) });
  if (!res.ok)
    throw new Error("create failed: " + res.status);
  return res.json();
}
async function updateProduct(id, p) {
  const headers = authHeader();
  const base = typeof window !== "undefined" && window.__API_BASE__ ? window.__API_BASE__ : "";
  const res = await fetch(`${base}/api/productos/${id}`, { method: "PUT", headers, body: JSON.stringify(p) });
  if (!res.ok)
    throw new Error("update failed: " + res.status);
  return res.json();
}
async function deleteProduct(id) {
  const headers = authHeader();
  const base = typeof window !== "undefined" && window.__API_BASE__ ? window.__API_BASE__ : "";
  const res = await fetch(`${base}/api/productos/${id}`, { method: "DELETE", headers });
  if (!res.ok && res.status !== 204)
    throw new Error("delete failed: " + res.status);
}
if (createForm) {
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const p = {
      nombre: document.getElementById("pname").value,
      precio: parseFloat(document.getElementById("pprice").value || "0"),
      descripcion: "",
      categoria: ""
    };
    try {
      await createProduct(p);
      if (createResult)
        createResult.textContent = "Producto creado.";
      createForm.reset();
      await loadAndRender();
    } catch (err) {
      console.error(err);
      if (createResult)
        createResult.textContent = "Error al crear producto.";
    }
  });
}
if (tbody) {
  tbody.addEventListener("click", async (e) => {
    const target = e.target;
    if (target.matches(".del")) {
      const id = Number(target.getAttribute("data-id"));
      if (!confirm("\xBFEliminar producto?"))
        return;
      try {
        await deleteProduct(id);
        await loadAndRender();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar");
      }
    }
    if (target.matches(".edit")) {
      const id = Number(target.getAttribute("data-id"));
      const newName = prompt("Nuevo nombre");
      if (newName === null)
        return;
      try {
        await updateProduct(id, { nombre: newName });
        await loadAndRender();
      } catch (err) {
        console.error(err);
        alert("Error al actualizar");
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadAndRender();
});
