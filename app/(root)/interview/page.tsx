import React from 'react'
import Agent from '@/components/Agent'
import {getCurrentUser} from "@/lib/actions/auth.action";


const page = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return <h3>You must be logged in</h3>;
  }
  return (
    <>
      <h3> Interview Generation</h3>
      <Agent userName={user?.name} userId={user?.id} type='generate'/>
    </>
  )
}

export default page