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

type DocVariant = 'tiles' | 'snippets';

interface SearchResultProps {
  title?: string;
  found: Doc[];
  variant?: DocVariant;
  append?: boolean
  pageSize?: number;
}

const defaultPageSize = 6;
const validatePageSize = (pageSize: number) => (pageSize > 0) ? pageSize : defaultPageSize;

export const SearchResult: FC<SearchResultProps> = ({ title, found, append = false, variant = 'snippets', pageSize = defaultPageSize }) => {
  const [page, setPage] = useState(0);
  const [validPageSize, setValidPageSize] = useState(validatePageSize(pageSize));
  const [maxPage, setMaxPage] = useState((variant === 'snippets') ? 0 : Math.ceil(found.length / validatePageSize(pageSize)) - 1);
  const [list, setList] = useState<Doc[]>([...found]);
  const [slice, setSlice] = useState<Doc[]>((variant === 'snippets') ? [...found] : [...found.slice(0, validatePageSize(pageSize))]);
  const [favorites, setFavorites] = useState<Doc[]>([]);
  const [detailedDoc, setDetailedDoc] = useState<Doc | null>(null);
  // const prevAppendRef = useRef<boolean>();

  // useEffect(() => {
  //   console.log('useEffect');
  //   // prevAppendRef.current = append || false;
  //   const newPageSize = pageSize > 0 ? pageSize : defaultPageSize;
  //   setValidPageSize(newPageSize);
  //   setPage(0);
  //   setMaxPage((variant === 'snippets') ? 0 : Math.ceil(found.length / newPageSize) - 1);
  //   setList([...found]);
  //   setSlice((variant === 'snippets') ? [...found] : [...found.slice(0, newPageSize)])
  // }, []);

  useEffect(() => {
    console.log('validPageSize', validPageSize);
    setPage(0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil(list.length / validPageSize) - 1);
    setSlice((variant === 'snippets') ? [...list] : [...list.slice(0, validPageSize)])
  }, [validPageSize]);

  useEffect(() => {
    console.log('pageSize', pageSize);
    const newPageSize = pageSize > 0 ? pageSize : defaultPageSize;
    setValidPageSize(newPageSize);
  }, [pageSize]);

  useEffect(() => {
    console.log('append', append);
  }, [append]);

  useEffect(() => {
    setPage(0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil(list.length / validPageSize) - 1);
    setSlice((variant === 'snippets') ? [...list] : [...list.slice(0, validPageSize)])
  }, [variant]);

  useEffect(() => {
    console.log('found', found);
    setPage(prev => append ? prev : 0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil((append ? list.length : 0) + found.length / validPageSize) - 1)
    setList(prev => append ? [...prev, ...found] : [...found]);
    setSlice((variant === 'snippets')
      ? (append ? [...list, ...found] : [...found])
      : (append ? [...list, ...found] : [...found]).slice(validPageSize * (append ? page : 0), validPageSize * ((append ? page : 0) + 1))
    );
  }, [found]);

  // useEffect(() => {
  //   setSlice((variant === 'snippets') ? [...list] : [...list.slice(0, pageSize)]);
  // }, [list, page, maxPage])

  // useEffect(() => {
  //   setPage(prev => append ? prev : 0);
  //   setMaxPage(Math.ceil((append ? list.length : 0) + found.length / pageSize) - 1);
  //   setList(prev => {
  //     if (variant === 'tiles') {
  //       return[...found.slice(0, pageSize)];
  //     }
  //     if (variant === 'snippets') {
  //       return [...(append ? prev : []), ...found];
  //     }
  //     return [];
  //   });
  // }, [found, pageSize, variant]);
  //
  // useEffect(() => {
  //   setList(prev => {
  //     if (variant === 'tiles') {
  //       const offset = pageSize * page;
  //       return [...found.slice(offset, offset + pageSize)];
  //     }
  //     if (variant === 'snippets') {
  //       return [...(append ? prev : []), ...found];
  //     }
  //     return [];
  //   })
  // }, [page, pageSize, found, variant]);

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
                        {slice.map((item, idx) =>(
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
                      {slice.map((item, idx) => (
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
              : <div className="text-center my-8">No data</div>
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
