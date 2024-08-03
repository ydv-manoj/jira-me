import IssueStatusBadge from '@/app/components/IssueStatusBadge'
import prisma from '@/prisma/client'
import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

interface Props {
    params: { id: string }
}

const IssueDetailsPage = async ({ params }: Props) => {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) notFound();
    const issueDetails = await prisma.issue.findUnique({
        where: { id }
    });
    if (!issueDetails) notFound();

    return (
        <div>
            <Heading>{issueDetails.title}</Heading>
            <Flex gap="3" my="3">
                <IssueStatusBadge status={issueDetails.Status}/>
                <Text>{issueDetails.CreatedAt.toDateString()}</Text>
            </Flex>
            <Card className='prose mt-4'>
                <ReactMarkdown>{issueDetails.description}</ReactMarkdown>
            </Card>
        </div>
    );
}

export default IssueDetailsPage;
