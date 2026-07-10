import { COLOR_SWATCHES, SIZE_OPTIONS } from '../constants/decorationOptions';

function ColorStep({ draft, onChange }) {
  return (
    <div className="gd:grid gd:grid-cols-2 gd:gap-x-6 gd:gap-y-8 gd:lg:gap-x-8 gd:lg:gap-y-10 gd:xl:grid-cols-4">
      {COLOR_SWATCHES.map((swatch) => {
        const isActive = draft.color === swatch.id;

        return (
          <button
            key={swatch.id}
            type="button"
            onClick={() => onChange({ ...draft, color: swatch.id })}
            className="gd-interactive gd:flex gd:flex-col gd:items-center gd:gap-4"
          >
            <span
              style={{ backgroundColor: swatch.value }}
              className={[
                'gd-swatch gd:h-16 gd:w-16 gd:rounded-full gd:border gd:border-[rgba(var(--color-base-text),0.15)] gd:transition gd:lg:h-20 gd:lg:w-20',
                isActive ? 'gd-swatch--active' : '',
              ].join(' ')}
            />
            <span className="gd:text-center gd:text-base gd:font-medium gd:lg:text-lg">{swatch.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SizeStep({ draft, onChange }) {
  return (
    <div className="gd:grid gd:max-w-xl gd:grid-cols-3 gd:gap-3 gd:lg:gap-4">
      {SIZE_OPTIONS.map((size) => {
        const isActive = draft.size === size;

        return (
          <button
            key={size}
            type="button"
            onClick={() => onChange({ ...draft, size })}
            className={[
              'gd-interactive gd:rounded-[var(--inputs-radius)] gd:border gd:px-4 gd:py-4 gd:text-base gd:font-medium gd:transition gd:lg:px-5 gd:lg:py-5 gd:lg:text-lg',
              isActive
                ? 'gd:border-[rgb(var(--color-base-accent-1))] gd:bg-[rgb(var(--color-base-background-1))] gd:text-[rgb(var(--color-base-accent-1))]'
                : 'gd:border-[rgba(var(--color-base-text),0.2)] gd:bg-[rgb(var(--color-base-background-1))] gd:hover:border-[rgba(var(--color-base-text),0.35)]',
            ].join(' ')}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

function OptionalStep({ stepId, draft, onChange }) {
  const fieldMap = {
    embroidery: 'embroidery',
    flag: 'flag',
    logo: 'logo',
  };
  const field = fieldMap[stepId];
  const isEnabled = Boolean(draft[field]);

  return (
    <div className="gd:max-w-xl gd:space-y-6">
      <label className="gd-interactive gd:flex gd:items-center gd:gap-4 gd:text-lg">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(event) =>
            onChange({
              ...draft,
              [field]: event.target.checked ? 'enabled' : null,
            })
          }
          className="gd:h-5 gd:w-5 gd:accent-[rgb(var(--color-base-accent-1))]"
        />
        <span>Include this customization</span>
      </label>

      {isEnabled ? (
        <div className="gd:space-y-3">
          <label htmlFor={`gd-${field}-text`} className="gd:block gd:text-lg gd:font-medium">
            {stepId === 'logo' ? 'Logo notes' : 'Text or placement notes'}
          </label>
          <textarea
            id={`gd-${field}-text`}
            rows={5}
            value={draft[`${field}Notes`] ?? ''}
            onChange={(event) =>
              onChange({
                ...draft,
                [`${field}Notes`]: event.target.value,
              })
            }
            placeholder="Add details for this customization"
            className="gd:w-full gd:rounded-[var(--inputs-radius)] gd:border gd:border-[rgba(var(--color-base-text),0.2)] gd:bg-[rgb(var(--color-base-background-1))] gd:px-5 gd:py-4 gd:text-lg gd:outline-none gd:focus:border-[rgb(var(--color-base-accent-1))]"
          />
        </div>
      ) : null}
    </div>
  );
}

export function StepContent({ activeStep, draft, onDraftChange }) {
  if (!activeStep) return null;

  return (
    <div className="gd:min-h-0 gd:flex-1 gd:overflow-y-auto gd:px-5 gd:py-5 gd:lg:px-8 gd:lg:py-8">
      {activeStep === 'color' ? <ColorStep draft={draft} onChange={onDraftChange} /> : null}
      {activeStep === 'size' ? <SizeStep draft={draft} onChange={onDraftChange} /> : null}
      {['embroidery', 'flag', 'logo'].includes(activeStep) ? (
        <OptionalStep stepId={activeStep} draft={draft} onChange={onDraftChange} />
      ) : null}
    </div>
  );
}
