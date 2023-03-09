import { FC, useCallback } from 'react';
import { Doc } from '../../@types/search';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import styles from './SnippetDoc.module.css';

export type SnippetStyleIndexes =  0 | 1 | 2 | 3;

interface SnippetDocProps {
  doc: Doc;
  onClick: () => void;
  onVote: (delta: 1 | -1) => void;
  styleIdx: SnippetStyleIndexes;
}

const textDelta = 200;

export const SnippetDoc: FC<SnippetDocProps> = ({ doc, onClick, onVote, styleIdx }) => {
  const onUp = useCallback(() => onVote(1), [onVote]);
  const onDown = useCallback(() => onVote(-1), [onVote]);

  const [start, finish] = ((doc.highlight_idx !== undefined) && doc.highlight?.length && doc.highlight[doc.highlight_idx])
    ? [doc.highlight[doc.highlight_idx].lo, doc.highlight[doc.highlight_idx].hi]
    : [0, 0];

  return <div className={`${styles.wrapper} ${styles[`wrapperStyle${styleIdx}`]}`}>
    <div className={`flex justify-between items-center ${styles.header}`}>
      <div>{doc.title} {doc.title && doc.label && <span className={`${styles.vs} ${styles.vsColor}`}>vs</span>} {doc.label}</div>
      <div className={styles.vsColor}>{doc.doc_score || doc.score}</div>
    </div>
    <div className={styles.truncatedText} onClick={onClick}>
      {(start - textDelta) > 0 ? '... ' : ''}
      {doc.text.substring(start - textDelta, start)}
      <span className={styles.highlighted}>{doc.text.substring(start, finish)}</span>
      {doc.text.substring(finish, finish + textDelta)}
      {(finish + textDelta) < doc.text.length ? ' ...' : ''}
    </div>
    <div className="flex justify-between items-center">
      <div>{doc.timestamp}</div>
      <div>
        <button className="mr-2 hover:text-primary" onClick={onUp}><HandThumbUpIcon className="w-8 h-8" /></button>
        <button className="hover:text-primary" onClick={onDown}><HandThumbDownIcon className="w-8 h-8" /></button>
      </div>
    </div>
  </div>;
};
