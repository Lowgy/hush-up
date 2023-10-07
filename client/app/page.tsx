'use client';

import { ChangeEvent, useContext, useState } from 'react';
import UserContext from '@/context/user';

import { UsersIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setErrorFlag] = useState(false);
  const { setUsername } = useContext(UserContext);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameCreation = (path: string) => {
    if (name === '') {
      setErrorFlag(true);
    } else {
      setErrorFlag(false);
      setUsername(name);
      router.push(`/${path}`);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm items-center gap-1.5">
        <Input
          type="email"
          id="email"
          placeholder="Enter Your Name"
          className={`${error ? 'text-red-500' : ''}`}
          value={name}
          onChange={handleInputChange}
        />
        {error && <p className="text-red-500 text-sm">A name is required!</p>}
      </div>
      <div className="flex flex-row gap-x-6">
        <Button onClick={() => handleNameCreation('create')}>
          Create Game
          <PlayIcon className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={() => handleNameCreation('join')}>
          Join Game
          <UsersIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
