"use client"
import { Flex } from '@radix-ui/themes';
import { Suspense, useCallback, useState } from 'react';
import AvatarGroup from './avatar/AvatarGroup';
import KanbanBoardWithQuery from './KananBoardWithQuery';
import SearchBox from './searchbox/SearchBox';

export default function KanbanPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const handleUserSelect = useCallback((userId: string | null) => {
    setSelectedUserId(userId);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Flex align="center" justify="between">
        <AvatarGroup 
          selectedUserId={selectedUserId}
          setSelectedUserId={handleUserSelect}
        />
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
      </Flex>
      <KanbanBoardWithQuery 
        key={`${selectedUserId}-${searchQuery}`} 
        selectedUserId={selectedUserId} 
        searchQuery={searchQuery}
        setIsLoading={setIsLoading}
      />
    </Suspense>
  );
}