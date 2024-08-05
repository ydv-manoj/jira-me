"use client"
import {
    QueryClient,
    QueryClientProvider as ClientProvider,
    useQuery,
  } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
  
  const queryClient = new QueryClient()
  
  export default function QueryClientProvider({children}:PropsWithChildren) {
    return (
      <ClientProvider client={queryClient}>
        {children}
      </ClientProvider>
    )
  }
  

  