import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { TextField } from '@radix-ui/themes'
import React from 'react'

const SearchBox = () => {
  return (
      <TextField.Root placeholder="Search an Issues...">
          <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
      </TextField.Root>
  )
}

export default SearchBox