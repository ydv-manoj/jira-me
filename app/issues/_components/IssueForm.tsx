"use client"
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Callout, Spinner, TextField } from '@radix-ui/themes';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import "easymde/dist/easymde.min.css";
import SimpleMDE from 'react-simplemde-editor';

import { ErrorMessage } from '@/app/components';
import { IssueSchema } from '@/app/validationSchemas';
import { Issue } from '@prisma/client';
  


type IssueFormData =z.infer<typeof IssueSchema>

interface Props{
    issue?:Issue
}

const IssueForm = ({issue}:Props) => {
  const router = useRouter()
  const {register,control,handleSubmit,formState:{errors}}=useForm<IssueFormData>({
      resolver:zodResolver(IssueSchema)
  });
  const [error,setError]=useState("")
  const [submitting,setSubmitting]=useState(false)


  return (
    <div className='max-w-xl'>
        {error && 
            <Callout.Root color='red' className='mb-2'>
                <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
        }
        <form className=' space-y-3' 
        onSubmit={
            handleSubmit(async (data)=>{
                try {
                    setSubmitting(true)
                    if(issue){
                        await axios.patch('/api/issues/'+issue.id,data)
                    }
                    else{
                        await axios.post('/api/issues',data);
                    }
                    router.push('/issues/list') 
                } catch (error) {
                    setSubmitting(false)
                    setError('An unexpected error occured')
                }
            })
            }>
            <TextField.Root defaultValue={issue?.title} placeholder='Title' {...register('title')}></TextField.Root>
            <ErrorMessage>{errors.title?.message}</ErrorMessage>
            <Controller 
                name='description'
                control={control}
                defaultValue={issue?.description}
                render={({field})=><SimpleMDE placeholder='Description' {...field} />}
            />
            <ErrorMessage>{errors.description?.message}</ErrorMessage>
            <Button disabled={submitting}>{issue? 'Update Issue':'Submit New Issue'} {submitting && <Spinner/>}</Button>
        </form>
    </div>
  )
}
 
export default IssueForm