import { Status } from '@prisma/client'
import { Badge } from '@radix-ui/themes';
import React from 'react'


interface Props{
    status:Status;
}

const statusMap : Record<Status,{label:string,color:'red'|'green'|'violet'}>={
    OPEN:{label:'Open',color:'red'},
    IN_PROGRESS:{label:'In Progress',color:'violet'},
    CLOSED:{label:'Closed',color:'green'},
}

const IssueStatusBadge = (props:Props) => {
  return (
    <Badge color={statusMap[props.status].color}>{statusMap[props.status].label}</Badge>
  )
}

export default IssueStatusBadge