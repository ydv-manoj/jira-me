import { Card, Flex } from '@radix-ui/themes'
import Skeleton from 'react-loading-skeleton'

const KanbanLoading = () => {
  return (
    <div>
            <Card className='gap-2'>
                <Flex gap="4">
                    <Skeleton width="25vw" height="70vh"/>
                    <Skeleton width="25vw" height="70vh"/>
                    <Skeleton width="25vw" height="70vh"/>
                </Flex>
            </Card>
    </div>
    )
}

export default KanbanLoading