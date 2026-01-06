import {ReactNode} from 'react'
import {isAuthenticated} from '@/lib/actions/auth.action'
import {redirect} from 'next/navigation';

const AuthLayout = async ({children}: {children:ReactNode}) => {
  const isUserAuthenticated=await isAuthenticated();
    if(isUserAuthenticated) redirect('/')

  return (
    <div className="auth-layout">{children}</div> //auth-layout is in globals.css defining css properties
  )
}

export default AuthLayout