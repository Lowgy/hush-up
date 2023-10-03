'use client';

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
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  const handleCreateRoom = () => {
    fetch('http://hush-up-server.vercel.app/createRoom', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        console.log('Room created:', data);
        router.push(`/room/${data.id}`);
      })
      .catch((error) => {
        console.error('Error creating room:', error);
      });
  };

  return (
    <div className="flex flex-col gap-y-4 items-center">
      <div className="w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">How many rounds?</Label>
        <Input type="number" id="number" max={20} placeholder="" />
      </div>
      <div className="w-full max-w-sm items-center gap-1.5">
        <Label>Choose Game Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Game Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Game Type 1</SelectItem>
            <SelectItem value="dark">Game Type 2</SelectItem>
            <SelectItem value="system">Game Type 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="w-full" onClick={handleCreateRoom}>
        Create Room
      </Button>
      <Link href="/" className="underline text-sm">
        Go Back
      </Link>
    </div>
  );
}
