import { FC, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Doc, KeywordDistributionData } from '../../@types/search';
import { DetailedDoc } from './DetailedDoc';
import { TileDoc, TileStyleIndexes } from './TileDoc';
import { FavoriteDoc } from './FavoriteDoc';
import { ArrowDownTrayIcon, ChevronRightIcon, PresentationChartLineIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import styles from './SearchResult.module.css';
import { KeywordsDistribution } from '../KeywordsDistribution';
import { SnippetDoc, SnippetStyleIndexes } from './SnippetDoc';

type DocVariant = 'tiles' | 'snippets';

interface SearchResultProps {
  title?: string;
  found: Doc[];
  variant?: DocVariant;
  append?: boolean
  pageSize?: number;
  keywords?: KeywordDistributionData;
}

const defaultPageSize = 6;
const validatePageSize = (pageSize: number) => (pageSize > 0) ? pageSize : defaultPageSize;

const isPositiveVote = (doc: Doc) => (doc.upvote !== undefined) && (doc.upvote > 0);
const hasNoVote = (doc: Doc) => (doc.upvote === undefined) || (doc.upvote === 0);

export const SearchResult: FC<SearchResultProps> = ({ title, found, append = false, keywords, variant = 'snippets', pageSize = defaultPageSize  }) => {
  const [page, setPage] = useState(0);
  const [validPageSize, setValidPageSize] = useState(validatePageSize(pageSize));
  const [maxPage, setMaxPage] = useState((variant === 'snippets') ? 0 : Math.ceil(found.length / validatePageSize(pageSize)) - 1);
  const [list, setList] = useState<Doc[]>([...found]);
  const [slice, setSlice] = useState<Doc[]>((variant === 'snippets') ? [...found] : [...found.slice(0, validatePageSize(pageSize))]);
  const [favorites, setFavorites] = useState<Doc[]>([]);
  const [detailedDoc, setDetailedDoc] = useState<Doc | null>(null);
  const [areKeywordsShown, setAreKeywordsShown] = useState(false);

  useEffect(() => {
    console.log('validPageSize', validPageSize);
    setPage(0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil(list.length / validPageSize) - 1);
    setSlice((variant === 'snippets') ? [...list.filter(hasNoVote)] : [...list.filter(hasNoVote).slice(0, validPageSize)])
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
    console.log('variant', variant);
    setPage(0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil(list.length / validPageSize) - 1);
    setSlice((variant === 'snippets') ? [...list.filter(hasNoVote)] : [...list.filter(hasNoVote).slice(0, validPageSize)])
  }, [variant]);

  useEffect(() => {
    console.log('found', found);
    setPage(prev => append ? prev : 0);
    setMaxPage((variant === 'snippets') ? 0 : Math.ceil((append ? list.length : 0) + found.length / validPageSize) - 1)
    setList(prev => append ? [...prev, ...found] : [...found]);
    setSlice((variant === 'snippets')
      ? (append ? [...list.filter(hasNoVote), ...found] : [...found])
      : (append ? [...list.filter(hasNoVote), ...found] : [...found]).slice(validPageSize * (append ? page : 0), validPageSize * ((append ? page : 0) + 1))
    );
  }, [found]);

  const handleVote = useCallback((docToHandle: Doc, delta: 1 | -1) => {
    docToHandle.upvote = (docToHandle.upvote || 0) + delta;
    setFavorites(list.filter(isPositiveVote));
    setSlice((variant === 'snippets') ? [...list.filter(hasNoVote)] : [...list.filter(hasNoVote).slice(0, validPageSize)])
  }, [list]);

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
      {(title || keywords) && <div className="text-lg font-bold text-center mb-4">
        {title}
        {keywords && <button className="hover:text-primary relative left-4 top-3" onClick={() => setAreKeywordsShown(true)}>
          <PresentationChartLineIcon className="w-8 h-8"  />
        </button>}
        {areKeywordsShown && (
          <Modal
            open={areKeywordsShown}
            onClose={() => setAreKeywordsShown(false)}
            slotProps={{ backdrop: { style: { backgroundColor: 'rgb(17,24,39,0.75)' } } }}
          >
            <div className={styles.keywordsModal}>
              <div className="w-full h-full relative pt-8">
                <button className="absolute top-0 right-4 hover:text-primary" onClick={() => setAreKeywordsShown(false)}>
                  <XMarkIcon className="w-8 h-8" />
                </button>
                <KeywordsDistribution data={keywords || {}} />
              </div>
            </div>
          </Modal>
        )}
      </div>}
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
