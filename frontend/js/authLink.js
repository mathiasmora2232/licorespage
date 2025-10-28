// Ajusta los enlaces "Cuenta" según si hay token de sesión en localStorage
(function(){
  function updateAccountLinks(){
    const hasToken = !!localStorage.getItem('authToken');
    // Buscamos enlaces con la palabra "Cuenta" en su texto o con clase nav-icon
    document.querySelectorAll('a').forEach(a=>{
      const text = (a.textContent||'').trim();
      if(text.startsWith('Cuenta') || text === 'Cuenta'){
        a.setAttribute('href', hasToken ? 'cuenta.html' : 'login.html');
      }
    });
  }
  document.addEventListener('DOMContentLoaded', updateAccountLinks);
  // También actualiza si cambian storage en otra pestaña
  window.addEventListener('storage', updateAccountLinks);
})();
