import prisma from '@/prisma/client'
import { Table } from '@radix-ui/themes'
import { Link, IssueStatusBadge } from '@/app/components'
import IssueActions from './IssueActions'
import { Status } from '@prisma/client'

const IssuePage = async ({ searchParams }: { searchParams: { status: Status } }) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status) ? searchParams.status : undefined;
  
  const data = await prisma.issue.findMany({
    where: {
      Status: status  // Corrected field name
    }
  });

  return (
    <div>
      <IssueActions />
      <Table.Root variant='surface'>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className='hidden md:table-cell'>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className='hidden md:table-cell'>Created</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map(issue => (
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
    </div>
  )
}

export default IssuePage
