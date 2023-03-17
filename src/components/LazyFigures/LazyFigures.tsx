import { FC, forwardRef, SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import { LazyFigureApi } from '../../@types/view';
import { Spinner } from '../Spinner';
import { useAtom } from 'jotai';
import { lazyPlots } from '../../contexts/UploadContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Tooltip } from '@mui/material'
import { ArchiveBoxXMarkIcon, ChartBarSquareIcon, ClockIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { SearchResult } from '../SearchResult';
import { Data } from '../../@types/search';
import styles from './LazyFigures.module.css';
import { DateRangePicker } from 'rsuite';
import { DateRange } from 'rsuite/DateRangePicker';
import { format } from 'date-fns';

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
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>();
  const dateRangeContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (topic) {
      setIsTopicLoading(true);
      axios.post<Data>('/viewing_representation', {
        topic_name: topic,
        api: figureUrl || 'default',
        ...(
          dateRange
            ? {
              from: format(new Date(dateRange[0].setHours(0, 0, 0, 0)), 'dd/MM/yyyy HH:mm:ss'),
              to: format(new Date(dateRange[1].setHours(23, 59, 59, 999)), 'dd/MM/yyyy HH:mm:ss'),
            }
            : {}
        ),
      })
        .then(({ data }) => setSearchResponse(data))
        .catch(e => toast.error((e as Error).message))
        .finally(() => setIsTopicLoading(false));
    } else {
      setSearchResponse({ docs: [] });
    }
  }, [topic, figureUrl, dateRange]);

  const handleFigureDoubleClick = useCallback(async (e: SyntheticEvent) => {
    setDateRange(undefined);
    setIsPickerOpened(false);
    const parentElement = (e.target as Element).parentElement;
    if (parentElement?.classList.contains('traces')) {
      const clickedTopic = parentElement.getElementsByTagName('text')[0]?.textContent || '';
      setTopic(clickedTopic);
    }
  }, []);

  const handleDatePickerOk = useCallback(async (range: DateRange) => {
    setIsPickerOpened(false);
    setDateRange(range);
  }, []);

  const currentFigure = figureUrl ? cachedLazyPlots[figureUrl] : figure;
  const buttons = useMemo(() => [{ api: '', title: '' }, ...lazyApi ], [lazyApi]);
  const toggleDatePicker = useCallback(() => setIsPickerOpened(prev => !prev), []);

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

                    <div className="absolute top-2 right-2">
                      <Tooltip title="Set date range" arrow>
                        <button className="text-white hover:text-primary mr-4" onClick={toggleDatePicker}>
                          <ClockIcon className="w-8 h-8" />
                        </button>
                      </Tooltip>
                      <Tooltip title="Hide samples" arrow>
                        <button className="text-white hover:text-primary" onClick={() => setTopic('')}>
                          <ArchiveBoxXMarkIcon className="w-8 h-8" />
                        </button>
                      </Tooltip>
                      <div  ref={dateRangeContainerRef} className={styles.toolsWrapper}>
                        <DateRangePicker
                          placement="leftStart"
                          open={isPickerOpened}
                          placeholder="Select date range"
                          onOk={handleDatePickerOk}
                          toggleAs={EmptySpan}  // hide range input
                          container={dateRangeContainerRef.current || undefined} // place popup in the same container to fix scrolling
                        />
                      </div>
                    </div>
                    <div className={`pt-2 pb-8 px-2 w-full flex flex-col justify-center items-center  text-white ${styles.topicWrapper}`}>
                      {
                        isTopicLoading
                          ? <Spinner />
                          : <SearchResult
                            title={searchResponse.title || topic}
                            found={searchResponse.docs}
                            keywords={searchResponse.keywords || {}}
                            dateRange={dateRange}
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

const EmptySpan = forwardRef(() => <span></span>);
