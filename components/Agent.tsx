'use client'

import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type AgentProps = { //i dont think its required. put it in to remove the redline from interview page.tsx
  userName: string
  userId: string
  type: 'generate' | 'interview'
}

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}




const Agent = ({ userName }: AgentProps) => {
  let callStatus : CallStatus=CallStatus.ACTIVE
  const isSpeaking = true

  const messages = ['What is your name?', 'My name is huihui']
  const lastMessage = messages[messages.length - 1]

  return (
    <>
      {/* CALL VIEW */}
      <div className="call-wrapper">
        <div className="call-view">
          {/* AI */}
          <div className="card-interviewer">
            <div className="avatar relative">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
              {isSpeaking && <span className="animate-speak absolute inset-0" />}
            </div>
            <h3>AI Interviewer</h3>
          </div>

          {/* USER */}
          <div className="card-interviewer">
            <div className="avatar">
              <Image
                src="/user-avatar.png"
                alt="User avatar"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {/* TRANSCRIPT */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                'transition-opacity duration-500',
                'animate-fadeIn opacity-100'
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (  
          <button className="relative btn-call">
            <span
              className={cn(
                'absolute inset-0 rounded-full animate-ping opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span>
              {callStatus === CallStatus.INACTIVE ||
              callStatus === CallStatus.FINISHED
                ? 'Call'
                : '. . .'}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  )
}

export default Agent
