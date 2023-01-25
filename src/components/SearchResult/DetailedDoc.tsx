import { FC, useMemo } from 'react';
import { Doc } from '../../@types/search';
import { wrapTextParts } from '../../utils/text';
import styles from './DetailedDoc.module.css';

interface DetailedDocProps {
  doc: Doc;
}

export const DetailedDoc: FC<DetailedDocProps> = ({ doc }) => {
  const highlighted = useMemo(() => wrapTextParts(doc.text, doc.highlight), [doc]);
  return (
    <div>
      <div className={styles.highlightedText} dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  )
}
