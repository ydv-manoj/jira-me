import { IssueStatusBadge } from '@/app/components'
import { Issue } from '@prisma/client'
import { Heading, Flex, Card,Text} from '@radix-ui/themes'
import React from 'react'
import ReactMarkdown from 'react-markdown'

const IssueDetails = ({issueDetails}:{issueDetails:Issue}) => {
  return (
    <>
        <Heading>{issueDetails.title}</Heading>
        <Flex gap="3" my="3">
            <IssueStatusBadge status={issueDetails.Status}/>
            <Text>{issueDetails.CreatedAt.toDateString()}</Text>
        </Flex>
        <Card className='prose mt-4'>
            <ReactMarkdown>{issueDetails.description}</ReactMarkdown>
        </Card>
    </>
  )
}

export default IssueDetails