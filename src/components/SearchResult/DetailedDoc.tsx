import { FC, ReactNode, useMemo } from 'react';
import { Doc } from '../../@types/search';
import { Tooltip } from './Tooltip';
import styles from './DetailedDoc.module.css';

interface DetailedDocProps {
  doc: Doc;
}

export const DetailedDoc: FC<DetailedDocProps> = ({ doc }) => {
  const transformedText = useMemo(() => highlightText(doc), [doc]);
  return (
    <div>
      {transformedText}
    </div>
  )
}

const highlightText = (doc: Doc) => {
  const highlightedText: ReactNode[] = [];

  // it is suggested that:
  //  - parts[i].lo <= parts[i].hi
  //  - parts[i].hi < parts[i + 1].lo
  let idx = 0;
  for (const part of (doc.highlight || [])) {
    highlightedText.push(breakLines(doc.text.substring(idx, part.lo), doc));
    highlightedText.push((
      <Tooltip key={idx} title={part.score}>
          <div className={styles.highlighted}>
            {breakLines(doc.text.substring(part.lo, part.hi + 1), doc)}
          </div>
      </Tooltip>
    ))
    idx = part.hi + 1;
  }
  highlightedText.push(breakLines(doc.text.substring(idx), doc));

  return highlightedText;
};

const breakLines = (text: string, doc: Doc) => {
  const parts = text.split('\n');
  const result: ReactNode[] = [];
  for (let idx = 0; idx < parts.length; idx++) {
    result.push((
      <div key={idx} className={styles.cue}>
        {decorateActor(parts[idx], doc.colorify || [])}
      </div>
    ))
  }
  return result;
}

const decorateActor = (text: string, actors: string[], actorIdx = 0) => {
  if (actorIdx >= actors.length) {
    return text;
  }

  const actor = actors[actorIdx];
  const parts = text.split(actor);
  const result: ReactNode[] = [];
  let el = parts.shift();
  let key = 0;
  while (el !== undefined) {
    result.push(decorateActor(el, actors, actorIdx + 1));
    result.push(<span key={key} className={styles[`actor${actorIdx % 3}`]}>{actor}</span>);
    el = parts.shift();
    key++;
  }
  result.pop();

  return result;
}
