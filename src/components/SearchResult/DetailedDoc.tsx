import { FC, ReactNode, useMemo } from 'react';
import { Doc, DocPartColor } from '../../@types/search';
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
  //  - there is no '\n' between lo and hi indexes
  //  - parts[i].lo < parts[i].hi
  //  - parts[i].hi < parts[i + 1].lo
  let idx = 0;
  for (const part of (doc.highlight || [])) {
    highlightedText.push(breakLines(doc.text.substring(idx, part.lo)));
    highlightedText.push((
      <Tooltip key={idx} title={part.score}>
          <span className={styles[part.color ? `color${part.color}` : DocPartColor.highlighted]}>
            {doc.text.substring(part.lo, part.hi)}
          </span>
      </Tooltip>
    ))
    idx = part.hi + 1;
  }
  highlightedText.push(breakLines(doc.text.substring(idx)));

  return highlightedText;
};

const breakLines = (text: string) => {
  const parts = text.split('\n');
  const result: ReactNode[] = [];
  for (const part of parts) {
    result.push(part);
    result.push(<div className={styles.newLine} />);
  }
  result.pop();
  return result;
}
