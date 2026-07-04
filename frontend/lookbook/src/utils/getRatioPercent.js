export function getRatioPercent(imageRatio, featuredImage) {
  let ratio = 1;

  if (imageRatio === 'portrait') {
    ratio = 0.8;
  } else if (imageRatio === 'square') {
    ratio = 1;
  } else if (imageRatio === 'adapt' && featuredImage?.width && featuredImage?.height) {
    ratio = featuredImage.width / featuredImage.height;
  }

  if (!ratio) ratio = 1;

  return `${(1 / ratio) * 100}%`;
}
