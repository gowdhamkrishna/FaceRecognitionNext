"use client"
import { SessionProvider } from "next-auth/react"

export default function Wrapper({children}) {
  return (
    <SessionProvider >
      {children}
    </SessionProvider>
  )
} 