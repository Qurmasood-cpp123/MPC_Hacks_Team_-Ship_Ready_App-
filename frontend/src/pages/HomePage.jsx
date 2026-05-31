import { useState } from 'react';
import URLForm from '../components/URLForm';
import PitchDescription from '../components/PitchDescription';
import Results from '../components/Results';
import { postAnalyze } from '../api/analyze';

const INTRO =
  'ShipReady is a web app that helps hackathon teams audit their own project before presenting to judges. A team pastes a GitHub repo link and project description; ShipReady scans for missing README sections, exposed API keys, weak setup instructions, and demo readiness, then generates a 60-second pitch using OpenAI. Built for the AI-assisted development era — vibe coders ship fast, we help them ship clean.';

const HomePage = () => {
  const [pitch, setPitch] = useState(INTRO);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handlePitchDone = () => {
    if (!hasSubmitted) {
      setShowForm(true);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = async ({ repoUrl }) => {
    setHasSubmitted(true);
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const data = await postAnalyze({ repoUrl });
      setResult(data);
      // TODO: replace with real POST /pitch stream when backend route is live
      setPitch('ShipReady scanned your repo. Here is your 60-second pitch.');
    } catch {
      setPitch('Analysis failed. Make sure the repo is public and try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className='min-h-screen bg-black text-white flex items-center justify-center p-8'>
      <div className='w-full max-w-2xl flex flex-col gap-6'>
        <PitchDescription
          pitchText={pitch}
          isStreaming={isStreaming}
          onDone={handlePitchDone}
        />
        <div
          className={`transition-all duration-700 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
          <URLForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        <Results result={result} isVisible={showResults} />
      </div>
    </div>
  );
};

export default HomePage;
