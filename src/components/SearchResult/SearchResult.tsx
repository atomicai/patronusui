import { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Doc } from '../../@types/search';
import { DetailedDoc } from './DetailedDoc';
import { TileDoc, TileStyleIndexes } from './TileDoc';
import { FavoriteDoc } from './FavoriteDoc';
import { ArrowDownTrayIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@mui/material';
import { SnippetDoc, SnippetStyleIndexes } from './SnippetDoc';
import Modal from '@mui/material/Modal';
import styles from './SearchResult.module.css';

interface SearchResultProps {
  title?: string;
  found: Doc[];
  variant?: 'tiles' | 'snippets';
}
export const SearchResult: FC<SearchResultProps> = ({ title, found, variant = 'snippets' }) => {
  const [pageSize] = useState(6);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [list, setList] = useState<Doc[]>([]);
  const [favorites, setFavorites] = useState<Doc[]>([]);
  const [detailedDoc, setDetailedDoc] = useState<Doc | null>(null);

  useEffect(() => {
    setPage(0);
    setMaxPage(Math.ceil(found.length / pageSize) - 1);
    setFavorites([]);
    if (variant === 'tiles') {
      setList([...found.slice(0, pageSize)]);
    } else if (variant === 'snippets') {
      setList([...found]);
    }
  }, [found, pageSize, variant]);

  useEffect(() => {
    if (variant === 'tiles') {
      const offset = pageSize * page;
      setList([...found.slice(offset, offset + pageSize)]);
    } else if (variant === 'snippets') {
      setList([...found]);
    }
  }, [page, pageSize, found, variant]);

  const handleVote = useCallback((docToHandle: Doc, delta: 1 | -1) => {
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
  }, [list, setList, favorites, setFavorites]);

  const handleDownload = useCallback(async () => {
    try {
      const filename = await axios
        .post<{ filename: string }>('/snapshotting', { docs: favorites })
        .then((res) => res.data.filename);
      window.open(`/downloading/${filename}`);  // is not working in development mode (for example without running under flask)
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, [favorites]);

  const handleDetailedClose = useCallback(() => setDetailedDoc(null), [setDetailedDoc]);

  return (
    <div className="w-full h-full">
      {title && <div className="text-lg font-bold text-center mb-4">{title}</div>}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 pt-8 pb-4 relative">
          {
            found.length
              ? (
                <>
                  {(variant === 'tiles') && (
                    <>
                      <div className="flex flex-wrap justify-center items-center">
                        {list.map((item, idx) =>(
                          <TileDoc
                            key={idx}
                            doc={item}
                            onClick={() => setDetailedDoc(item)}
                            onVote={(delta) => handleVote(item, delta)}
                            styleIdx={(idx % 4) as TileStyleIndexes}
                          />
                        ))}
                      </div>
                      {(page < maxPage) && (
                        <Tooltip title="Next samples" arrow>
                          <button className="hover:text-primary absolute right-2 top-0" onClick={() => setPage(prev => prev + 1)}>
                            <ChevronRightIcon className="w-8 h-8" />
                          </button>
                        </Tooltip>
                      )}
                    </>
                  )}
                  {(variant === 'snippets') && (
                    <div className="h-[80vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-500 overflow-auto">
                      {list.map((item, idx) => (
                        <SnippetDoc
                          key={idx}
                          doc={item}
                          onClick={() => setDetailedDoc(item)}
                          onVote={(delta) => handleVote(item, delta)}
                          styleIdx={(idx % 4) as SnippetStyleIndexes}
                        />
                      ))}
                    </div>
                  )}
                </>
              )
              : <div className="text-center my-8">Nothing is found</div>
          }
        </div>
        <div className="border-[#A456F0] border-l p-4 pl-8">
          {
            (detailedDoc && (variant === 'tiles'))
              ? (
                <div>
                  <div className="text-right mb-1">
                    <button className="hover:text-primary" onClick={handleDetailedClose}>
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <DetailedDoc doc={detailedDoc} />
                </div>
              )
              : (
                <div>
                  <div className="text-right mb-1">
                    {!!favorites.length && (
                      <button className="hover:text-primary" onClick={handleDownload}>
                        <ArrowDownTrayIcon className="w-8 h-8" />
                      </button>
                    )}
                  </div>
                  {favorites.map((doc, idx) => (
                    <FavoriteDoc
                      key={idx}
                      doc={doc}
                      onClick={() => setDetailedDoc(doc)}
                      onVote={(delta) => handleVote(doc, delta)}
                    />
                  ))}
                </div>
              )
          }
        </div>
      </div>
      <Modal open={!!detailedDoc && (variant === 'snippets')} onClose={handleDetailedClose}>
        <div className={styles.modal}>
          <div className="h-[15%] text-right mb-1">
            <button className="hover:text-primary" onClick={handleDetailedClose}>
              <XMarkIcon className="w-8 h-8" />
            </button>
          </div>
          {/*<div className="overflow-auto">*/}
          <div className="h-[85%] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-500 overflow-auto">
            {detailedDoc && <DetailedDoc doc={detailedDoc} />}
          </div>
        </div>
      </Modal>
    </div>
  )
};
