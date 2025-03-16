const Scores = ({
  scores,
  flashing,
}: {
  scores: { score: number; highscore: number };
  flashing: boolean;
}) => {
  return (
    <>
      <header className="sticky top-0 z-50 h-0 justify-center hidden md:flex">
        <div className="flex-1 flex justify-end">
          <div className="text-right">
            <div
              className={`pr-4 pb-2 text-5xl font-black flash-element ${
                flashing ? 'flashing' : ''
              }`}
            >
              {scores.score}
            </div>
            <div className="pr-5 -mt-1 font-bold">Score</div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="text-left">
            <div className="pl-3 text-5xl font-black pb-2">
              {scores.highscore}
            </div>
            <div className="pl-3 -mt-1 font-bold">Highscore</div>
          </div>
        </div>
      </header>
      <header className="absolute right-0 z-50 h-full flex flex-col md:hidden">
        <div className="flex-1 flex">
          <div className="text-left flex flex-1 flex-col justify-end items-end">
            <div className="flex pb-1">
              <div className="pr-0 md:pr-3 pt-1">Score</div>

              <div
                className={`pr-3 pb-2 pl-3 md:pl-0 text-2xl font-black flash-element ${
                  flashing ? 'flashing' : ''
                }`}
              >
                {scores.score}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="text-left flex">
            <div className="pr-3 pt-1">Highscore</div>
            <div className="pr-3 text-2xl font-black pb-2">
              {scores.highscore}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Scores;
