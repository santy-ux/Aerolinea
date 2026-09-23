window.ArisMobileMenu = window.AeroMobileMenu = {
  init: function() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-drawer a');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = drawer.classList.contains('is-open');
      if (isOpen) {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        drawer.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(e) {
      if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', function() {
      if (window.innerWidth >= 992 && drawer.classList.contains('is-open')) {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  }
};
