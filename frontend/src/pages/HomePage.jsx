import { useState } from 'react';
import URLForm from '../components/URLForm';
import PitchDescription from '../components/PitchDescription';
import Results from '../components/Results';

const INTRO =
  'ShipReady is a web app that helps hackathon teams audit their own project before presenting to judges. A team pastes a GitHub repo link and project description; ShipReady scans for missing README sections, exposed API keys, weak setup instructions, and demo readiness, then generates a 60-second pitch using OpenAI. Built for the AI-assisted development era — vibe coders ship fast, we help them ship clean.';

// TODO: remove when real API is wired — replace with postAnalyze + postPitch from src/api/
const MOCK_RESULT = {
  scores: { readme: 45, security: 78, setup: 60, ux: 85, demo: 92 },
  aggregateScore: 72,
  readyForJudges: true,
  warnings: [
    { message: 'No .env.example file found', severity: 'high' },
    { message: 'Setup instructions are incomplete', severity: 'medium' },
    { message: 'Missing demo screenshots in README', severity: 'low' },
  ],
  fixes: [
    { title: 'Add .env.example', description: 'Create a template with all required env variable names.' },
    { title: 'Expand setup section', description: 'Add step-by-step install instructions to README.' },
  ],
};

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

  const handleSubmit = async ({ repoUrl: _repoUrl }) => {
    setHasSubmitted(true);
    setIsLoading(true);
    setIsStreaming(true);

    // TODO: replace with postAnalyze + postPitch from src/api/ when backend is live
    await new Promise((r) => setTimeout(r, 1000));
    setResult(MOCK_RESULT);
    setPitch('ShipReady scanned your repo. Here is your 60-second pitch.');
    setIsLoading(false);
    setIsStreaming(false);
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
