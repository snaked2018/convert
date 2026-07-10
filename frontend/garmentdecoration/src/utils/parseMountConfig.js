export function parseMountConfig(root) {
  const raw = root.dataset.garmentdecorationConfig;
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('[GarmentDecoration] Invalid mount config', error);
    return null;
  }
}
