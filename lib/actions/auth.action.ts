"use server";

import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";
import { DocumentData } from "firebase-admin/firestore";
// import { Interview, User } from "@/types";

/* =====================
   Types
===================== */

export type SignUpParams = {
  uid: string;
  name: string;
  email: string;
};

export type SignInParams = {
  email: string;
  idToken: string;
};

/* =====================
   Constants
===================== */

const ONE_WEEK = 60 * 60 * 24 * 7; // seconds

/* =====================
   Actions
===================== */

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    console.error("Error creating a user", error);

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    await auth.getUserByEmail(email);
    await setSessionCookie(idToken);

    return { success: true };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to log into an account",
    };
  }
}

/* =====================
   Session handling
===================== */

export async function setSessionCookie(idToken: string) {
  // create Firebase session cookie (expects ms)
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); 

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
    if (!userRecord.exists) return null;

    return {
      ...(userRecord.data() as DocumentData),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/* =====================
   Interviews
===================== */



/* =====================
   Logout
===================== */

export async function signOut() {
  const cookieStore = cookies() as any;
  cookieStore.delete("session");
}
