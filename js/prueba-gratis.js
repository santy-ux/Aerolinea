// Botón "Prueba gratis" del nav + modal de iniciar sesión / crear usuario.
// Todo se hace con Materialize (cargado desde el CDN en index.html, disponible como window.M).
document.addEventListener('DOMContentLoaded', function() {
  const modalEl = document.getElementById('modalPruebaGratis');
  const boton = document.getElementById('btnPruebaGratis');
  if (!modalEl || !boton || !window.M) return;

  // Colores de Materialize para cada tema (claro / oscuro)
  const colores = {
    light: {
      boton: ['blue', 'darken-2'],
      modal: ['white', 'black-text'],
      pestanas: ['blue-text', 'text-darken-2'],
      indicador: ['blue', 'darken-2']
    },
    dark: {
      boton: ['indigo', 'lighten-1'],
      modal: ['grey', 'darken-4', 'white-text'],
      pestanas: ['indigo-text', 'text-lighten-3'],
      indicador: ['indigo', 'lighten-3']
    }
  };

  const botonesInternos = modalEl.querySelectorAll('button[type="submit"]');
  const enlacesPestanas = modalEl.querySelectorAll('.tabs .tab a');

  function cambiarClases(elemento, quitar, poner) {
    if (!elemento) return;
    elemento.classList.remove.apply(elemento.classList, quitar);
    elemento.classList.add.apply(elemento.classList, poner);
  }

  function aplicarTema() {
    const tema = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const otro = tema === 'dark' ? 'light' : 'dark';
    const nuevo = colores[tema];
    const viejo = colores[otro];

    cambiarClases(boton, viejo.boton, nuevo.boton);
    botonesInternos.forEach(function(b) { cambiarClases(b, viejo.boton, nuevo.boton); });
    cambiarClases(modalEl, viejo.modal, nuevo.modal);
    modalEl.querySelector('.modal-footer').classList.toggle('transparent', true);
    enlacesPestanas.forEach(function(a) { cambiarClases(a, viejo.pestanas, nuevo.pestanas); });
    cambiarClases(modalEl.querySelector('.tabs .indicator'), viejo.indicador, nuevo.indicador);
  }

  // Modal flotante de Materialize
  const modal = M.Modal.init(modalEl, {
    opacity: 0.6,
    onOpenEnd: function() {
      // Las pestañas se inicializan cuando la modal ya es visible para que el indicador se dibuje bien
      M.Tabs.init(modalEl.querySelector('.tabs'));
      aplicarTema();
    }
  });

  boton.addEventListener('click', function(e) {
    e.preventDefault();
    modal.open();
  });

  // Cuando el botón de tema cambia data-theme en <html>, también cambian los colores
  aplicarTema();
  new MutationObserver(aplicarTema).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Formularios (solo demostración: muestra un aviso con M.toast)
  document.getElementById('formIniciarSesion').addEventListener('submit', function(e) {
    e.preventDefault();
    M.toast({ html: 'Sesión iniciada. ¡Bienvenido a tu prueba gratis!' });
    modal.close();
  });

  document.getElementById('formCrearUsuario').addEventListener('submit', function(e) {
    e.preventDefault();
    M.toast({ html: 'Usuario creado. ¡Tu prueba gratis ha comenzado!' });
    modal.close();
  });
});
