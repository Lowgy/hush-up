import Image from 'next/image';
import Link from 'next/link';
import { UsersIcon, PlayIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
  return (
    <>
      <div className="w-full max-w-sm items-center gap-1.5">
        <Input type="email" id="email" placeholder="Enter Your Name" />
      </div>
      <div className="flex flex-row gap-x-6">
        <Button asChild>
          <Link href="/create">
            Create Game
            <PlayIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild>
          <Link href="/join">
            Join Game
            <UsersIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}
