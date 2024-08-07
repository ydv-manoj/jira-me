import Pagination from '@/app/components/Pagination'
import prisma from '@/prisma/client'
import { Issue, Status } from '@prisma/client'
import IssueActions from './IssueActions'
import IssueTable, { columnNames } from './IssueTable'
import { Flex } from '@radix-ui/themes'

const IssuePage = async ({ searchParams }: { searchParams: { status: Status, orderBy: keyof Issue, page: string } }) => {

  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status) ? searchParams.status : undefined;

  const orderBy = columnNames.includes(searchParams.orderBy) ? { [searchParams.orderBy]: 'asc' } : undefined

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const data = await prisma.issue.findMany({
    where: {
      Status: status  // Corrected field name
    },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize
  });

  const issueCount = await prisma.issue.count({
    where: { Status: status }
  })

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issue={data} />
      <Pagination pageSize={pageSize} currentPage={page} itemCount={issueCount} />
    </Flex>
  )
}

export default IssuePage
