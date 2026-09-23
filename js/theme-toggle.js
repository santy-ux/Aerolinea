window.ArisTheme = {
  currentTheme: 'light',

  init: function() {
    const saved = localStorage.getItem('aris_theme');
    if (saved === 'dark' || saved === 'light') {
      this.currentTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }

    this.applyTheme(this.currentTheme, false);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(next, true);
      });
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('aris_theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  },

  applyTheme: function(theme, save = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }

    if (save) {
      try { localStorage.setItem('aris_theme', theme); } catch (_) {}
    }

    const isDark = theme === 'dark';
    const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

    const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
      btn.innerHTML = isDark ? sunSvg : moonSvg;
    });
  }
};
