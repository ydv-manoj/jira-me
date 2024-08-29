import { NextRequest, NextResponse } from "next/server";
import {z} from 'zod'
import prisma from "@/prisma/client";
import { IssueSchema } from "@/app/validationSchemas";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";


export async function POST(request:NextRequest){
    const session = await getServerSession(authOptions);
    if(!session)return NextResponse.json({},{status:401})
    const body = await request.json();
    const validation = IssueSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json(validation.error.errors,{status:400});
    }
    const newIssue=await prisma.issue.create({
        data:{title:body.title,description:body.description}
    })
    return NextResponse.json(newIssue,{status:201})
}



export async function GET(request:NextRequest){
    const issues = await prisma.issue.findMany({
        include: {
          assignedToUser: true,
        },
    })
    return NextResponse.json(issues,{status:200})
}