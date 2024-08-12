import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { TextField } from '@radix-ui/themes'
import React, { useState, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery);
  }, [onSearch]);

  if (isLoading) {
    return (
      <Skeleton width="10rem" height="2rem"/>
    );
  }

  return (
    <TextField.Root
        placeholder="Search Issues..."
        value={query}
        onChange={handleInputChange}
    >
      <TextField.Slot>
        <MagnifyingGlassIcon height="16" width="16" />
      </TextField.Slot>
    </TextField.Root>
  )
}

export default SearchBox