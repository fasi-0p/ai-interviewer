import React from 'react'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import {dummyInterviews} from '@/constants'
import InterviewCard from '@/components/InterviewCard'
import {getCurrentUser} from '@/lib/actions/auth.action'
import {getInterviewsByUserId, getLatestInterviews} from '@/lib/actions/general.action'

const page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([ //promise.all helps to run getInterviews and getLatest parallely
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({userId:user?.id!})
  ])
  
  const hasPastInterviews = userInterviews?.length!>0;
  const hasUpcomingInterviews =(latestInterviews?.length??0)>0

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2> Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg"> Practice on real interview questions & get instant feedback</p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview"> Start an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robot" width={400} height={400} className="max-sm:hidden"/>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>You havent taken any interviews yet</p>
          )}
        </div>
      </section>


      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            dummyInterviews.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          )}
        </div>
      </section>

    </>
  )
}

export default page