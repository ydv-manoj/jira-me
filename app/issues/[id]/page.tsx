import prisma from '@/prisma/client'
import { Box, Grid,Flex } from '@radix-ui/themes'
import { notFound } from 'next/navigation'
import DeleteIssueButton from './DeleteIssueButton'
import EditIssueButton from './EditIssueButton'
import IssueDetails from './IssueDetails'
import { getServerSession } from 'next-auth'
import authOptions from '@/app/api/auth/authOptions'
import AssigneSelect from './AssigneSelect'


interface Props {
    params: { id: string }
}

const IssueDetailsPage = async ({ params }: Props) => {
    const session = await getServerSession(authOptions);
    const id = parseInt(params.id, 10);
    if (isNaN(id)) notFound();
    const issueDetails = await prisma.issue.findUnique({
        where: { id }
    });
    if (!issueDetails) notFound();

    return (
        <Grid columns={{initial:"1",sm:"5"}} gap="5">
            <Box className='md:col-span-4'>
               <IssueDetails issueDetails={issueDetails}/>
            </Box>

            {session && (<Box>
                <Flex direction="column" gap="5">
                    <EditIssueButton issueId={issueDetails.id} />
                    <DeleteIssueButton issueId={issueDetails.id}/>
                    <AssigneSelect/>
                </Flex>
            </Box>)}

        </Grid>
    );
}

export default IssueDetailsPage;
