import { FC, SyntheticEvent } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { KeywordsData } from '../@types/view';
import { copyToClipboard } from '../utils/clipboard';

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
    <>
      {keywords.map((item, idx) => (
        <div key={idx} className="px-4 py-2 flex flex-col justify-center items-center border-2 border-dotted border-current rounded-md">
          <div>
            {item.data.map((word, wordIdx) => (
              <button className="m-1 text-teal-500 italic hover:underline" key={wordIdx} onClick={handleWordClick}>{word}</button>
            ))}
          </div>
          <div>
            <button className="font-bold text-teal-500 hover:underline" onClick={handleTitleClick}>{item.title}</button>
          </div>
        </div>
      ))}
    </>
  )
};
