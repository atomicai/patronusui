import { FC } from 'react';
import { Doc } from '../../@types/search';

interface SearchResultProps {
  text?: string;
  found: Doc[];
}
export const SearchResult: FC<SearchResultProps> = ({ text, found }) => {
  return (
    <div className="text-white">
      <div className="text-lg font-bold text-center">
        {text}
      </div>
      <div>
        {JSON.stringify(found)}
      </div>
    </div>
  )
};
