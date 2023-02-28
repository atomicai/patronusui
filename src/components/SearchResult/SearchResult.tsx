import { FC, useCallback, useEffect, useReducer, useState } from 'react';
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

type ViewVariant = 'tiles' | 'snippets';

interface SearchResultProps {
  title?: string;
  found: Doc[];
  variant?: ViewVariant;
  append?: boolean
  pageSize?: number;
  keywords?: KeywordDistributionData;
}

const defaultPageSize = 6;
const validatePageSize = (pageSize: number) => (pageSize > 0) ? pageSize : defaultPageSize;

const isPositiveVote = (doc: Doc) => (doc.upvote !== undefined) && (doc.upvote > 0);
const hasNoVote = (doc: Doc) => (doc.upvote === undefined) || (doc.upvote === 0);

const calcMaxPage = (variant: ViewVariant, pageSize: number, list: Doc[]) => {
  const maxPage = (variant === 'snippets')
    ? 0
    : (Math.ceil(list.filter(hasNoVote).length / pageSize) - 1);
  return (maxPage > -1) ? maxPage : 0;
}

const calcSlice = (variant: ViewVariant, pageSize: number, page: number, list: Doc[]) => {
  const offset = page * pageSize;
  const filtered = list.filter(hasNoVote);
  return   (variant === 'snippets')
    ? filtered
    : filtered.slice(offset, offset + pageSize);
};

interface SearchResultState {
  page: number;
  pageSize: number;
  maxPage: number;
  list: Doc[];
  slice: Doc[];
  variant: ViewVariant;
  append: boolean;
}
type SearchResultAction =
  { type: 'variant', variant: ViewVariant } |
  { type: 'pageSize', pageSize: number } |
  { type: 'page', page: number } |
  { type: 'vote' } |
  { type: 'append', append: boolean } |
  { type: 'list', list: Doc[] }
const reducer = (state: SearchResultState, action: SearchResultAction) => {
  switch (action.type) {
    case 'variant': {
      const page = 0;
      return {
        ...state,
        variant: action.variant,
        page,
        maxPage: calcMaxPage(action.variant, state.pageSize, state.list),
        slice: calcSlice(action.variant, state.pageSize, page, state.list)
      } ;
    }
    case 'append': {
      return {
        ...state,
        append: action.append,
      };
    }
    case 'pageSize': {
      const newPageSize = validatePageSize(action.pageSize);
      const page = 0;
      return (newPageSize === state.pageSize)
        ? state
        : {
          ...state,
          pageSize: newPageSize,
          page,
          maxPage: calcMaxPage(state.variant, newPageSize, state.list),
          slice: calcSlice(state.variant, newPageSize, page, state.list)
        };
    }
    case 'page': {
      const newPage = (action.page < 0) ? 0 : ((action.page > state.maxPage) ? state.maxPage : action.page);
      return (newPage === state.page)
        ? state
        : {
          ...state,
          page: newPage,
          slice: calcSlice(state.variant, state.pageSize, newPage, state.list),
        }
    }
    case 'vote': {
      const newMaxPage = calcMaxPage(state.variant, state.pageSize, state.list);
      const newPage = (state.page > newMaxPage) ? newMaxPage : state.page;
      return {
        ...state,
        page: newPage,
        maxPage: newMaxPage,
        slice: calcSlice(state.variant, state.pageSize, newPage, state.list),
      };
    }
    case 'list': {
      const page = state.append ? state.page : 0;
      const list = [...(state.append ? state.list : []), ...action.list];
      return {
        ...state,
        page,
        maxPage: calcMaxPage(state.variant, state.pageSize, list),
        list,
        slice: calcSlice(state.variant, state.pageSize, page, list),
      }
    }
  }
  return state;
}

type CreateInitialStateType = (arg: Required<Pick<SearchResultProps, 'found' | 'variant' | 'pageSize' | 'append'>>) => SearchResultState;
const createInitialState: CreateInitialStateType = ({ pageSize, variant, found, append }) => {
  const page = 0;
  const validPageSize = validatePageSize(pageSize);
  return {
    pageSize: validPageSize,
    page,
    maxPage: calcMaxPage(variant, validPageSize, found),
    list: [...found],
    slice: calcSlice(variant, validPageSize, page, found),
    variant,
    append,
  }
};


export const SearchResult: FC<SearchResultProps> = ({ title, found, append = false, keywords, variant = 'snippets', pageSize = defaultPageSize  }) => {
  const [favorites, setFavorites] = useState<Doc[]>([]);
  const [detailedDoc, setDetailedDoc] = useState<Doc | null>(null);
  const [areKeywordsShown, setAreKeywordsShown] = useState(false);

  const [state, dispatch] = useReducer(reducer, { pageSize, variant, found, append }, createInitialState);

  useEffect(() =>  dispatch({ type: 'pageSize', pageSize }), [pageSize]);
  useEffect(() =>  dispatch({ type: 'variant', variant }), [variant]);
  useEffect(() =>  dispatch({ type: 'append', append }), [append]);
  useEffect(() =>  dispatch({ type: 'list', list: found }), [found]);

  const handleVote = useCallback((docToHandle: Doc, delta: 1 | -1) => {
    docToHandle.upvote = (docToHandle.upvote || 0) + delta;
    setFavorites(state.list.filter(isPositiveVote));
    dispatch({ type: 'vote'});
  }, [state.list]);

  const handleNextPage = useCallback(() => dispatch({
    type: 'page',
    page: state.page + 1,
  }), [state.page]);

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

  const handleDetailedClose = useCallback(() => setDetailedDoc(null), []);

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
                        {state.slice.map((item, idx) =>(
                          <TileDoc
                            key={idx}
                            doc={item}
                            onClick={() => setDetailedDoc(item)}
                            onVote={(delta) => handleVote(item, delta)}
                            styleIdx={(idx % 4) as TileStyleIndexes}
                          />
                        ))}
                      </div>
                      {(state.page < state.maxPage) && (
                        <Tooltip title="Next samples" arrow>
                          <button className="hover:text-primary absolute right-2 top-0" onClick={handleNextPage}>
                            <ChevronRightIcon className="w-8 h-8" />
                          </button>
                        </Tooltip>
                      )}
                    </>
                  )}
                  {(variant === 'snippets') && (
                    <div className="h-[80vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-500 overflow-auto">
                      {state.slice.map((item, idx) => (
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
