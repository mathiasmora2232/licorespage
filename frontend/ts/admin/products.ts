// No import: usamos localStorage directamente para el token

type Producto = {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  imagen?: string;
  categoria?: string;
};

const tbody = document.querySelector('#productsTable tbody') as HTMLTableSectionElement | null;
const createForm = document.getElementById('createProductForm') as HTMLFormElement | null;
const createResult = document.getElementById('createResult') as HTMLElement | null;

function authHeader(): Record<string,string> {
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('authToken');
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

async function fetchProductos(): Promise<Producto[]>{
  const headers = authHeader();
  const base = (typeof window !== 'undefined' && (window as any).__API_BASE__) ? (window as any).__API_BASE__ : '';
  const res = await fetch(base + '/api/productos', { headers });
  if(!res.ok) throw new Error('fetch productos failed: '+res.status);
  return res.json();
}

function renderProductos(list: Producto[]){
  if(!tbody) return;
  tbody.innerHTML = '';
  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id ?? ''}</td>
      <td>${p.nombre}</td>
      <td>${p.precio ?? ''}</td>
      <td>${(p as any).stock ?? ''}</td>
      <td class="product-row-actions">
        <button data-id="${p.id}" class="btn-ghost edit">Editar</button>
        <button data-id="${p.id}" class="btn-ghost del">Borrar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function loadAndRender(){
  try{
    const list = await fetchProductos();
    renderProductos(list);
  }catch(err){
    console.error(err);
    if(createResult) createResult.textContent = 'No se pudieron cargar productos.';
  }
}

async function createProduct(p: Producto){
  const headers = authHeader();
  const base = (typeof window !== 'undefined' && (window as any).__API_BASE__) ? (window as any).__API_BASE__ : '';
  const res = await fetch(base + '/api/productos', { method: 'POST', headers, body: JSON.stringify(p) });
  if(!res.ok) throw new Error('create failed: '+res.status);
  return res.json();
}

async function updateProduct(id: number, p: Partial<Producto>){
  const headers = authHeader();
  const base = (typeof window !== 'undefined' && (window as any).__API_BASE__) ? (window as any).__API_BASE__ : '';
  const res = await fetch(`${base}/api/productos/${id}`, { method: 'PUT', headers, body: JSON.stringify(p) });
  if(!res.ok) throw new Error('update failed: '+res.status);
  return res.json();
}

async function deleteProduct(id: number){
  const headers = authHeader();
  const base = (typeof window !== 'undefined' && (window as any).__API_BASE__) ? (window as any).__API_BASE__ : '';
  const res = await fetch(`${base}/api/productos/${id}`, { method: 'DELETE', headers });
  if(!res.ok && res.status !== 204) throw new Error('delete failed: '+res.status);
}

// Event handlers
if(createForm){
  createForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const p: Producto = {
      nombre: (document.getElementById('pname') as HTMLInputElement).value,
      precio: parseFloat((document.getElementById('pprice') as HTMLInputElement).value || '0'),
      descripcion: '' ,
      categoria: ''
    };
    try{
      await createProduct(p);
      if(createResult) createResult.textContent = 'Producto creado.';
      createForm.reset();
      await loadAndRender();
    }catch(err){
      console.error(err);
      if(createResult) createResult.textContent = 'Error al crear producto.';
    }
  });
}

if(tbody){
  tbody.addEventListener('click', async (e)=>{
    const target = e.target as HTMLElement;
    if(target.matches('.del')){
      const id = Number(target.getAttribute('data-id'));
      if(!confirm('¿Eliminar producto?')) return;
      try{
        await deleteProduct(id);
        await loadAndRender();
      }catch(err){ console.error(err); alert('Error al eliminar'); }
    }
    if(target.matches('.edit')){
      const id = Number(target.getAttribute('data-id'));
      const newName = prompt('Nuevo nombre');
      if(newName===null) return;
      try{
        await updateProduct(id, { nombre: newName });
        await loadAndRender();
      }catch(err){ console.error(err); alert('Error al actualizar'); }
    }
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', ()=>{
  loadAndRender();
});

// Export for bundlers
export {};
