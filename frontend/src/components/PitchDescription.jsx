import { useState, useEffect, useRef } from 'react';

const toLines = (text) =>
  text.split(/(?<=[.!?])\s+/).filter(Boolean).join('\n');

const PitchDescription = ({ pitchText, isStreaming, onDone }) => {
  const [revealed, setRevealed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef(null);
  const indexRef = useRef(0);
  const fullTextRef = useRef('');

  useEffect(() => {
    if (!pitchText) return;

    fullTextRef.current = toLines(pitchText);

    if (intervalRef.current) clearInterval(intervalRef.current);
    indexRef.current = 0;
    setRevealed('');
    setIsTyping(true);

    intervalRef.current = setInterval(() => {
      const step = Math.floor(Math.random() * 3) + 2;
      const next = indexRef.current + step;
      setRevealed(fullTextRef.current.slice(0, next));
      indexRef.current = next;

      if (next >= fullTextRef.current.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        if (onDone) onDone();
      }
    }, 35);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pitchText]);

  return (
    <div className='bg-gray-900 rounded-xl p-6 min-h-32'>
      <p className='text-gray-400 text-sm uppercase tracking-widest mb-4'>
       ShipReady
      </p>
      <p className='text-gray-100 leading-relaxed whitespace-pre-wrap text-base'>
        {revealed || (
          <span className='text-gray-600'>
            Your pitch will appear here after analysis…
          </span>
        )}
        {(isTyping || isStreaming) && (
          <span className='animate-pulse text-green-400'>▌</span>
        )}
      </p>
    </div>
  );
};

export default PitchDescription;
