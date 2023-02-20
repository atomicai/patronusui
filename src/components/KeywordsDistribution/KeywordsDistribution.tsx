import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { KeywordDistributionData, TimestampedValue } from '../../@types/search';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';
import styles from './KeywordsDistribution.module.css';

interface KeywordsDistributionProps {
  data: KeywordDistributionData[];
}

export const KeywordsDistribution: FC<KeywordsDistributionProps> = ({ data }) => {
  const [hidden, setHidden] = useState<number[]>([]);
  useEffect(() => setHidden([]), [data]);
  const [translatedData, domainX, domainY] = useMemo(() => prepareData(data), [data]);

  const toggleHidden =(e: SyntheticEvent, idx: number) => {
    if (!(e.target as HTMLInputElement).checked) {
      setHidden(prev => [...prev, idx]);
    } else {
      setHidden(prev => prev.filter(item => item !== idx));
    }
  };

  return (
    <div className="h-full flex p-4">
      <div className="h-full flex-1">
        <ResponsiveContainer>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="unixtime" type="number" domain={domainX} tickFormatter={tickFormatter} interval={0} />
            <YAxis dataKey="value" domain={domainY}/>
            <Tooltip />
            {translatedData.map((s, idx) => (
              <Line
                key={s.word}
                dataKey="value"
                data={s.data} name={s.word}
                hide={hidden.indexOf(idx) > -1}
                strokeWidth={3}
                className={styles[`color${idx}`]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col p-8">
        {translatedData.map((item, idx) => (
          <div key={item.word} className="my-1">
            <label className={`cursor-pointer ${styles[`label${idx}`]}`}>
              <input type="checkbox" checked={hidden.indexOf(idx) === -1} onChange={(e) => toggleHidden(e, idx)}/>
              <span className="ml-2">{item.word}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const tickFormatter = (unixtime: number) => (new Date(unixtime)).toLocaleDateString('ru-RU');

const prepareData = (data: KeywordDistributionData[]) => {
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
  })
  return [
    prepared,
    [Math.min(...minX), Math.max(...maxX)] as AxisDomain,
    [Math.min(...minY), Math.max(...maxY)] as AxisDomain,
  ] as const;
}

const translateTimestamps = (data: TimestampedValue[]) => data.map(({ value, timestamp }) => ({
  value,
  unixtime: (new Date(timestamp)).valueOf(),
}));
