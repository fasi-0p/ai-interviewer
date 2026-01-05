import {ReactNode} from 'react'

const AuthLayout = ({children}: {children:ReactNode}) => {
  return (
    <div className="auth-layout">{children}</div> //auth-layout is in globals.css defining css properties
  )
}

export default AuthLayout