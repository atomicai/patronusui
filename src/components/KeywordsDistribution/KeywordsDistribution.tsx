import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { KeywordDistributionData, TimestampedValue } from '../../@types/search';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';
import styles from './KeywordsDistribution.module.css';

interface KeywordsDistributionProps {
  data: KeywordDistributionData[];
}

enum KeywordsDistributionType {
  linear = 'linear',
  bar = 'bar',
}

export const KeywordsDistribution: FC<KeywordsDistributionProps> = ({ data }) => {
  const [hidden, setHidden] = useState<number[]>([]);
  const [type, setType] = useState<KeywordsDistributionType>(KeywordsDistributionType.linear);
  useEffect(() => setHidden([]), [data]);
  const [linearData, linearDomainX, linearDomainY] = useMemo(() => prepareLinearData(data), [data]);
  const [barData, barDomainX, barDomainY] = useMemo(() => prepareBarData(data), [data]);

  const toggleHidden =(e: SyntheticEvent, idx: number) => {
    if (!(e.target as HTMLInputElement).checked) {
      setHidden(prev => [...prev, idx]);
    } else {
      setHidden(prev => prev.filter(item => item !== idx));
    }
  };

  const toggleType = (type: KeywordsDistributionType) => setType(type);

  return (
    <div className="h-full flex">
      <div className="h-full flex-1">
        {(type === KeywordsDistributionType.linear) && (
          <ResponsiveContainer>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" type="number" domain={linearDomainX} tickFormatter={tickFormatter} interval={0} />
              <YAxis dataKey="value" domain={linearDomainY} />
              <Tooltip />
              {linearData.map((s, idx) => (
                <Line
                  key={s.word}
                  dataKey="value"
                  data={s.data} name={s.word}
                  hide={hidden.indexOf(idx) > -1}
                  strokeWidth={3}
                  className={styles[`stroke${idx}`]}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
        {(type === KeywordsDistributionType.bar) && (
          <ResponsiveContainer>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="unixtime" domain={barDomainX} tickFormatter={tickFormatter} interval={0} />
              <YAxis domain={barDomainY} />
              <Tooltip />
              {data.map((s, idx) => (
                <Bar key={s.word} dataKey={s.word} hide={hidden.indexOf(idx) > -1} className={styles[`fill${idx}`]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-col justify-between p-8">
        <div>
          {data.map((item, idx) => (
            <div key={item.word} className="min-w-max">
              <label className={`cursor-pointer ${styles[`label${idx}`]}`}>
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

const xDelta = 86400;
const yDelta = 1;

const tickFormatter = (unixtime: number) => (new Date(unixtime)).toLocaleDateString('ru-RU');

const prepareLinearData = (data: KeywordDistributionData[]) => {
  const prepared = data.map(({ word, data }) => ({
    word,
    data: translateTimestamps(data || []).sort((a, b) => a.unixtime - b.unixtime),
  }));
  const minX: number[] = [];
  const maxX: number[] = [];
  const minY: number[] = [];
  const maxY: number[] = [];
  prepared.forEach(item => {
    if (item.data.length) {
      const unixtimes = item.data.map(({ unixtime }) => unixtime);
      const values = item.data.map(({ value }) => value);
      minX.push(Math.min(...unixtimes));
      maxX.push(Math.max(...unixtimes));
      minY.push(Math.min(...values));
      maxY.push(Math.max(...values));
    }
  });
  return [
    prepared,
    [Math.min(...minX) - xDelta, Math.max(...maxX) + xDelta] as AxisDomain,
    [Math.min(...minY) - yDelta, Math.max(...maxY) + yDelta] as AxisDomain,
  ] as const;
}

const translateTimestamps = (data: TimestampedValue[]) => data.map(({ value, timestamp }) => ({
  value,
  unixtime: (new Date(timestamp)).valueOf(),
}));

const prepareBarData = (data: KeywordDistributionData[]) => {
  const prepared = data.map(({ word, data }) => ({
    word,
    data: translateTimestamps(data || []).sort((a, b) => a.unixtime - b.unixtime),
  }));
  const minX: number[] = [];
  const maxX: number[] = [];
  const minY: number[] = [];
  const maxY: number[] = [];
  const barData: Record<number, Record<string, number>> = {};
  prepared.forEach(item => {
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
    Object.values(barData).sort((a, b) => a.unixtime - b.unixtime),
    [Math.min(...minX) - xDelta, Math.max(...maxX) + xDelta] as AxisDomain,
    [Math.min(...minY) - yDelta, Math.max(...maxY) + yDelta] as AxisDomain,
  ] as const;
}
