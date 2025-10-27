// Archivo de utilidades del panel admin
// Aquí puedes agregar funciones para hacer fetch a la API del backend, manejar tokens, etc.

async function apiFetch(path, options={}){
  const res = await fetch(path, options);
  if(!res.ok) throw new Error('API error: '+res.status);
  return res.json();
}

// Ejemplo de uso:
// apiFetch('/api/admin/products').then(data=>console.log(data)).catch(err=>console.error(err));

function getAuthToken(){
  try { return localStorage.getItem('authToken'); } catch(e){ return null }
}

async function checkAdminAuth(){
  const token = getAuthToken();
  if(!token){ window.location.href = '../login.html'; return false; }
  try{
    const res = await fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer '+token } });
    if(!res.ok) throw new Error('not authorized');
    const json = await res.json();
    const roles = json.user?.roles || '';
    if(!roles.includes('ADMIN')){ window.location.href = '../login.html'; return false; }
    return true;
  }catch(err){
    console.error('auth check failed', err);
    window.location.href = '../login.html';
    return false;
  }
}
