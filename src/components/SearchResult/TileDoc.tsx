import { FC, useCallback, useState } from 'react';
import { Doc } from '../../@types/search';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import styles from './TileDoc.module.css';

export type TileStyleIndexes =  0 | 1 | 2 | 3;

interface TileDocProps {
  doc: Doc;
  onClick: () => void;
  onVote: (delta: 1 | -1) => void;
  styleIdx: TileStyleIndexes;
}

export const TileDoc: FC<TileDocProps> = ({ doc, onClick, onVote, styleIdx }) => {
  const [isMouseOver, setIsMouseOver] = useState(false);

  const onUp = useCallback(() => onVote(1), [onVote]);
  const onDown = useCallback(() => onVote(-1), [onVote]);

  return (
    <div
      className={`${styles.wrapper} ${styles[`wrapperStyle${styleIdx}`]}`}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
    >
      {doc.title && <h3>{doc.title}</h3>}
      <div className={styles.truncatedText} onClick={onClick}>
        {doc.text}
      </div>
      <div className="my-2 h-8">
        {isMouseOver && (
          <>
            <button className="mr-2 hover:text-primary" onClick={onUp}><HandThumbUpIcon className="w-8 h-8" /></button>
            <button className="hover:text-primary" onClick={onDown}><HandThumbDownIcon className="w-8 h-8" /></button>
          </>
        )}
      </div>
      <div className="flex justify-between items-center w-full">
        <div>{doc.timestamp}</div>
        <div>{doc.doc_score || doc.score}</div>
      </div>
    </div>
  );
}
