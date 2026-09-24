document.addEventListener('DOMContentLoaded', function() {
  if (window.ArisTheme && typeof window.ArisTheme.init === 'function') {
    window.ArisTheme.init();
  }

  if (window.ArisLanguage && typeof window.ArisLanguage.init === 'function') {
    window.ArisLanguage.init();
  }

  if (window.ArisParticleBackground && typeof window.ArisParticleBackground.init === 'function') {
    window.ArisParticleBackground.init();
  }

  const mobileMenu = window.ArisMobileMenu || window.AeroMobileMenu;
  if (mobileMenu && typeof mobileMenu.init === 'function') {
    mobileMenu.init();
  }

  const scrollAnim = window.ArisScrollAnimations || window.AeroScrollAnimations;
  if (scrollAnim && typeof scrollAnim.init === 'function') {
    scrollAnim.init();
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '' || targetId === '#!' || targetId === '#modalSpecs') return;
      // Las pestañas de Materialize dentro de una modal no deben hacer scroll de la página
      if (this.closest('#modalPruebaGratis')) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  const modalSpecs = document.getElementById('modalSpecs');
  if (modalSpecs) {
    let backdrop = document.querySelector('.modal-backdrop-aris');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop-aris';
      backdrop.style.display = 'none';
      document.body.appendChild(backdrop);
    }

    const openModal = function(e) {
      if (e) e.preventDefault();
      modalSpecs.classList.add('is-open');
      backdrop.style.display = 'block';
      document.body.style.overflow = 'hidden';
    };

    const closeModal = function(e) {
      if (e) e.preventDefault();
      modalSpecs.classList.remove('is-open');
      backdrop.style.display = 'none';
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.modal-trigger').forEach(function(trigger) {
      trigger.addEventListener('click', openModal);
    });

    backdrop.addEventListener('click', closeModal);

    modalSpecs.querySelectorAll('.modal-close').forEach(function(btn) {
      btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modalSpecs.classList.contains('is-open')) {
        closeModal();
      }
    });
  }
});
