"use server";

import { cookies } from "next/headers";
import { db, auth } from "@/firebase/admin";
import { DocumentData } from "firebase-admin/firestore";

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as DocumentData),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.log("Error fetching interviews:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  try {
    const { userId, limit=20 } = params;
    const interviewsSnapshot = await db
      .collection("interviews")
      .where("finalized", "==", true)
      .where('userId','!=',userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const interviews = interviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as DocumentData),
    })) as Interview[];

    return interviews;
  } catch (error) {
    console.log("Error fetching interviews:", error);
    return null;
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const docSnap = await db.collection("interviews").doc(id).get();

    if (!docSnap.exists) return null;

    const interview = {
      id: docSnap.id,
      ...(docSnap.data() as DocumentData),
    } as Interview;

    return interview;
  } catch (error) {
    console.log("Error fetching interview:", error);
    return null;
  }
}
