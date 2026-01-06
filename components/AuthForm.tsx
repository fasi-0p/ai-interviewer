"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import FormField from "@/components/FormField"

import { Toaster, toast } from "sonner"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/client"

import {signUp, signIn} from "@/lib/actions/auth.action"



type FormType = "sign-in" | "sign-up"

const authFormSchema = (type: FormType) =>
  z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter()
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // ✅ MUST be async
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const { name, email, password } = values

        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        )

        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email,
        })

        if (!result?.success) {
          toast.error(result?.message)
          return
        }

        toast.success("Account created successfully. Please sign in.")

        setTimeout(() => {
          router.push("/sign-in")
        }, 600)
      } else {
        const { email, password } = values;

        const userCredentials= await signInWithEmailAndPassword(auth, email, password);

        const idToken=await userCredentials.user.getIdToken();
        if(!idToken){
          toast.error('Sign in failed')
          return;
        }
        await signIn({
          email, idToken
        })

        // sign-in logic would go here
        toast.success("Signed in successfully.")

        setTimeout(() => {
          router.push("/")
        }, 600)
      }
    } catch (error) {
      console.error("AuthForm error:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <>
      <Toaster richColors position="top-center" />

      <div className="card-border lg:min-w-[566px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
          <div className="flex flex-row gap-2 justify-center">
            <Image src="/logo.svg" alt="logo" height={32} width={38} />
            <h2 className="text-primary-100">PrepWise</h2>
          </div>

          <h3>Practice job interview with AI</h3>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6 mt-4 form"
            >
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                />
              )}

              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="abc@muhehe.com"
              />

              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••••••••••"
                type="password"
              />

              <Button className="btn" type="submit">
                {isSignIn ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>

          <p className="text-center">
            {isSignIn ? "No account yet?" : "Have an account already?"}
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="font-bold text-user-primary ml-1"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default AuthForm
