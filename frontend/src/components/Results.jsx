import { useState, useEffect } from 'react';

const SCORE_KEYS = ['readme', 'security', 'setup', 'ux', 'demo'];
const SCORE_LABELS = { readme: 'README', security: 'Security', setup: 'Setup', ux: 'UX', demo: 'Demo' };
const CARD_DELAYS = ['delay-[0ms]', 'delay-[100ms]', 'delay-[200ms]', 'delay-[300ms]', 'delay-[400ms]'];

const scoreText = (s) => (s >= 70 ? 'text-green-400' : s >= 40 ? 'text-yellow-400' : 'text-red-400');
const scoreDot  = (s) => (s >= 70 ? 'bg-green-400'  : s >= 40 ? 'bg-yellow-400'  : 'bg-red-400');

const useCounter = (target, active) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) { setCount(0); return; }
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + 2, target);
      setCount(cur);
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [target, active]);
  return count;
};

const ScoreDots = ({ score }) => (
  <div className='flex gap-0.5 mt-1.5'>
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className={`h-0.5 flex-1 rounded-full transition-all duration-700 ${i < Math.round(score / 10) ? scoreDot(score) : 'bg-gray-700'}`}
      />
    ))}
  </div>
);

const ScoreCard = ({ label, score, delay, visible }) => {
  const count = useCounter(score, visible);
  return (
    <div
      className={`bg-gray-800 rounded-lg px-4 py-2.5 transition-all duration-500 ease-out ${delay} ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}
    >
      <div className='flex items-center justify-between'>
        <span className='text-gray-500 text-xs uppercase tracking-widest'>{label}</span>
        <span className={`text-xl font-bold tabular-nums ${scoreText(score)}`}>{count}</span>
      </div>
      <ScoreDots score={score} />
    </div>
  );
};

const Results = ({ result, isVisible }) => {
  const aggregate = useCounter(result?.aggregateScore ?? 0, isVisible);

  if (!result) return null;

  const { scores, aggregateScore, readyForJudges, warnings, fixes } = result;

  return (
    <div className={`flex flex-col gap-4 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

      <div className='bg-gray-900 rounded-xl p-6 flex gap-6 items-stretch'>
        <div className='flex flex-col justify-between gap-6 shrink-0'>
          <div>
            <p className='text-gray-400 text-xs uppercase tracking-widest mb-1'>Overall</p>
            <span className={`text-7xl font-bold tabular-nums leading-none ${scoreText(aggregateScore)}`}>
              {aggregate}
            </span>
          </div>
          <div className={`self-start px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 ${readyForJudges ? 'bg-green-950 text-green-400' : 'bg-red-950 text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${readyForJudges ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {readyForJudges ? 'Ready for Judges' : 'Not Ready'}
          </div>
        </div>

        <div className='w-px bg-gray-800 shrink-0' />

        <div className='flex flex-col gap-2 flex-1'>
          {SCORE_KEYS.map((key, i) => (
            <ScoreCard
              key={key}
              label={SCORE_LABELS[key]}
              score={scores[key]}
              delay={CARD_DELAYS[i]}
              visible={isVisible}
            />
          ))}
        </div>
      </div>

      {warnings.length > 0 && (
        <div className={`bg-gray-900 rounded-xl p-6 transition-all duration-500 delay-[600ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className='text-gray-400 text-xs uppercase tracking-widest mb-4'>Warnings</p>
          <ul className='flex flex-col gap-2'>
            {warnings.map((w, i) => (
              <li key={i} className='flex items-start gap-3 text-sm'>
                <span className='text-yellow-400 shrink-0 mt-0.5'>⚠</span>
                <span className='text-gray-300'>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fixes.length > 0 && (
        <div className={`bg-gray-900 rounded-xl p-6 transition-all duration-500 delay-[700ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className='text-gray-400 text-xs uppercase tracking-widest mb-4'>Fix Board</p>
          <ul className='flex flex-col gap-3'>
            {fixes.map((f, i) => (
              <li key={i} className='flex items-start gap-3'>
                <span className='text-green-400 mt-0.5 shrink-0'>→</span>
                <p className='text-gray-300 text-sm'>{f}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Results;
