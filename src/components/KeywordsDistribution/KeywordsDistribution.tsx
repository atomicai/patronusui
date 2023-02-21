import { FC, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { KeywordDistributionData } from '../../@types/search';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip } from 'recharts';
import Slider from '@mui/material/Slider';

interface KeywordsDistributionProps {
  data: KeywordDistributionData[];
}

type Range = [number, number];
type LinearData = {data: {unixtime: number, value: number}[], word: string}[];
type BarData = Record<'unixtime' | string, number>[];

enum KeywordsDistributionType {
  linear = 'linear',
  bar = 'bar',
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

const minSliderDistance = 3600;
const xDelta = 86400;
const yDelta = 1;

export const KeywordsDistribution: FC<KeywordsDistributionProps> = ({ data }) => {
  const [linearData, barData, domainX, domainY] = useMemo(() => prepareData(data), [data]);
  const [hidden, setHidden] = useState<number[]>([]);
  const [type, setType] = useState<KeywordsDistributionType>(KeywordsDistributionType.linear);

  const [xRange, setXRange] = useState<Range>(domainX);
  const [linear, setLinear] = useState<LinearData>(linearData);
  const [bar, setBar] = useState<BarData>(barData);

  useEffect(() => setHidden([]), [data]);

  useEffect(() => {
    setLinear(linearData.map(item => ({
      ...item,
      data: item.data.filter(({ unixtime }) => (xRange[0] <= unixtime) && (unixtime <= xRange[1])),
    })));
  }, [linearData, xRange, domainY]);

  useEffect(() => {
    setBar(barData.filter(({ unixtime }) => (xRange[0] <= unixtime) && (unixtime <= xRange[1])));
  }, [barData, xRange, domainY]);

  const toggleHidden =(e: SyntheticEvent, idx: number) => {
    if (!(e.target as HTMLInputElement).checked) {
      setHidden(prev => [...prev, idx]);
    } else {
      setHidden(prev => prev.filter(item => item !== idx));
    }
  };

  const toggleType = (type: KeywordsDistributionType) => setType(type);

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

  return (
    <div className="h-full flex">
      <div className="h-full flex-1 pb-16 relative">
        {(type === KeywordsDistributionType.linear) && (
          <ResponsiveContainer>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" type="number" domain={xRange} tickFormatter={unixTimeFormatter} interval={0} angle={-15} />
              <YAxis dataKey="value" domain={domainY} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} labelFormatter={unixTimeFormatter} />
              {linear.map((s, idx) => (
                <Line
                  key={s.word}
                  dataKey="value"
                  data={s.data} name={s.word as string}
                  hide={hidden.indexOf(idx) > -1}
                  strokeWidth={3}
                  stroke={diagramColors[idx % diagramColorsLength]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {(type === KeywordsDistributionType.bar) && (
          <ResponsiveContainer>
            <BarChart data={bar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" domain={xRange} tickFormatter={unixTimeFormatter} interval={0} angle={-15} />
              <YAxis domain={domainY} />
              <Tooltip contentStyle={tooltipContentStyle} labelStyle={tooltipLabelStyle} labelFormatter={unixTimeFormatter} />
              {data.map((s, idx) => (
                <Bar key={s.word} dataKey={s.word} hide={hidden.indexOf(idx) > -1} fill={diagramColors[idx % diagramColorsLength]} />
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
      <div className="flex flex-col justify-between p-8 pb-0">
        <div>
          {data.map((item, idx) => (
            <div key={item.word} className="min-w-max">
              <label className="cursor-pointer" style={{ color: diagramColors[idx % diagramColorsLength] }}>
                <input type="checkbox" checked={hidden.indexOf(idx) === -1} onChange={(e) => toggleHidden(e, idx)}/>
                <span className="ml-2">{item.word}</span>
              </label>
            </div>
          ))}
        </div>
        <div>
          {Object.values(KeywordsDistributionType).map(item => (
            <div key={item} className="min-w-max">
              <label>
                <input type="radio" value={KeywordsDistributionType.linear} checked={type === item} onChange={() => toggleType(item)} />
                <span className="ml-2">{item}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const unixTimeFormatter = (unixtime: number) => (new Date(unixtime)).toLocaleDateString('ru-RU');

const prepareData = (data: KeywordDistributionData[]): [LinearData, BarData, Range, Range] => {
  const transformed = data.map(({ word, data }) => ({
    word,
    data: (data || [])
      .map(({ value, timestamp }) => ({ value, unixtime: (new Date(timestamp)).valueOf() }))
      .sort((a, b) => a.unixtime - b.unixtime),
  }));
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
  return [
    transformed,
    Object.values(barData).sort((a, b) => a.unixtime - b.unixtime),
    [Math.min(...minX) - xDelta, Math.max(...maxX) + xDelta],
    [Math.min(...minY) - yDelta, Math.max(...maxY) + yDelta],
  ];
};
