import { FC, Fragment, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { KeywordDistributionData } from '../../@types/search';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import Slider from '@mui/material/Slider';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface KeywordsDistributionProps {
  data: KeywordDistributionData;
}

type Range = [number, number];
type TimestampedValue = { unixtime: number, value: number };
type LinearData = { data: TimestampedValue[], word: string }[];
type BarData = Record<'unixtime' | string, number>[];

enum KeywordsDistributionType {
  linear = 'linear',
  bar = 'bar',
}

enum KeywordsDistributionValueType {
  absolute = 'absolute',
  relative = 'relative',
}

const tooltipContentStyle = {
  backgroundColor: '#12071F',
  border: '1px solid #A456F0',
  borderRadius: '0.5em',
};
const tooltipLabelStyle = {
  fontWeight: 'bold',
};

const diagramColors = [
  'cyan',
  'orange',
  'green',
  'red',
  'magenta',
  'gray',
  'brown',
  'blue',
  'yellow',
  'white',
];
const diagramColorsLength = diagramColors.length;

const minSliderDistance = 3600000;
const xDelta = 86400000;
const yDelta = 1;

export const KeywordsDistribution: FC<KeywordsDistributionProps> = ({ data }) => {
  const [linearData, barData, domainX, domainY, words,
    linearDataRelative, barDataRelative, domainYRelative] = useMemo(() => {
    try {
      return prepareData(data);
    } catch (e) {
      toast.error((e as Error).message);
      return [[], [], [0, 1] as Range, [0, 1] as Range, [], [], [], [0, 1] as Range, [0, 1] as Range];
    }
  }, [data]);
  const [hidden, setHidden] = useState<number[]>([]);
  const [type, setType] = useState<KeywordsDistributionType>(KeywordsDistributionType.linear);
  const [valueType, setValueType] = useState<KeywordsDistributionValueType>(KeywordsDistributionValueType.absolute);

  const [xRange, setXRange] = useState<Range>(domainX);
  const [linear, setLinear] = useState<LinearData>(linearData);
  const [bar, setBar] = useState<BarData>(barData);

  useEffect(() => setHidden([]), [data]);

  useEffect(() => {
    const data = (valueType === KeywordsDistributionValueType.absolute) ? linearData : linearDataRelative;
    setLinear(data.map(item => ({
      ...item,
      data: item.data.filter(({ unixtime }) => (xRange[0] <= unixtime) && (unixtime <= xRange[1])),
    })));
  }, [linearData, linearDataRelative, xRange, valueType]);

  useEffect(() => {
    const data = (valueType === KeywordsDistributionValueType.absolute) ? barData : barDataRelative;
    setBar(data.filter(({ unixtime }) => (xRange[0] <= unixtime) && (unixtime <= xRange[1])));
  }, [barData, barDataRelative, xRange, valueType]);

  const toggleHidden =(e: SyntheticEvent, idx: number) => {
    if (!(e.target as HTMLInputElement).checked) {
      setHidden(prev => [...prev, idx]);
    } else {
      setHidden(prev => prev.filter(item => item !== idx));
    }
  };

  const toggleType = (type: KeywordsDistributionType) => setType(type);
  const toggleValueType = (type: KeywordsDistributionValueType) => setValueType(type);

  const handleSlider = useCallback((event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (newValue[1] - newValue[0] < minSliderDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], domainX[1] - minSliderDistance);
        setXRange([clamped, clamped + minSliderDistance]);
      } else {
        const clamped = Math.max(newValue[1], domainX[0] + minSliderDistance);
        setXRange([clamped - minSliderDistance, clamped]);
      }
    } else {
      setXRange(newValue as Range);
    }
  }, [domainX]);

  const handleSelectAll = useCallback(() => setHidden([]), []);
  const handleDeselectAll = useCallback(() => setHidden(words.map((item, idx) => idx)), [words]);

  return (
    <div className="h-full flex">
      <div className="h-full flex-1 pb-16 relative">
        {(type === KeywordsDistributionType.linear) && (
          <ResponsiveContainer>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" type="number" domain={xRange} tickFormatter={unixTimeFormatter} interval="preserveStartEnd" angle={-15} />
              <YAxis dataKey="value" domain={(valueType === KeywordsDistributionValueType.absolute) ? domainY : domainYRelative} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} labelFormatter={unixTimeFormatter} />
              {linear.map((s, idx) => (
                <Fragment key={s.word}>
                  {
                    s.data.length
                      ? <Line
                        dataKey="value"
                        data={s.data} name={s.word as string}
                        hide={hidden.indexOf(idx) > -1}
                        strokeWidth={3}
                        stroke={diagramColors[idx % diagramColorsLength]}
                      />
                      : null
                  }
                </Fragment>
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {(type === KeywordsDistributionType.bar) && (
          <ResponsiveContainer>
            <BarChart data={bar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" domain={xRange} tickFormatter={unixTimeFormatter} interval="preserveStartEnd" angle={-15} />
              <YAxis domain={(valueType === KeywordsDistributionValueType.absolute) ? domainY : domainYRelative} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} labelFormatter={unixTimeFormatter} />
              {words.map((s, idx) => (
                <Bar key={s} dataKey={s} hide={hidden.indexOf(idx) > -1} fill={diagramColors[idx % diagramColorsLength]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="absolute left-0 right-0 bottom-0 pl-24 pr-8">
          <Slider
            min={domainX[0]}
            max={domainX[1]}
            value={xRange}
            onChange={handleSlider}
            valueLabelDisplay="auto"
            valueLabelFormat={unixTimeFormatter}
            disableSwap
          />
        </div>
      </div>
      <div className="flex flex-col justify-between p-8 pb-0 pt-2">
        <div className="text-primary flex mt-2">
          <button title="Select all" className="hover:text-white mr-2" onClick={handleSelectAll}><CheckCircleIcon className="w-8 h-8" /></button>
          <button title="Deselect all" className="hover:text-white" onClick={handleDeselectAll}><XCircleIcon className="w-8 h-8" /></button>
        </div>
        <div className="grow overflow-auto mt-2 mb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-500 pr-4">
          {words.map((item, idx) => (
            <div key={item} className="min-w-max">
              <label className="cursor-pointer" style={{ color: diagramColors[idx % diagramColorsLength] }}>
                <input type="checkbox" checked={hidden.indexOf(idx) === -1} onChange={(e) => toggleHidden(e, idx)}/>
                <span className="ml-2">{item}</span>
              </label>
            </div>
          ))}
        </div>
        <div className="mb-4">
          {Object.values(KeywordsDistributionValueType).map(item => (
            <div key={item} className="min-w-max">
              <label>
                <input type="radio" checked={valueType === item} onChange={() => toggleValueType(item)} />
                <span className="ml-2">{item}</span>
              </label>
            </div>
          ))}
        </div>
        <div>
          {Object.values(KeywordsDistributionType).map(item => (
            <div key={item} className="min-w-max">
              <label>
                <input type="radio" checked={type === item} onChange={() => toggleType(item)} />
                <span className="ml-2">{item}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const unixTimeFormatter = (unixtime: number) => (new Date(unixtime)).toLocaleString('ru-RU');

const sorter = (a: Record<'unixtime', number>, b: Record<'unixtime', number>) => a.unixtime - b.unixtime;

const prepareData = (data: KeywordDistributionData): [LinearData, BarData, Range, Range, string[], LinearData, BarData, Range] => {
  const words: string[] = [];
  const transformed: LinearData = [];
  const transformedRelative: LinearData = [];
  Object.keys(data).forEach(word => {
    words.push(word);
    transformed.push({
      word,
      data: (data[word] || [])
        .map(({ value, timestamp }) =>
          ({ value, unixtime: (new Date(toIsoString(timestamp))).valueOf() }))
        .sort(sorter),
    });
    const relativeData: TimestampedValue[] = [];
    (data[word] || []).forEach(({ relative, timestamp }) => {
      if (relative !== undefined) {
        relativeData.push({ value: relative, unixtime: (new Date(toIsoString(timestamp))).valueOf() });
      }
    });
    transformedRelative.push({
      word,
      data: relativeData.sort(sorter),
    });
  });

  const minX: number[] = [];
  const maxX: number[] = [];
  const minY: number[] = [];
  const maxY: number[] = [];
  const barData: Record<number, Record<string, number>> = {};
  transformed.forEach(item => {
    if (item.data.length) {
      const unixtimes = item.data.map(({ unixtime }) => unixtime);
      const values = item.data.map(({ value }) => value);
      minX.push(Math.min(...unixtimes));
      maxX.push(Math.max(...unixtimes));
      minY.push(Math.min(...values));
      maxY.push(Math.max(...values));
      item.data.forEach(s => {
        const unixtime = s.unixtime;
        barData[unixtime] = { ...barData[unixtime], unixtime, [item.word]: s.value };
      });
    }
  });

  const minYRelative: number[] = [];
  const maxYRelative: number[] = [];
  const barDataRelative: Record<number, Record<string, number>> = {};
  transformedRelative.forEach(item => {
    if (item.data.length) {
      const values = item.data.map(({ value }) => value);
      minYRelative.push(Math.min(...values));
      maxYRelative.push(Math.max(...values));
      item.data.forEach(s => {
        const unixtime = s.unixtime;
        barDataRelative[unixtime] = { ...barDataRelative[unixtime], unixtime, [item.word]: s.value };
      });
    }
  });

  return [
    transformed,
    Object.values(barData).sort(sorter),
    [Math.min(...minX) - xDelta, Math.max(...maxX) + xDelta],
    [Math.min(...minY) - yDelta, Math.max(...maxY) + yDelta],
    words,
    transformedRelative,
    Object.values(barDataRelative).sort(sorter),
    [Math.min(...minYRelative) - yDelta, Math.max(...maxYRelative) + yDelta],
  ];
};

const pattern = /^(\d\d)\/(\d\d)\/(\d\d) (\d\d):(\d\d):(\d\d)$/;
const toIsoString = (timestring: string) => {
  const m = pattern.exec(timestring);
  if (!m) {
    throw Error(`Unsupported date format: '${timestring}'`);
  }
  return `20${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:${m[6]}`;
}
