import { FC, useCallback } from 'react';
import { Doc } from '../../@types/search';
import styles from './BriefDocProps.module.css';

interface BriefDocProps {
  doc: Doc;
  onClick: () => void;
  onVote: (delta: 1 | -1) => void;
}

export const BriefDoc: FC<BriefDocProps> = ({ doc, onClick, onVote }) => {
  const onUp = useCallback(() => onVote(1), [onVote]);
  const onDown = useCallback(() => onVote(-1), [onVote]);

  return (
    <div className="flex flex-col items-start m-4 py-8 px-4 min-w-[14em] max-w-[17em]">
      {doc.title && <h3 className="h3-element">{doc.title}</h3>}
      <div className={styles.truncatedText} onClick={onClick}>
        {doc.text}
      </div>
      <div className="mt-2">
        <button onClick={onUp}>up</button>
        <button onClick={onDown}>down</button>
      </div>
      {doc.timestamp && <div className="mt-2">{doc.timestamp}</div>}
    </div>
  );
}
