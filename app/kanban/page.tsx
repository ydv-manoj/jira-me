"use client"
import { Suspense } from 'react';
import AvatarGroup from '../components/AvatarGroup';
import { IssueWithUser, KanbanBoard } from '../shadcncomponents/KanbanBoard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useCallback } from 'react';
import KanbanLoading from './loading';

export default function KanbanPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = useCallback((userId: string | null) => {
    setSelectedUserId(userId);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvatarGroup 
        selectedUserId={selectedUserId}
        setSelectedUserId={handleUserSelect}
      />
      <KanbanBoardWithQuery key={selectedUserId} selectedUserId={selectedUserId} />
    </Suspense>
  );
}

function KanbanBoardWithQuery({ selectedUserId }: { selectedUserId: string | null }) {
  const { data: issues, error, isLoading } = useQuery<IssueWithUser[]>({
    queryKey: ['issues', selectedUserId],
    queryFn: () => axios.get(`/api/issues${selectedUserId ? `?userId=${selectedUserId}` : ''}`).then(res => res.data),
    staleTime: 0, // Disable caching
  });

  if (isLoading) return <div><KanbanLoading/></div>;
  if (error) return <div>Error loading issues</div>;

  const filteredIssues = selectedUserId
    ? issues?.filter(issue => issue.assignedToUserId === selectedUserId)
    : issues;

  return <KanbanBoard issues={filteredIssues || []} />;
}