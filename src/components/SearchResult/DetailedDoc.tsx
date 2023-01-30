import { FC, ReactNode, useMemo } from 'react';
import { Doc } from '../../@types/search';
import { Tooltip } from './Tooltip';
import styles from './DetailedDoc.module.css';

interface DetailedDocProps {
  doc: Doc;
}

export const DetailedDoc: FC<DetailedDocProps> = ({ doc }) => {
  const highlightedText = useMemo(() => {
    if (!doc.highlight?.length) {
      return doc.text;
    }

    // it is suggested that:
    //  - parts[i].lo <= parts[i].hi
    //  - parts[i].hi < parts[i + 1].lo

    const highlightedText: ReactNode[] = [];
    let idx = 0;
    for (const part of doc.highlight) {
      highlightedText.push(doc.text.substring(idx, part.lo));
      highlightedText.push((
        <Tooltip key={idx} title={part.score}>
          <span>
            {doc.text.substring(part.lo, part.hi + 1)}
          </span>
        </Tooltip>
      ))
      idx = part.hi + 1;
    }
    highlightedText.push(doc.text.substring(idx));

    return highlightedText;
  }, [doc]);

  return (
    <div>
      <div className={styles.highlightedText}>
        {highlightedText}
      </div>
    </div>
  )
}
