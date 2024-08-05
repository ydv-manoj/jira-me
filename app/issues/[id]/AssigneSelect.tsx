"use client"
import { Issue, User } from '@prisma/client'
import { Select } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Skeleton } from '@/app/components'
import toast,{Toaster} from 'react-hot-toast'

const AssigneSelect = ({ issue }: { issue: Issue }) => {
    const { data: users, error, isLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => axios.get('/api/users').then(res => res.data),
        staleTime: 60 * 1000,
        retry: 3,
    });

    if (error) return null;

    if (isLoading) return <Skeleton height="2rem" />

    const assignValueChange= (userId:string) => {
        const assignedUserId = userId === "unassigned" ? null : userId;
        axios.patch('/api/issues/' + issue.id, { assignedToUserId: assignedUserId })
        .catch(()=>{
            toast.error('Changes could not be saved.')
        })
    }

    return (
        <>
        <Select.Root 
            defaultValue={issue.assignedToUserId?.toString() || "unassigned"}
            onValueChange={assignValueChange}>
            <Select.Trigger placeholder='Assign' />
            <Select.Content>
                <Select.Group>
                    <Select.Label>Users</Select.Label>
                    <Select.Item value="unassigned">Unassigned</Select.Item>
                    {users?.map((user) => (
                        <Select.Item key={user.id} value={user.id.toString()}>{user.name}</Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
        <Toaster/>
        </>
    )
}

export default AssigneSelect
