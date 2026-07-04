import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { getLookbookCredentials } from './api/lookbookCredentials';
import { LookbookSection } from './components/lookbookSection';
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
    try {
      const config = JSON.parse(el.dataset.lookbookConfig);

      createRoot(el).render(
        <StrictMode>
          <LookbookSection config={config} credentials={credentials} />
        </StrictMode>
      );
    } catch (err) {
      console.error('[Lookbook] Failed to mount', err);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountLookbooks);
} else {
  mountLookbooks();
}