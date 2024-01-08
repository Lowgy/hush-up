import { Button } from '@/components/ui/button';
import { Challenge } from '@/types/types';

type ChallengeHowToProps = {
  randomChallenge?: Challenge;
};

export default function ChallengeHowTo({
  randomChallenge,
}: ChallengeHowToProps) {
  return (
    <section className="w-full mt-8">
      <div className="container mx-auto bg-[#FFD700] rounded-lg dark:bg-gray-800">
        <div className="grid grid-cols-2 gap-4 p-8">
          <div className="pr-4 border-r-2 border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl font-bold text-center mb-2 dark:text-gray-200">
              {randomChallenge?.name}
            </h1>
            <p className="text-lg text-center text-black mb-4">
              {randomChallenge?.description}
            </p>
          </div>
          <div className="pl-4">
            <h2 className="text-2xl font-bold text-center mb-2 dark:text-gray-200">
              Game Rules
            </h2>
            <ul className="list-none pl-5 space-y-2 text-black  text-center">
              <li className="text-lg">
                <span className="font-bold">Rule 1:</span> EVERYONE HAS TO BE
                QUIET!
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 2:</span> No cheating.
              </li>
              <li className="text-lg">
                <span className="font-bold">Rule 3:</span> Play fair and have
                fun.
              </li>
            </ul>
          </div>
        </div>
        <div className="p-6 border-t-2 rounded-md dark:bg-gray-700">
          <h2 className="text-2xl font-bold text-center mb-2 dark:text-gray-200">
            Consequences
          </h2>
          <p className="text-lg text-center text-black  mb-4">
            If the challenge is failed, then you will owe{' '}
            {randomChallenge?.consequence} drinks
          </p>
          <Button className="w-full h-12 flex items-center justify-center text-lg font-semibold bg-black text-white hover:text-black hover:bg-[#FFD700] hover:border-2 hover:border-black">
            Quiet Time!
          </Button>
        </div>
      </div>
    </section>
  );
}
