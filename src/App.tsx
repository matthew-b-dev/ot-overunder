import { useEffect, useState } from 'react';
import './App.css';
import _ from 'lodash';
import CountUp from 'react-countup';
import { Tooltip } from 'react-tooltip';
import { CommunityOT, ellipsis, popRandom } from './utils';
import Scores from './components/scores';
import { DATA } from './data/data';

const INITIAL_DATA = _.cloneDeep(DATA);
const INITIAL_KNOWN = popRandom(INITIAL_DATA, true);
const INITIAL_UNKNOWN = popRandom(INITIAL_DATA);

const App = () => {
  const [threads, setThreads] = useState<CommunityOT[]>(INITIAL_DATA);
  const [knownThread, setKnownThread] = useState<CommunityOT>(INITIAL_KNOWN);
  const [unknownThread, setUnknownThread] =
    useState<CommunityOT>(INITIAL_UNKNOWN);
  const [isStationary, setIsStationary] = useState(true);
  const [isCounting, setIsCounting] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [threadsHidden, setThreadsHidden] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [scores, setScores] = useState({
    score: 0,
    highscore: Number(window.localStorage.getItem('HIGHSCORE')) || 0,
  });

  /* Store changes to Highschore in local storage */
  useEffect(() => {
    const highScoreFromLocal = window.localStorage.getItem('HIGHSCORE');
    if (highScoreFromLocal && Number(highScoreFromLocal) < scores.highscore) {
      window.localStorage.setItem('HIGHSCORE', String(scores.highscore));
    } else {
      window.localStorage.setItem('HIGHSCORE', '0');
    }
  }, [scores.highscore]);

  /* 'More' or 'Less' clicked */
  const handleGuess = (moreGuessed: boolean) => {
    /* Begin counting animation  for 'Unkown thread' comments # */
    setIsCounting(true);
    /* If incorrect, wait 2 seconds for the counting animation to complete */
    if (
      (moreGuessed && knownThread.comments > unknownThread.comments) ||
      (!moreGuessed && knownThread.comments < unknownThread.comments)
    ) {
      setTimeout(() => {
        /* Enter the Game Over state */
        setGameOver(true);
      }, 2000);
    } else {
      /* If correct, wait 2 seconds for the counting animation to complete */
      setTimeout(() => {
        /* Flash the 'Score' container with green */
        triggerFlash();
        setScores({
          score: scores.score + 1,
          highscore:
            scores.score + 1 > scores.highscore
              ? scores.score + 1
              : scores.highscore,
        });
        /* Begin sliding elements for 500ms */
        setIsStationary(!isStationary);
        setTimeout(() => {
          /* After 500ms slide, update the elements in-place */
          setKnownThread(unknownThread);
          const threadsCopy = _.cloneDeep(threads);
          const newUnknownThread = popRandom(threadsCopy);
          setUnknownThread(newUnknownThread);
          setThreads(threadsCopy);
          setIsStationary(isStationary);
          setIsCounting(false);
        }, 505);
      }, 2000);
    }
  };

  /* Play again after Game Over */
  const handlePlayAgain = () => {
    /* Hide threads, reset score */
    setThreadsHidden(true);
    setScores({
      score: 0,
      highscore:
        scores.score > scores.highscore ? scores.score : scores.highscore,
    });
    setTimeout(() => {
      /* .5 sec later, reset game */
      setGameOver(false);
      setTimeout(() => {
        /* 100ms later, show threads */
        const threadsCopy = _.cloneDeep(DATA);
        setKnownThread(popRandom(threadsCopy, true));
        setUnknownThread(popRandom(threadsCopy));
        setThreads(threadsCopy);
        setThreadsHidden(false);
        setIsCounting(false);
      }, 100);
    }, 505);
  };

  const triggerFlash = () => {
    setFlashing(true);
    setTimeout(() => {
      setFlashing(false);
    }, 300);
  };

  return (
    <>
      <Scores flashing={flashing} scores={scores} />
      <div className="app-container flex flex-col md:flex-row justify-center ">
        <div
          className={`flex flex-1 items-center justify-center border-dashed border-b-6 md:border-r-6 md:border-b-0 border-zinc-900 slide-element ${
            isStationary
              ? 'transform-[translateY(0)] md:transform-[translateX(0)] !duration-0 ease-in-out'
              : 'transform-[translateY(-100%)] md:transform-[translateX(-100%)] !duration-500 ease-in-out'
          }`}
        >
          <div
            className={`flex flex-col items-center px-5 fade-element ${
              threadsHidden ? 'opacity-hidden' : ''
            }`}
          >
            <div className="mb-0 md:mb-2">
              The{' '}
              <span
                id="known-tooltip"
                className="underline cursor-help decoration-dashed text-yellow-500"
              >
                combined community |OT|s
              </span>{' '}
              for ...{' '}
            </div>
            <div className="font-bold text-xl md:text-4xl text-center">
              {knownThread.title}
            </div>
            <div className="items-center justify-center text-center mt-0 md:mt-2">
              <div className="items-center align-center">have</div>
              <div className="font-bold text-5xl items-center flex justify-center align-center h-[68px]">
                <div>{knownThread.comments.toLocaleString()}</div>
              </div>
              <div className="h-full items-center align-center">comments.</div>
            </div>
          </div>
        </div>
        <div
          id="unknown-thread"
          className={`flex flex-1 items-center justify-center border-b-6 border-dashed md:border-r-6 md:border-b-0 slide-element ${
            isStationary
              ? 'border-[#242424] transform-[translateY(0)] md:transform-[translateX(0)] !duration-0 ease-in-out'
              : 'border-zinc-900 transform-[translateY(-100%)] md:transform-[translateX(-100%)] !duration-500 ease-in-out'
          }`}
        >
          <div
            className={`flex flex-col items-center px-5 fade-element ${
              threadsHidden ? 'opacity-hidden' : ''
            }`}
          >
            <div className="mb-0 md:mb-2">
              {/* Tooltip only shown if Game Over */}
              The{' '}
              <span
                id="unknown-tooltip"
                className={
                  gameOver
                    ? 'underline cursor-help decoration-dashed text-yellow-500'
                    : ''
                }
              >
                combined community |OT|s
              </span>{' '}
              for ...{' '}
            </div>
            <div className="font-bold text-xl md:text-4xl text-center">
              {unknownThread.title}
            </div>
            <div className="items-center justify-center text-center mt-0 md:mt-2">
              <div className="h-full items-center align-center">have</div>
              {!isCounting && isStationary && (
                <div className="mt-3 flex space-x-3 font-bold text-3xl h-full items-center align-center">
                  <button
                    className="animated-b"
                    onClick={() => handleGuess(true)}
                  >
                    <span className="animated-b-shadow"></span>
                    <span className="animated-b-edge"></span>
                    <span className="animated-b-front">+ More</span>
                  </button>
                  <button
                    className="animated-b animated-b-red"
                    onClick={() => handleGuess(false)}
                  >
                    <span className="animated-b-shadow"></span>
                    <span className="animated-b-edge"></span>
                    <span className="animated-b-front">- Less</span>
                  </button>
                </div>
              )}
              {!isCounting && !isStationary && (
                <div className="font-bold text-5xl items-center flex justify-center align-center h-[68px]">
                  {knownThread.comments.toLocaleString()}
                </div>
              )}
              {isCounting && (
                <div className="font-bold text-5xl items-center flex justify-center align-center h-[60px] pt-[7px]">
                  <CountUp end={unknownThread.comments} />
                </div>
              )}
              <div className="h-full items-center align-center mt-2">
                comments.
              </div>
              {gameOver && (
                <div>
                  <div className="mt-1 md:text-xl md:mt-5">Game Over!</div>
                  <button className="animated-b mt-2" onClick={handlePlayAgain}>
                    <span className="animated-b-shadow"></span>
                    <span className="animated-b-edge"></span>
                    <span id="play-again" className="animated-b-front">
                      Play Again
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <Tooltip
          anchorSelect="#known-tooltip"
          style={{ backgroundColor: '#141414' }}
        >
          <div className="font-bold">
            Threads ({knownThread.threads.length}):
          </div>
          {knownThread.threads.slice(0, 3).map((t, i) => (
            <div key={i}>{`${ellipsis(
              t.title
            )} (${t.comments.toLocaleString()})`}</div>
          ))}
          {knownThread.threads.length > 3 && (
            <div>... and {knownThread.threads.length - 3} more.</div>
          )}
        </Tooltip>
        {/* 'Unknown Thread' tooltip only rendered if Game Over */}
        {gameOver && (
          <Tooltip
            anchorSelect="#unknown-tooltip"
            style={{ backgroundColor: '#141414' }}
          >
            <div className="font-bold">
              Threads ({unknownThread.threads.length}):
            </div>
            {unknownThread.threads.slice(0, 3).map((t, i) => (
              <div key={i}>{`${ellipsis(
                t.title
              )} (${t.comments.toLocaleString()})`}</div>
            ))}
            {unknownThread.threads.length > 3 && (
              <div>... and {unknownThread.threads.length - 3} more.</div>
            )}
          </Tooltip>
        )}
        <div className="bg-[#007a31] bg-[#8a0007]"></div>
        <a
          className="absolute left-4 bottom-4 text-yellow-500 underline z-100"
          href="https://github.com/matthew-b-dev/ot-overunder"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
      </div>
    </>
  );
};

export default App;
