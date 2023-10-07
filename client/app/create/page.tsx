'use client';

import { useState, ChangeEvent, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SocketContext } from '@/context/socket';
import UserContext from '@/context/user';

export default function CreatePage() {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const router = useRouter();
  const [value, setValue] = useState('');
  const [rounds, setRounds] = useState(0);

  const handleCreateRoom = () => {
    fetch('http://localhost:3001/createRoom', {
      method: 'POST',
      body: JSON.stringify({ rounds: rounds, gameType: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Room created:', data);
        router.push(`/room/${data.id}`);
      })
      .catch((error) => {
        console.error('Error creating room:', error);
      });
  };

  const handleRoundSelection = (e: ChangeEvent<HTMLInputElement>) => {
    setRounds(e.target.valueAsNumber);
  };

  const gameTypes: any = { chill: 'Chill', active: 'Active', crazy: 'Crazy' };

  return (
    <div className="flex flex-col gap-y-4 items-center">
      <div className="w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">How many rounds?</Label>
        <Input
          type="number"
          id="number"
          min={1}
          max={20}
          placeholder=""
          onChange={handleRoundSelection}
        />
      </div>
      <div className="w-full max-w-sm items-center gap-1.5">
        <Label>Choose Game Type</Label>
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select game type" aria-label={value}>
              {gameTypes[value]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chill">
              Chill
              <p className="text-xs text-gray-400">
                (Sitting down mainly / Limited Space)
              </p>
            </SelectItem>
            <SelectItem value="active">
              Active
              <p className="text-xs text-gray-400">
                (Up to Moving around / More Space)
              </p>
            </SelectItem>
            <SelectItem value="crazy">
              Crazy <p className="text-xs text-gray-400">(Balls to the wall)</p>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full"
        onClick={handleCreateRoom}
        disabled={!value || !rounds}
      >
        Create Room
      </Button>
      <Link href="/" className="underline text-sm">
        Go Back
      </Link>
    </div>
  );
}
