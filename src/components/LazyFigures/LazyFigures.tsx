import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import { LazyFigureApi } from '../../@types/view';
import { Spinner } from '../Spinner';
import { useAtom } from 'jotai';
import { lazyPlots } from '../../contexts/UploadContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Tooltip } from '@mui/material'
import { ArchiveBoxXMarkIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { SearchResult } from '../SearchResult';
import { Data } from '../../@types/search';
import styles from './LazyFigures.module.css';

interface LazyFiguresProps {
  figure: PlotParams;
  lazyApi: LazyFigureApi[];
}

export const LazyFigures: FC<LazyFiguresProps> = ({ figure, lazyApi }) => {
  const [ figureUrl, setFigureUrl ] = useState('');
  const [ isFigureLoading, setIsFigureLoading ] = useState(false);
  const [ topic, setTopic ] = useState('');
  const [ isTopicLoading, setIsTopicLoading ] = useState(false);
  const [ searchResponse, setSearchResponse ] = useState<Data>({ docs: [] });

  useEffect(() => {
    setFigureUrl('');
    setIsFigureLoading(false);
    setTopic('');
  }, [figure, lazyApi]);

  const [cachedLazyPlots, setCachedLazyPlots] = useAtom(lazyPlots);

  const handleButtonClick = async (url: string): Promise<void> => {
    if (url === figureUrl) {
      return;
    }

    setTopic('');

    if (!url) {
      setFigureUrl('');
      return;
    }

    if (!cachedLazyPlots[url]) {
      setIsFigureLoading(true);
      try {
        const { data } = await axios.post<PlotParams>(url);
        setCachedLazyPlots({
          ...cachedLazyPlots,
          [url]: data,
        });
      } catch (e) {
        toast.error((e as Error).message);
      }
      setIsFigureLoading(false);
    }
    setFigureUrl(url);
  };

  const handleFigureDoubleClick = async (e: SyntheticEvent) => {
    const parentElement = (e.target as Element).parentElement;
    if (parentElement?.classList.contains('traces')) {
      const clickedTopic = parentElement.getElementsByTagName('text')[0]?.textContent;
      if (clickedTopic) {
        setTopic(clickedTopic);
        setIsTopicLoading(true);
        try {
          const { data } = await axios.post<Data>('/viewing_representation', {
            topic_name: clickedTopic,
            api: figureUrl || 'default',
          });
          setSearchResponse(data);
        } catch (e) {
          toast.error((e as Error).message);
        }
        setIsTopicLoading(false);
      }
    }
  };

  const currentFigure = figureUrl ? cachedLazyPlots[figureUrl] : figure;
  const buttons = useMemo(() => [{ api: '', title: '' }, ...lazyApi ], [lazyApi]);

  return (
    <div className={`grid grid-cols-12 gap-4 my-4 ${styles.wrapper}`}>
      <div className="col-span-11 w-full flex flex-col justify-center items-center" onDoubleClick={handleFigureDoubleClick}>
        {
          isFigureLoading
            ? <Spinner />
            : (
              <>
                <Plot
                  data={currentFigure.data}
                  layout={currentFigure.layout}
                />
                {topic && (
                  <div className="relative w-full">
                    <Tooltip title="Hide samples" arrow>
                      <button className="absolute top-2 right-2 text-white hover:text-primary" onClick={() => setTopic('')}>
                        <ArchiveBoxXMarkIcon className="w-8 h-8" />
                      </button>
                    </Tooltip>
                    <div className={`pt-2 pb-8 px-2 w-full flex flex-col justify-center items-center  text-white ${styles.topicWrapper}`}>
                      {
                        isTopicLoading
                          ? <Spinner />
                          : <SearchResult
                            title={searchResponse.title || topic}
                            found={searchResponse.docs}
                            keywords={searchResponse.keywords || {}}
                          />
                      }
                    </div>
                  </div>
                )}
              </>
            )
        }
      </div>
      {!!lazyApi.length && (
        <div className="flex flex-col items-center">
          {buttons.map((item, idx) => {
            const isCurrent = (figureUrl === item.api);
            return (
              <button
                key={item.api}
                className={classNames('m-1 h-8 w-8 hover:text-white', {
                  'text-white': isCurrent,
                  'text-primary': !isCurrent && ((idx % 4) === 0),
                  'text-cyan': !isCurrent && ((idx % 4) === 1),
                  'text-near-orange': !isCurrent && ((idx % 4) === 2),
                  'text-near-gray': !isCurrent && ((idx % 4) === 3),
                })}
                disabled={isFigureLoading || isCurrent}
                onClick={() => handleButtonClick(item.api)}
                title={item.title}
              >
                <ChartBarSquareIcon />
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};
