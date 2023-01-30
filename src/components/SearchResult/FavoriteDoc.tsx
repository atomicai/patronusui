import { FC, useCallback } from 'react';
import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { Doc } from '../../@types/search';
import styles from './FavoriteDoc.module.css';

interface FavoriteDocProps {
  doc: Doc;
  onClick: () => void;
  onVote: (delta: 1 | -1) => void;
}

export const FavoriteDoc: FC<FavoriteDocProps> = ({ doc, onClick, onVote }) => {
  const onUp = useCallback(() => onVote(1), [onVote]);
  const onDown = useCallback(() => onVote(-1), [onVote]);

  return (
    <div className="flex justify-between items-center">
      <div className="mr-2 flex items-center">
        <div className={styles.upvote}>{doc.upvote}</div>
        <div className="hover:cursor-pointer truncate max-w-[20em]" onClick={onClick}>{doc.text}</div>
        {/*<div className="hover:cursor-pointer truncate" onClick={onClick}>{doc.text}</div>*/}
      </div>
      <div className="shrink-0 mt-1">
        <button className="mr-2 hover:text-primary" onClick={onUp}><HandThumbUpIcon className="w-4 h-4" /></button>
        <button className="hover:text-primary" onClick={onDown}><HandThumbDownIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
