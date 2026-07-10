import { CUSTOMIZE_STEPS } from '../constants/decorationOptions';
import { StepContent } from './StepContent';

const STEP_TITLES = Object.fromEntries(
  CUSTOMIZE_STEPS.map((step) => [step.id, step.label])
);

export function StepExtensionPanel({ activeStep, draft, onDraftChange, onCancel, onSave }) {
  const isOpen = Boolean(activeStep);

  return (
    <aside
      aria-hidden={!isOpen}
      className={[
        'gd-extension-panel-shell gd-theme-border',
        isOpen ? 'gd-is-open' : '',
      ].join(' ')}
    >
      <div className="gd-extension-panel gd-extension-panel-inner gd:flex gd:h-full gd:flex-col">
        <div className="gd-theme-border gd:shrink-0 gd:border-b gd:px-5 gd:py-5 gd:lg:px-8 gd:lg:py-6">
          <h3 className="gd-theme-heading gd:text-2xl gd:font-semibold gd:tracking-tight gd:lg:text-3xl">
            {STEP_TITLES[activeStep] ?? 'Customize'}
          </h3>
        </div>

        <StepContent activeStep={activeStep} draft={draft} onDraftChange={onDraftChange} />

        <div className="gd-theme-border gd:flex gd:shrink-0 gd:flex-col gd:gap-3 gd:border-t gd:px-5 gd:py-5 gd:sm:flex-row gd:lg:gap-4 gd:lg:px-8 gd:lg:py-6">
          <button
            type="button"
            onClick={onCancel}
            className="gd-theme-btn-outline gd-interactive gd:flex-1 gd:px-4 gd:py-3.5 gd:text-sm gd:font-semibold gd:uppercase gd:tracking-wide gd:lg:px-5 gd:lg:py-4 gd:lg:text-base"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="gd-theme-btn-primary gd-interactive gd:flex-1 gd:px-4 gd:py-3.5 gd:text-sm gd:font-semibold gd:uppercase gd:tracking-wide gd:lg:px-5 gd:lg:py-4 gd:lg:text-base"
          >
            Save
          </button>
        </div>
      </div>
    </aside>
  );
}
