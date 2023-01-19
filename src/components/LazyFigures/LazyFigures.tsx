import { FC, useEffect, useMemo, useState } from 'react';
import Plot, { PlotParams } from 'react-plotly.js';
import { KeywordsData, LazyFigureApi } from '../../@types/view';
import { Spinner } from '../Spinner';
import { useAtom } from 'jotai';
import { lazyPlots } from '../../contexts/UploadContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Keywords } from './Keywords';
import styles from './LazyFigures.module.css';
import { ChartBarSquareIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

interface LazyFiguresProps {
  figure: PlotParams;
  lazyApi?: LazyFigureApi[];
  keywords?: KeywordsData[];
}

export const LazyFigures: FC<LazyFiguresProps> = ({ figure, lazyApi = [], keywords = [] }) => {
  const [ figureUrl, setFigureUrl ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    setFigureUrl('');
    setIsLoading(false);
  }, [figure, lazyApi, keywords]);

  const [cachedLazyPlots, setCachedLazyPlots] = useAtom(lazyPlots);

  const handleButtonClick = async (url: string): Promise<void> => {
    if (url === figureUrl) {
      return;
    }

    if (!url) {
      setFigureUrl('');
      return;
    }

    if (!cachedLazyPlots[url]) {
      setIsLoading(true);
      try {
        const { data } = await axios.post<PlotParams>(url);
        setCachedLazyPlots({
          ...cachedLazyPlots,
          [url]: data,
        });
      } catch (e) {
        toast.error((e as Error).message);
      }
      setIsLoading(false);
    }
    setFigureUrl(url);
  };

  const currentFigure = figureUrl ? cachedLazyPlots[figureUrl] : figure;
  const buttons = useMemo(() => [{ api: '', title: '' }, ...lazyApi ], [lazyApi]);

  return (
    <div className={`grid grid-cols-12 gap-4 my-4 ${styles.wrapper}`}>
      <div className="col-span-11 w-full flex flex-col justify-center items-center">
      {
        isLoading
          ? <Spinner />
          : (
            <>
              <Plot
                data={currentFigure.data}
                layout={currentFigure.layout}
              />
              {!figureUrl && !!keywords.length && (
                <div className="pt-2 pb-4 w-full flex justify-center items-center gap-4">
                  <Keywords keywords={keywords} />
                </div>
              )}
            </>
          )
      }
      </div>
      {!!lazyApi.length && (
        <div className="flex flex-col items-center">
          {buttons.map((item) => {
            const isCurrent = (figureUrl === item.api);
            return (
              <button
                key={item.api}
                className={classNames('m-1 h-8 w-8 hover:text-white', { 'text-primary': !isCurrent, 'text-white': isCurrent })}
                disabled={isLoading || isCurrent}
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
