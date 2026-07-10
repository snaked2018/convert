import { useMemo, useState } from 'react';
import { CustomizeSidebar } from '../components/CustomizeSidebar';
import { ProductImagePanel } from '../components/ProductImagePanel';

const INITIAL_SELECTIONS = {
  color: 'obsidian',
  size: null,
  embroidery: null,
  flag: null,
  logo: null,
  embroideryNotes: '',
  flagNotes: '',
  logoNotes: '',
};

function calculateCustomizationTotal(selections) {
  let total = 0;

  if (selections.embroidery) total += 12;
  if (selections.flag) total += 8;
  if (selections.logo) total += 15;

  return total;
}

function closeModal(sectionId) {
  const closeButton = document.getElementById(`ModalClose-garmentdecoration-${sectionId}`);
  closeButton?.click();
}

export function GarmentDecorationApp({ config }) {
  const [activeStep, setActiveStep] = useState(null);
  const [activeView, setActiveView] = useState('front');
  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const [draft, setDraft] = useState(INITIAL_SELECTIONS);
  const [quantity, setQuantity] = useState(1);

  const customizationTotal = useMemo(
    () => calculateCustomizationTotal(selections),
    [selections]
  );

  function openStep(stepId) {
    setDraft({ ...selections });
    setActiveStep(stepId);
  }

  function handleCancel() {
    setDraft({ ...selections });
    setActiveStep(null);
  }

  function handleSave() {
    setSelections({ ...draft });
    setActiveStep(null);
  }

  return (
    <div className="gd-app gd:flex gd:h-full gd:min-h-0 gd:flex-col gd:overflow-hidden gd:bg-[rgb(var(--color-base-background-1))]">
      <div className="gd-layout-shell gd:flex gd:min-h-0 gd:flex-1">
        <ProductImagePanel
          activeView={activeView}
          onViewChange={setActiveView}
          onClose={() => closeModal(config.sectionId)}
          productTitle={config.productTitle}
        />

        <CustomizeSidebar
          activeStep={activeStep}
          selections={selections}
          draft={draft}
          quantity={quantity}
          customizationTotal={customizationTotal}
          onStepSelect={openStep}
          onQuantityChange={setQuantity}
          onDraftChange={setDraft}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
