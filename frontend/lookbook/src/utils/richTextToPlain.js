export function richTextToPlain(node) {
  if (!node) return '';

  if (typeof node === 'string') return node;

  if (node.type === 'text') return node.value ?? '';

  if (Array.isArray(node.children)) {
    return node.children.map(richTextToPlain).join('');
  }

  return '';
}
