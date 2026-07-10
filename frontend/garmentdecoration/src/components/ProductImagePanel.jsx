import { PRODUCT_VIEWS } from '../constants/decorationOptions';

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="gd:h-6 gd:w-6 gd:lg:h-7 gd:lg:w-7" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProductImagePanel({
  activeView,
  onViewChange,
  onClose,
  productTitle,
}) {
  const currentView =
    PRODUCT_VIEWS.find((view) => view.id === activeView) ?? PRODUCT_VIEWS[0];

  return (
    <section
      aria-label="Product preview"
      className="gd-product-panel gd:relative gd:flex gd:min-w-0 gd:flex-1 gd:overflow-hidden gd:bg-[rgb(var(--color-base-background-2))]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close customizer"
        className="gd-interactive gd:absolute gd:top-4 gd:left-4 gd:z-20 gd:text-[rgb(var(--color-base-accent-1))] gd:transition gd:hover:opacity-70 gd:lg:top-6 gd:lg:left-6"
      >
        <CloseIcon />
      </button>

      <div className="gd-product-panel__thumbs gd:absolute gd:z-10 gd:flex gd:gap-3">
        {PRODUCT_VIEWS.map((view) => {
          const isActive = activeView === view.id;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onViewChange(view.id)}
              aria-label={`${view.label} view`}
              aria-pressed={isActive}
              className={['gd-view-thumb', isActive ? 'gd-view-thumb--active' : ''].join(' ')}
            >
              <div className="gd-view-thumb__media">
                <img
                  src={view.image}
                  alt={`${productTitle} ${view.label}`}
                  className="gd:h-14 gd:w-10 gd:object-cover gd:lg:h-20 gd:lg:w-14"
                />
              </div>
              <span className="gd-view-thumb__label">{view.label}</span>
            </button>
          );
        })}
      </div>

      <div className="gd-product-panel__image-wrap gd:flex gd:h-full gd:w-full gd:flex-1 gd:items-center gd:justify-center">
        <img
          key={currentView.id}
          src={currentView.image}
          alt={`${productTitle} ${currentView.label}`}
          className="gd-product-panel__image gd:object-contain"
        />
      </div>
    </section>
  );
}
