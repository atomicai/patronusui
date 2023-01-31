import { FC, ReactNode, useMemo } from 'react';
import { Doc, DocPart } from '../../@types/search';
import { Tooltip } from './Tooltip';
import styles from './DetailedDoc.module.css';

interface DetailedDocProps {
  doc: Doc;
}

export const DetailedDoc: FC<DetailedDocProps> = ({ doc }) => {
  const transformedText = useMemo(() => highlightText(doc.text, doc.highlight || []), [doc]);
  return (
    <div>
      {transformedText}
    </div>
  )
}

const highlightText = (text: string, highlights: DocPart[]) => {
  const highlightedText: ReactNode[] = [];

  // it is suggested that:
  //  - parts[i].lo <= parts[i].hi
  //  - parts[i].hi < parts[i + 1].lo
  let idx = 0;
  for (const part of highlights) {
    highlightedText.push(breakLines(text.substring(idx, part.lo)));
    highlightedText.push((
      <Tooltip key={idx} title={part.score}>
          <div className={styles.highlighted}>
            {breakLines(text.substring(part.lo, part.hi + 1))}
          </div>
      </Tooltip>
    ))
    idx = part.hi + 1;
  }
  highlightedText.push(breakLines(text.substring(idx)));

  return highlightedText;
};

const breakLines = (text: string) => {
  const parts = text.split('\n');
  const result: ReactNode[] = [];
  for (let idx = 0; idx < parts.length; idx++) {
    result.push((
      <div key={idx} className={styles.cue}>
        {decorateActor(parts[idx])}
      </div>
    ))
  }
  return result;
}

const actors = [
  {
    actor: 'operator',
    cssClass: styles.operator,
  },
  {
    actor: 'client',
    cssClass: styles.client,
  },
];

const decorateActor = (text: string, actorIdx = 0) => {
  if (actorIdx === actors.length) {
    return text;
  }

  const { actor, cssClass } = actors[actorIdx];
  const parts = text.split(`${actor}:`);
  const result: ReactNode[] = [];
  let el = parts.shift();
  let key = 0;
  while (el !== undefined) {
    result.push(decorateActor(el, actorIdx + 1));
    result.push(<><span key={key} className={cssClass}>{actor}</span>:</>);
    el = parts.shift();
    key++;
  }
  result.pop();

  return result;
}
