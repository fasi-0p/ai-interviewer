<div align="center">

# 🎙️ PrepWise — AI Voice Interviewer 
## **Not working bcz i am out of vapi credits 🥲🥲- plz give mooney 🥹**
### *A workflow-driven AI interviewer that generates & conducts interviews like a real recruiter.*

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs"/>
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/badge/Vapi-Voice%20AI-00E5FF?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Firebase-Firestore-FFA000?style=for-the-badge&logo=firebase"/>
  <img src="https://img.shields.io/badge/Gemini%20API-LLM-8E75FF?style=for-the-badge&logo=google"/>
</p>

<p align="center">
  <b>Collects role + skill details → generates questions → conducts voice interview → stores everything in Firebase.</b>
</p>

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00F5FF,100:8E2DE2&height=190&section=header&text=PrepWise%20AI%20Interviewer&fontSize=40&fontColor=ffffff&animation=fadeIn" />

</div>

---

## ⚡ What is PrepWise?

**PrepWise** is a **voice-first AI Interview platform** where users can:
✅ Speak naturally like a phone interview  
✅ Give role + tech stack + level + question count  
✅ Auto-generate interview questions using Gemini  
✅ Conduct mock interviews with a voice AI interviewer (Vapi)  
✅ Save interview details + transcripts into Firestore  

---

## 🧠 Core Idea

> Instead of building a “chatbot interview”, this project simulates a **real recruiter call**.

A **Vapi Workflow** collects structured variables like:
- `role`
- `level`
- `type`
- `techstack`
- `amount`
- `userid`

Then triggers backend endpoint:

➡️ `POST /api/vapi/generate`  
which generates interview questions + saves the finalized interview into Firestore.

---

## 🔥 Features

✅ **Voice AI Interviewer** (real-time audio + voice response)  
✅ **Workflow Orchestration** (data collection → API tool → end call)  
✅ **Structured variable extraction** from conversation  
✅ **Dynamic Interview Question Generation** using **Gemini API**  
✅ **Firestore Storage**
- users collection
- interviews collection
- transcripts / metadata  
✅ **Session-based auth**
✅ Clean UI + transcript animations

---

## 🧩 Architecture

```mermaid
flowchart TD
    A[User Call Button] --> B[Vapi Workflow Starts]
    B --> C[Conversation Node: Extract Variables]
    C --> D[API Request Node: POST /api/vapi/generate]
    D --> E[Gemini Generates Questions]
    E --> F[Firestore Save: interviews]
    F --> G[Vapi End Call Node]
    G --> H[User redirected to dashboard]
