import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { mergeLookbookConfig } from './api/lookbookThemeConfig';
import { getLookbookCredentials } from './api/lookbookCredentials';
import { LookbookSection } from './components/LookbookSection';
import { initLookbookCarousels } from './initLookbookCarousels';
import './styles/lookbook.css';

function mountLookbooks() {
  let credentials;

  try {
    credentials = getLookbookCredentials();
  } catch (err) {
    console.error(err.message);
    return;
  }

  document.querySelectorAll('.lookbook-root[data-lookbook-config]').forEach((el) => {
    if (el.dataset.lookbookMounted === 'true') return;

    try {
      const mountConfig = JSON.parse(el.dataset.lookbookConfig);
      const config = mergeLookbookConfig(mountConfig);

      createRoot(el).render(
        <StrictMode>
          <LookbookSection config={config} credentials={credentials} />
        </StrictMode>
      );

      el.dataset.lookbookMounted = 'true';
    } catch (err) {
      console.error('[Lookbook] Failed to mount', err);
    }
  });

  initLookbookCarousels();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLookbooks);
} else {
  mountLookbooks();
}
