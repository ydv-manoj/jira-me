"use client"
import { Pencil2Icon,TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button,Flex} from '@radix-ui/themes'
import Link from 'next/link'

const DeleteIssueButton = ({issueId}:{issueId:number}) => {
  return (
      <AlertDialog.Root>
          <AlertDialog.Trigger> 
            <Button color='red'>
                Delete Issue
                {/* <TrashIcon/>
                <Link href={`/issues/${issueId}/edit`}>Delete Issue</Link> */}
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
              <AlertDialog.Title>Confirm Delete</AlertDialog.Title>
              <AlertDialog.Description>Are you sure you want to delete this issue? This action cannot be undone</AlertDialog.Description>
              <Flex mt="4" gap="4">
                <AlertDialog.Cancel>
                    <Button variant='soft' color='gray'>Cancel</Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <Button color='red'>Delete Issue</Button>
                </AlertDialog.Action>
              </Flex>
          </AlertDialog.Content>
      </AlertDialog.Root>
    )
}

export default DeleteIssueButton