import { FC, SyntheticEvent } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import copyToClipboard from 'clipboard-copy';
import { KeywordsData } from '../@types/view';

interface KeywordsProps {
  keywords: KeywordsData[];
}

const clickHandlerFactory = (transformer: (text: string) => Promise<string>) => async (event: SyntheticEvent) => {
  const text = (event.target as Node).textContent;
  if (text) {
    try {
      const textToCopy = await transformer(text);
      await copyToClipboard(textToCopy);
      toast.success(`'${textToCopy}' has been copied to clipboard`);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
};

const handleWordClick = clickHandlerFactory((word: string) => Promise.resolve(word));
const handleTitleClick = clickHandlerFactory(async (title: string) => (await axios.post('/viewing_keywording', { title })).data);

export const Keywords: FC<KeywordsProps> = ({ keywords}) => {
  return (
    <ul className="flex flex-wrap justify-center items-center keywordsWrapper">
      {keywords.map((item, idx) => (
        <li key={idx} className="m-4 py-8 px-4 flex flex-col justify-center items-center text-white">
          <div className="flex flex-wrap justify-center items-center">
            {item.data.map((word, wordIdx) => (
              <button className="m-1 italic hover:underline" key={wordIdx} onClick={handleWordClick}>{word}</button>
            ))}
          </div>
          <div>
            <button className="m-1 font-bold hover:underline" onClick={handleTitleClick}>{item.title}</button>
          </div>
        </li>
      ))}
    </ul>
  )
};
