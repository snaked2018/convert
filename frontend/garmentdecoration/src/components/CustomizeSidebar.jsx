import { COLOR_SWATCHES, CUSTOMIZE_STEPS, PRODUCT_PRICE } from '../constants/decorationOptions';
import { StepExtensionPanel } from './StepExtensionPanel';

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="gd:h-5 gd:w-5" aria-hidden="true">
      <path
        d="M3 8.5 6.2 11.7 13 4.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 16 16" className="gd:h-5 gd:w-5" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 16 16" className="gd:h-4 gd:w-4" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

const COLOR_LOOKUP = Object.fromEntries(COLOR_SWATCHES.map((color) => [color.id, color]));

function getStepSummary(step, selections) {
  if (step.id === 'color') {
    const color = COLOR_LOOKUP[selections.color];
    return color?.label ?? step.placeholder;
  }

  if (step.id === 'size') {
    return selections.size ?? step.placeholder;
  }

  if (step.id === 'embroidery') {
    return selections.embroidery ? 'Added' : step.placeholder;
  }

  if (step.id === 'flag') {
    return selections.flag ? 'Added' : step.placeholder;
  }

  if (step.id === 'logo') {
    return selections.logo ? 'Added' : step.placeholder;
  }

  return step.placeholder;
}

function isStepComplete(step, selections) {
  if (step.id === 'color') return Boolean(selections.color);
  if (step.id === 'size') return Boolean(selections.size);
  if (step.id === 'embroidery') return Boolean(selections.embroidery);
  if (step.id === 'flag') return Boolean(selections.flag);
  if (step.id === 'logo') return Boolean(selections.logo);
  return false;
}

function StepMenu({ activeStep, selections, onStepSelect }) {
  return (
    <div className="gd:divide-y gd:divide-[rgba(var(--color-base-text),0.15)]">
      {CUSTOMIZE_STEPS.map((step) => {
        const isActive = activeStep === step.id;
        const isComplete = isStepComplete(step, selections);
        const summary = getStepSummary(step, selections);

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onStepSelect(step.id)}
            className={[
              'gd-interactive gd:w-full gd:px-5 gd:py-4 gd:text-left gd:transition gd:lg:px-8 gd:lg:py-5',
              isActive ? 'gd:bg-[rgba(var(--color-base-text),0.06)]' : 'gd:hover:bg-[rgba(var(--color-base-text),0.03)]',
            ].join(' ')}
          >
            <div className="gd:flex gd:items-start gd:justify-between gd:gap-4">
              <div className="gd:flex gd:min-w-0 gd:items-start gd:gap-3 gd:lg:gap-4">
                <span
                  className={[
                    'gd:mt-1 gd:flex gd:h-5 gd:w-5 gd:shrink-0 gd:items-center gd:justify-center',
                    isComplete ? 'gd:text-[rgb(var(--color-base-text))]' : 'gd:text-transparent',
                  ].join(' ')}
                >
                  <CheckIcon />
                </span>

                <span className="gd:min-w-0">
                  <span className="gd:flex gd:items-center gd:gap-2">
                    <span className="gd:text-lg gd:font-medium gd:lg:text-xl">{step.label}</span>
                    {step.optional ? (
                      <span className="gd-theme-text-muted">
                        <InfoIcon />
                      </span>
                    ) : null}
                  </span>
                  <span className="gd-theme-text-muted gd:mt-1 gd:block gd:text-base gd:lg:mt-1.5 gd:lg:text-lg">
                    {summary}
                  </span>
                </span>
              </div>

              <span className="gd-theme-text-muted gd:mt-1 gd:shrink-0 gd:lg:mt-1.5">
                <ChevronRightIcon />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function CustomizeSidebar({
  activeStep,
  selections,
  draft,
  quantity,
  customizationTotal,
  onStepSelect,
  onQuantityChange,
  onDraftChange,
  onCancel,
  onSave,
}) {
  const subtotal = PRODUCT_PRICE + customizationTotal;

  return (
    <div className="gd-sidebar-shell">
      <StepExtensionPanel
        activeStep={activeStep}
        draft={draft}
        onDraftChange={onDraftChange}
        onCancel={onCancel}
        onSave={onSave}
      />

      <aside className="gd-main-sidebar">
        <div className="gd:flex gd:min-h-0 gd:flex-1 gd:flex-col gd:overflow-y-auto">
          <div className="gd-theme-border gd:shrink-0 gd:border-b gd:px-5 gd:py-5 gd:lg:px-8 gd:lg:py-7">
            <h2 className="gd-theme-heading gd:text-2xl gd:font-semibold gd:tracking-tight gd:lg:text-4xl">
              Customize
            </h2>
            <p className="gd-theme-text-muted gd:mt-3 gd:text-base gd:leading-6 gd:lg:mt-4 gd:lg:text-lg gd:lg:leading-7">
              Outfit yourself or your team in custom workwear. For more information and FAQs,{' '}
              <button type="button" className="gd-interactive gd:underline gd:underline-offset-2">
                click here
              </button>
              .
            </p>
          </div>

          <div className="gd:shrink-0">
            <StepMenu
              activeStep={activeStep}
              selections={selections}
              onStepSelect={onStepSelect}
            />
          </div>

          <div className="gd-theme-border gd:shrink-0 gd:border-t gd:px-5 gd:py-5 gd:lg:px-8 gd:lg:py-6">
            <p className="gd:text-lg gd:font-medium gd:lg:text-xl">Quantity</p>
            <div className="gd:mt-3 gd:inline-flex gd:items-center gd:overflow-hidden gd:rounded-[var(--inputs-radius)] gd:border gd:border-[rgba(var(--color-base-text),0.2)] gd:bg-[rgb(var(--color-base-background-1))] gd:lg:mt-4">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="gd-interactive gd:px-4 gd:py-3 gd:text-xl gd:transition gd:hover:bg-[rgba(var(--color-base-text),0.05)] gd:lg:px-5 gd:lg:py-4 gd:lg:text-2xl"
              >
                −
              </button>
              <span className="gd:min-w-10 gd:border-x gd:border-[rgba(var(--color-base-text),0.2)] gd:px-4 gd:py-3 gd:text-center gd:text-lg gd:lg:min-w-12 gd:lg:px-5 gd:lg:py-4 gd:lg:text-xl">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => onQuantityChange(quantity + 1)}
                className="gd-interactive gd:px-4 gd:py-3 gd:text-xl gd:transition gd:hover:bg-[rgba(var(--color-base-text),0.05)] gd:lg:px-5 gd:lg:py-4 gd:lg:text-2xl"
              >
                +
              </button>
            </div>
          </div>

          <div className="gd-theme-border gd:shrink-0 gd:space-y-3 gd:border-t gd:px-5 gd:py-5 gd:text-base gd:lg:space-y-4 gd:lg:px-8 gd:lg:py-6 gd:lg:text-lg">
            <div className="gd:flex gd:items-center gd:justify-between">
              <span>Product</span>
              <span>${PRODUCT_PRICE.toFixed(2)}</span>
            </div>
            <div className="gd:flex gd:items-center gd:justify-between">
              <span>Customizations</span>
              <span>${customizationTotal.toFixed(2)}</span>
            </div>
            <div className="gd:flex gd:items-center gd:justify-between gd:pt-1 gd:text-lg gd:font-semibold gd:lg:text-xl">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="gd-theme-border gd:shrink-0 gd:border-t gd:p-5 gd:lg:p-8">
          <button
            type="button"
            className="gd-theme-btn-primary gd-interactive gd:w-full gd:px-4 gd:py-4 gd:text-sm gd:font-semibold gd:uppercase gd:tracking-[0.18em] gd:lg:px-5 gd:lg:py-5 gd:lg:text-base"
          >
            Add to cart
          </button>
        </div>
      </aside>
    </div>
  );
}
