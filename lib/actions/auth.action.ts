'use server'

import { cookies } from 'next/headers'
import { db, auth } from '@/firebase/admin'

/* =====================
   Types
===================== */

export type SignUpParams = {
  uid: string
  name: string
  email: string
}

export type SignInParams = {
  email: string
  idToken: string
}

/* =====================
   Constants
===================== */

const ONE_WEEK = 60 * 60 * 24 * 7 // seconds

/* =====================
   Actions
===================== */

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params

  try {
    const userRecord = await db.collection('users').doc(uid).get()

    if (userRecord.exists) {
      return {
        success: false,
        message: 'User already exists',
      }
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    })

    return {
      success: true,
      message: 'Account created successfully',
    }
  } catch (error) {
    console.error('Error creating a user', error)

    return {
      success: false,
      message: 'Failed to create an account',
    }
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params

  try {
    await auth.getUserByEmail(email)
    await setSessionCookie(idToken)

    return { success: true }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: 'Failed to log into an account',
    }
  }
}

/* =====================
   Session handling
===================== */

export async function setSessionCookie(idToken: string) {
  // ✅ create Firebase session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // Firebase expects ms
  })

  // ⚠️ Next.js typing limitation — intentional cast
  const cookieStore = cookies() as any

  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  })
}

export async function signOut() {
  const cookieStore = cookies() as any
  cookieStore.delete('session')
}
