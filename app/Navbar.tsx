"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { AiFillBug } from "react-icons/ai";
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { Box, Flex,Container, DropdownMenu, Avatar, Text } from '@radix-ui/themes';
import {Skeleton} from '@/app/components'




const Navbar = () => {
    const {status,data:session}=useSession()
    const currPath=usePathname()
    const links=[
        {label:'Dashboard',href:'/'},
        {label:'Issues',href:'/issues/list'},
        {label:'Kanban',href:'/kanban'}
    ]
  return (
    <nav className=' border-b mb-5 px-5 py-3'>
        <Container>
            <Flex justify="between" align="center">
                <Link href="/"><AiFillBug/></Link>
                <ul className='flex space-x-6'>
                    {links.map((link)=><li key={link.href}><Link className={classnames({
                        'text-zinc-900':link.href===currPath,
                        'text-zinc-500':link.href!==currPath,
                        'hover:text-zinc-800 transition-colors':true
                    })} href={link.href}>{link.label}</Link></li>)}
                </ul>
                <Box>
                    {status==='authenticated' && 
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Avatar src={session.user!.image!} 
                                    fallback="?" 
                                    size="2" 
                                    radius="full" 
                                    className='cursor-pointer'
                                    referrerPolicy='no-referrer'
                                />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Label>
                                    <Text size="2">
                                        {session.user!.email}
                                    </Text>
                                </DropdownMenu.Label>
                                <DropdownMenu.Item>
                                  <Link href='/api/auth/signout'>Logout</Link>
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    }
                    {status==='unauthenticated' && 
                        <Link href='/api/auth/signin'>Log In</Link>
                    }
                    {status==='loading' && <Skeleton width="3rem"/>}
                </Box>
            </Flex>
        </Container>
    </nav>
  )
}

export default Navbar