"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/shadcncomponents/ui/avatar";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default async function AvatarGroup() {
    const { data: users, error, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => axios.get('/api/users').then(res => res.data),
        staleTime: 60 * 1000,
        retry: 3,
    });
    console.log(users);
  return (
    <div className="flex -space-x-3 *:ring *:ring-white pb-4">
        {users?.map((user)=>
            <Avatar key={user.id}>
                <AvatarImage src={user.image!}/>
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
        )}
    </div>
  );
}