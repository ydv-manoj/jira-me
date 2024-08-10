"use client"
import { Flex } from '@radix-ui/themes';
import { Suspense, useCallback, useState } from 'react';
import AvatarGroup from './avatar/AvatarGroup';
import KanbanBoardWithQuery from './KananBoardWithQuery';
import SearchBox from './searchbox/SearchBox';

export default function KanbanPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleUserSelect = useCallback((userId: string | null) => {
    setSelectedUserId(userId);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Flex align="center" justify="between">
        <AvatarGroup 
          selectedUserId={selectedUserId}
          setSelectedUserId={handleUserSelect}
        />
        <SearchBox/>
      </Flex>
      <KanbanBoardWithQuery key={selectedUserId} selectedUserId={selectedUserId} />
    </Suspense>
  );
}

