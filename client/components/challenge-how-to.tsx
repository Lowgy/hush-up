import { Button } from '@/components/ui/button';

export default function ChallengeHowTo() {
  return (
    <section className="w-full h-screen p-10 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4 p-8">
          <div className="pr-4 border-r-2 border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-center mb-2 dark:text-gray-200">
              Challenge Name
            </h1>
            <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-4">
              Short description about the challenge goes here.
            </p>
          </div>
          <div className="pl-4">
            <h2 className="text-2xl font-bold text-center mb-2 dark:text-gray-200">
              Game Rules
            </h2>
            <ul className="list-none pl-5 space-y-2 text-gray-700 dark:text-gray-300 text-center">
              <li className="text-lg">
                <span className="font-bold">Rule 1:</span> Respect all players.
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 2:</span> No cheating or
                exploiting glitches.
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 3:</span> Do not share personal
                information.
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 4:</span> No spamming or
                advertising.
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 5:</span> Play fair and have
                fun.
              </li>
            </ul>
          </div>
        </div>
        <div className="p-6 bg-gray-50 dark:bg-gray-700">
          <h2 className="text-2xl font-bold text-center mb-2 dark:text-gray-200">
            Consequences
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-4">
            If the challenge is failed, you will have to start over. Keep trying
            until you succeed!
          </p>
          <Button
            className="w-full h-12 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            variant="outline"
          >
            Start Challenge
          </Button>
        </div>
      </div>
    </section>
  );
}
