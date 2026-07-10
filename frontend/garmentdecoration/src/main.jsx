import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GarmentDecorationApp } from './app/GarmentDecorationApp';
import { getGarmentDecorationCredentials } from './api/getGarmentDecorationCredentials';
import { parseMountConfig } from './utils/parseMountConfig';
import './styles/garmentdecoration.css';

function mountGarmentDecoration() {
  const credentials = getGarmentDecorationCredentials();
  if (!credentials) return;

  const roots = document.querySelectorAll(
    '.garmentdecoration-root[data-garmentdecoration-config]'
  );

  if (roots.length === 0) return;

  roots.forEach((root) => {
    if (root.dataset.garmentdecorationMounted === 'true') return;

    const config = parseMountConfig(root);
    if (!config) return;

    root.dataset.garmentdecorationMounted = 'true';

    createRoot(root).render(
      <StrictMode>
        <GarmentDecorationApp credentials={credentials} config={config} />
      </StrictMode>
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountGarmentDecoration);
} else {
  mountGarmentDecoration();
}
