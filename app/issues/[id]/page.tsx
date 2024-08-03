import {IssueStatusBadge} from '@/app/components'
import prisma from '@/prisma/client'
import { Box, Button, Card, Flex, Grid, Heading, Text } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Pencil2Icon } from '@radix-ui/react-icons'
import Link from 'next/link'
import IssueDetails from './IssueDetails'
import EditIssueButton from './EditIssueButton'


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
        <Grid columns={{initial:"1",md:"2"}} gap="5">
            <Box>
               <IssueDetails issueDetails={issueDetails}/>
            </Box>
            <Box>
                <EditIssueButton issueId={issueDetails.id} />
            </Box>

        </Grid>
    );
}

export default IssueDetailsPage;
