import { richTextToPlain } from './richTextToPlain';

export function getLookbookDescription(lookbook) {
  if (lookbook.descriptionHtml) return { html: lookbook.descriptionHtml };
  if (typeof lookbook.description === 'string' && lookbook.description) {
    return { text: lookbook.description };
  }
  if (lookbook.description && typeof lookbook.description === 'object') {
    const text = richTextToPlain(lookbook.description);
    return text ? { text } : null;
  }
  return null;
}
