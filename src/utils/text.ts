import { DocPart } from '../@types/search';

export const wrapTextParts = (text: string, parts?: DocPart[], tag = 'span') => {
  if (!parts?.length) {
    return text;
  }

  // it is suggested that:
  //  - parts[i].lo <= parts[i].hi
  //  - parts[i].hi < parts[i + 1].lo

  let wrappedText = '';
  let idx = 0;
  for (const part of parts) {
    wrappedText += `${text.substring(idx, part.lo)}<${tag} title="${part.score || ''}">${text.substring(part.lo, part.hi)}</${tag}>`;
    idx = part.hi;
  }
  wrappedText += text.substring(idx);

  return wrappedText;
}
