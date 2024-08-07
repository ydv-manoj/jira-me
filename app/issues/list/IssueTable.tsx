import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Table } from '@radix-ui/themes'
import NextLink from 'next/link'
import React from 'react'
import { IssueStatusBadge, Link } from '@/app/components'
import { Issue, Status } from '@prisma/client'


interface Props {
    searchParams: {
        status: Status, orderBy: keyof Issue, page: string
    }
    issue: Issue[]
}

const IssueTable = ({ searchParams, issue }: Props) => {

    return (
        <Table.Root variant='surface'>
            <Table.Header>
                <Table.Row>
                    {columns.map((column) =>
                        <Table.ColumnHeaderCell key={column.value} className={column.className}>
                            <NextLink href={{
                                query: { ...searchParams, orderBy: column.value }
                            }}>{column.label}</NextLink>
                            {column.value === searchParams.orderBy && <ArrowUpIcon className='inline' />}
                        </Table.ColumnHeaderCell>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {issue.map(issue => (
                    <Table.Row key={issue.id}>
                        <Table.RowHeaderCell>
                            <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                            <div className='block md:hidden'><IssueStatusBadge status={issue.Status} /></div>
                        </Table.RowHeaderCell>
                        <Table.Cell className='hidden md:table-cell'><IssueStatusBadge status={issue.Status} /></Table.Cell>
                        <Table.Cell className='hidden md:table-cell'>{issue.CreatedAt.toDateString()}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}

export default IssueTable



const columns: { label: string, value: keyof Issue, className?: string }[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'Status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'CreatedAt', className: 'hidden md:table-cell' },
]

export const columnNames = columns.map(column => column.value)