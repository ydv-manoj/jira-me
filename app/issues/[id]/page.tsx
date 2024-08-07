import authOptions from '@/app/api/auth/authOptions'
import prisma from '@/prisma/client'
import { Box, Flex, Grid } from '@radix-ui/themes'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import AssigneSelect from './AssigneSelect'
import DeleteIssueButton from './DeleteIssueButton'
import EditIssueButton from './EditIssueButton'
import IssueDetails from './IssueDetails'

interface Props {
    params: { id: string }
}

const IssueDetailsPage = async ({ params }: Props) => {
    const session = await getServerSession(authOptions);
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
        notFound();  // Ensure this function call correctly handles navigation
    }

    const issueDetails = await prisma.issue.findUnique({
        where: { id }
    });

    if (!issueDetails) {
        notFound();  // Ensure this function call correctly handles navigation
    }

    return (
        <Grid columns={{ initial: "1", sm: "5" }} gap="5">
            <Box className='md:col-span-4'>
                <IssueDetails issueDetails={issueDetails} />
            </Box>

            {session ? (
                <Box>
                    <Flex direction="column" gap="3">
                        <AssigneSelect issue={issueDetails} />
                        <EditIssueButton issueId={issueDetails.id} />
                        <DeleteIssueButton issueId={issueDetails.id} />
                    </Flex>
                </Box>
            ) : null}
        </Grid>
    );
}

export default IssueDetailsPage;
