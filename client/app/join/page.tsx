'use client';

import { useContext } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SocketContext } from '@/context/socket';

export default function JoinPage() {
  const socket = useContext(SocketContext);

  const handleJoinRoom = () => {
    console.log('TETSETST');
  };

  return (
    <div className="flex flex-col gap-y-4 items-center">
      <div className="w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="code">Room Code</Label>
        <Input
          type="text"
          id="code"
          max={20}
          placeholder="Enter 4 Digit Room Code"
        />
      </div>
      <Button className="w-full" onClick={handleJoinRoom}>
        Join Room
      </Button>
      <Link href="/" className="underline text-sm">
        Go Back
      </Link>
    </div>
  );
}
