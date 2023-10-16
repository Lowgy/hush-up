import { useState, useEffect } from 'react';

export default function RoleCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    console.log('test');
  };
  return (
    <div
      className="w-[300px] h-[420px] bg-transparent cursor-pointer group perspective"
      onClick={handleFlip}
    >
      <div
        className={`relative preserve-3d ${
          isFlipped ? 'my-rotate-y-180' : ''
        } w-full h-full duration-1000`}
      >
        <div className="absolute backface-hidden border-2 border-yellow-300 rounded-md w-full h-full">
          <h1 className="text-white">test</h1>
        </div>
        <div className="absolute my-rotate-y-180 backface-hidden w-full rounded-md h-full bg-yellow-400 overflow-hidden">
          <div className="text-center flex flex-col items-center justify-center h-full text-gray-800">
            <h1 className="text-7xl">❌</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
