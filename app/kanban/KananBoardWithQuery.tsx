import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { IssueWithUser, KanbanBoard } from '../shadcncomponents/KanbanBoard';
import KanbanLoading from './loading';

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

export default KanbanBoardWithQuery