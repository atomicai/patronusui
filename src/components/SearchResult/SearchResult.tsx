import { FC } from 'react';

interface SearchResultProps {
  text?: string;
}
export const SearchResult: FC<SearchResultProps> = ({ text }) => {
  return (
    <div className="text-white">
      <div className="text-lg font-bold text-center">
        {text}
      </div>
    </div>
  )
};
