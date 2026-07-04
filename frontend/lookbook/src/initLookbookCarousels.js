export function initLookbookCarousels() {
  document.querySelectorAll('[data-lookbook-carousel]').forEach((carousel) => {
    if (carousel.dataset.lookbookCarouselInit === 'true') return;

    const tabs = [...carousel.querySelectorAll('[data-lookbook-tab]')];
    const bannerPanels = [...carousel.querySelectorAll('[data-lookbook-banner-panel]')];
    const gridPanels = [...carousel.querySelectorAll('[data-lookbook-panel]')];

    if (tabs.length <= 1) return;

    function activate(index) {
      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle('lookbook-carousel__tab--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      bannerPanels.forEach((panel) => {
        const panelIndex = Number(panel.dataset.lookbookBannerPanel);
        panel.classList.toggle('lookbook-carousel__panel--hidden', panelIndex !== index);
      });

      gridPanels.forEach((panel, panelIndex) => {
        panel.classList.toggle('lookbook-carousel__panel--hidden', panelIndex !== index);
      });
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index));
    });

    activate(0);

    carousel.dataset.lookbookCarouselInit = 'true';
  });
}
