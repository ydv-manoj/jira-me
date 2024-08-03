"use client"
import { Pencil2Icon,TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button,Flex} from '@radix-ui/themes'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DeleteIssueButton = ({issueId}:{issueId:number}) => {
    const router=useRouter()
    const [error,setError]=useState(false)
    const handleClick=async()=>{
        try {
            axios.delete('/api/issues/'+issueId);
            router.push('/issues')
            router.refresh();
        } catch (error) {
            setError(true)
        }
    }
  return (
      <>
      <AlertDialog.Root>
          <AlertDialog.Trigger> 
            <Button color='red'>
                <TrashIcon/>
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
                    <Button color='red' onClick={handleClick}>
                       Delete Issue
                    </Button>
                </AlertDialog.Action>
              </Flex>
          </AlertDialog.Content>
      </AlertDialog.Root>
      <AlertDialog.Root open={error}>
          <AlertDialog.Content>
            <AlertDialog.Title>Error</AlertDialog.Title>
            <AlertDialog.Description>This issue cannot be deleted.</AlertDialog.Description>
            <Button color='gray' variant='soft' mt='3' onClick={()=>setError(false)}>OK</Button>
          </AlertDialog.Content>
      </AlertDialog.Root>
      </>
    )
}

export default DeleteIssueButton