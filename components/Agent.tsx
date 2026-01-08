'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';

type AgentProps = {
  userName: string;
  userId: string;
  type: 'generate' | 'interview';
};

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const Agent = ({ userName, userId, type }: AgentProps) => {
  const router = useRouter();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  /* -------------------- VAPI EVENTS -------------------- */
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        setMessages((prev) => [
          ...prev,
          { role: message.role, content: message.transcript },
        ]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error('Vapi error:', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);

  /* -------------------- POST CALL -------------------- */
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      router.push('/');
    }
  }, [callStatus, router]);

  /* -------------------- ACTIONS -------------------- */
  const handleCall = async () => {
    console.log('Starting call with workflow:', process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);
    setCallStatus(CallStatus.CONNECTING);

    await vapi.start(
      undefined,
      undefined,
      undefined,
      process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
      {
        variableValues: {
          username: userName,
          userid: userId,
        },
      }
    );
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;
  const isInactiveOrFinished =
    callStatus === CallStatus.INACTIVE ||
    callStatus === CallStatus.FINISHED;

  /* -------------------- UI -------------------- */
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
              {isSpeaking && (
                <span className="animate-speak absolute inset-0" />
              )}
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
      {latestMessage && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                'transition-opacity duration-500',
                'animate-fadeIn opacity-100'
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      {/* CONTROLS */}
      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                'absolute inset-0 rounded-full animate-ping opacity-75',
                callStatus !== CallStatus.CONNECTING && 'hidden'
              )}
            />
            <span>{isInactiveOrFinished ? 'Call' : '. . .'}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
