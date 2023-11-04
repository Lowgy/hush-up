import { useState, useEffect } from 'react';

type RoleCardProps = {
  role: string;
  isFlipped: boolean;
};

export default function RoleCard({ role, isFlipped }: RoleCardProps) {
  return (
    <div className="w-[300px] h-[420px] bg-transparent cursor-pointer group perspective">
      <div
        className={`relative preserve-3d ${
          isFlipped ? 'my-rotate-y-180' : ''
        } w-full h-full duration-1000`}
      >
        <div className="absolute backface-hidden border-2 border-yellow-300 rounded-md w-full h-full text-center bg-yellow-400">
          <h1 className=" absolute text-white text-7xl transform -rotate-45 flex justify-center items-center h-full w-full">
            🤫
          </h1>
        </div>
        <div
          className={`absolute my-rotate-y-180 backface-hidden w-full rounded-md h-full border-2 ${
            role === 'safe' ? 'bg-green-500 text-white' : 'bg-red-500'
          } border-white overflow-hidden`}
        >
          <div className="text-center flex flex-col items-center justify-center h-full">
            <h1 className="text-7xl">{role === 'safe' ? 'SAFE' : '❌'}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
