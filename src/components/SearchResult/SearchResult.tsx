import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Doc } from '../../@types/search';
import { DetailedDoc } from './DetailedDoc';
import { BriefDoc } from './BriefDoc';
import { FavoriteDoc } from './FavoriteDoc';

interface SearchResultProps {
  title?: string;
  found: Doc[];
}
export const SearchResult: FC<SearchResultProps> = ({ title, found }) => {
  const [list, setList] = useState<Doc[]>([]);
  const [favorites, setFavorites] = useState<Doc[]>([]);
  const [detailedDoc, setDetailedDoc] = useState<Doc | null>(null);

  useEffect(() => {
    setList([...found]);
    setFavorites([]);
  }, [found]);

  const handleVote = (docToHandle: Doc, delta: 1 | -1) => {
    if (delta > 0) {
      if (list.includes(docToHandle)) {
        setList((prev) => prev.filter(item => item !== docToHandle));
        docToHandle.upvote = 1;
        setFavorites((prev) => [...prev, docToHandle]);
      } else {
        docToHandle.upvote!++;
        setFavorites((prev) => [...prev]);
      }
    } else {
      const currentUpVote = favorites.find(doc => doc === docToHandle)?.upvote || 0;
      if (currentUpVote > 1) {
        docToHandle.upvote!--;
        setFavorites((prev) => [...prev]);
      } else if (currentUpVote === 1) {
        setFavorites(prev => prev.filter((doc) => doc !== docToHandle));
        docToHandle.upvote = undefined;
        setList((prev) => [...prev, docToHandle]);
      } else {
        setList(prev => prev.filter((doc) => doc !== docToHandle));
      }
    }
  };

  const handleDownload = async () => {
    try {
      const filename = await axios
        .post<{ filename: string }>('/snapshotting', { docs: favorites })
        .then((res) => res.data.filename);
      window.open(`/downloading/${filename}`);  // is not working in development mode (for example without running under flask)
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="w-full h-full">
      {title && <div className="text-lg font-bold text-center mb-4">{title}</div>}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {
            found.length
              ? (
                <div className="flex flex-wrap justify-center items-center">
                  {list.map((item, idx) => (
                    <BriefDoc key={idx} doc={item} onClick={() => setDetailedDoc(item)} onVote={(delta) => handleVote(item, delta)} />
                  ))}
                </div>
              )
              : <div className="text-center my-8">Nothing is found</div>
          }
        </div>
        <div className="border-[#A456F0] border-l p-4 pl-8">
          {
            detailedDoc
              ? (
                <div>
                  <button onClick={() => setDetailedDoc(null)}>close</button>
                  <DetailedDoc doc={detailedDoc} />
                </div>
              )
              : (
                <div>
                  {!!favorites.length && <button onClick={handleDownload}>download</button>}
                  {favorites.map((doc, idx) => (
                    <FavoriteDoc key={idx} doc={doc} onClick={() => setDetailedDoc(doc)} onVote={(delta) => handleVote(doc, delta)} />
                  ))}
                </div>
              )
          }
        </div>
      </div>
    </div>
  )
};
