import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useMemo } from 'react'
import { IssueWithUser, KanbanBoard } from '../shadcncomponents/KanbanBoard';
import KanbanLoading from './loading';

interface KanbanBoardWithQueryProps {
  selectedUserId: string | null;
  searchQuery: string;
}

function KanbanBoardWithQuery({ selectedUserId, searchQuery }: KanbanBoardWithQueryProps) {
  const { data: issues, error, isLoading } = useQuery<IssueWithUser[]>({
    queryKey: ['issues', selectedUserId],
    queryFn: () => axios.get(`/api/issues${selectedUserId ? `?userId=${selectedUserId}` : ''}`).then(res => res.data),
    staleTime: 0, // Disable caching
  });

  const filteredIssues = useMemo(() => {
    if (!issues) return [];
    
    return issues.filter(issue => {
      const matchesUser = selectedUserId ? issue.assignedToUserId === selectedUserId : true;
      const matchesSearch = searchQuery
        ? issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      return matchesUser && matchesSearch;
    });
  }, [issues, selectedUserId, searchQuery]);

  if (isLoading) return <div><KanbanLoading/></div>;
  if (error) return <div>Error loading issues</div>;

  return <KanbanBoard issues={filteredIssues} />;
}

export default KanbanBoardWithQuery