"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/shadcncomponents/ui/avatar";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import Tooltip from './Tooltip';  // Import the Tooltip component

type AvatarGroupProps = {
  selectedUserId: string | null;
  setSelectedUserId: (userId: string | null) => void;
};

export default function AvatarGroup({ selectedUserId, setSelectedUserId }: AvatarGroupProps) {
  const { data: users, error, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => axios.get('/api/users').then(res => res.data),
    staleTime: 60 * 1000,
    retry: 3,
  });

  if (isLoading) return <div className="flex -space-x-3 pb-4"><Skeleton borderRadius="50%" width="2.5rem" height="2.5rem"/><Skeleton borderRadius="50%" width="2.5rem" height="2.5rem"/></div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="flex -space-x-3 pb-4">
      {users?.map((user) => (
        <Tooltip key={user.id} content={user.name || 'Unknown User'}>
          <Avatar 
            onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
            className={`cursor-pointer ${user.id === selectedUserId ? 'ring-2 ring-blue-500' : ''}`}
          >
            <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
            <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
          </Avatar>
        </Tooltip>
      ))}
    </div>
  );
}