'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocketContext } from '@/context/socket';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import UserContext from '@/context/user';
import RoomContext from '@/context/room';

const FormSchema = z.object({
  roomCode: z
    .string()
    .min(2, { message: 'Room Code must be at least 4 characters' }),
});

function RoomCodeInputForm() {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const url =
    process.env.NODE_ENV === 'production'
      ? 'https://hush-up-app-server.onrender.com'
      : 'http://localhost:3001';
  const { setRoomInfo } = useContext(RoomContext);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetch(`${url}/joinRoom/${data.roomCode}`, { method: 'GET' })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.canJoin) {
          socket.emit(
            'joinRoom',
            data.roomInfo.id,
            data.roomInfo.code,
            user.userName
          );
          socket.on('joinedRoom', () => {
            setRoomInfo(data.roomInfo);
            router.push(`/room/${data.roomInfo.id}`);
            toast({
              title: 'Successfully joined!',
              variant: 'default',
            });
          });
        }
      })
      .catch((error) => {
        console.error('Error joining room:', error);
        toast({
          title: 'Error joining room:',
          variant: 'destructive',
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{error}</code>
            </pre>
          ),
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
        <FormField
          control={form.control}
          name="roomCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter 4 Digit Room Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full disabled:bg-gray-400 disabled:text-white bg-[#FFD700] text-black hover:text-white hover:bg-yellow-300"
        >
          Join Room
        </Button>
      </form>
      <Link href="/" className="underline text-sm text-white">
        Go Back
      </Link>
    </Form>
  );
}

export default function JoinPage() {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <RoomCodeInputForm />
      <Link href="/" className="underline text-sm">
        Go Back
      </Link>
    </div>
  );
}
