import prisma from '@/prisma/client'
import { Button,Table } from '@radix-ui/themes'
import Link from 'next/link'
import React from 'react'

const IssuePage = async () => {
  const data = await prisma.issue.findMany();
  return (
    <div>
      <div className='mb-5'>
        <Button><Link href='/issues/new'>New issue</Link></Button>
      </div>
      <Table.Root variant='surface'>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className='hidden md:table-cell'>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className='hidden md:table-cell'>Created</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map(issue=>(
               <Table.Row key={issue.id}>
               <Table.RowHeaderCell>
                 {issue.title}
                 <div className='block md:hidden'>{issue.Status}</div>
                </Table.RowHeaderCell>
               <Table.Cell className='hidden md:table-cell'>{issue.Status}</Table.Cell>
               <Table.Cell className='hidden md:table-cell'>{issue.CreatedAt.toDateString()}</Table.Cell>
             </Table.Row>
            ))} 
          </Table.Body>
      </Table.Root>
    </div>
  )
}

export default IssuePage