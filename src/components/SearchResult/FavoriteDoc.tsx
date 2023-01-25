import { FC, useCallback } from 'react';
import { Doc } from '../../@types/search';

interface FavoriteDocProps {
  doc: Doc;
  onClick: () => void;
  onVote: (delta: 1 | -1) => void;
}

export const FavoriteDoc: FC<FavoriteDocProps> = ({ doc, onClick, onVote }) => {
  const onUp = useCallback(() => onVote(1), [onVote]);
  const onDown = useCallback(() => onVote(-1), [onVote]);

  return (
    <div>
      {doc.upvote} - <span onClick={onClick}>{doc.text.substring(0, 10)}</span> - <button onClick={onUp}>up</button> - <button onClick={onDown}>down</button>
    </div>
  );
}
