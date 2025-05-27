// nested layout
import React, { Children } from 'react'
import {Roboto} from 'next/font/google'
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-Roboto',
})

function layout({ children }) {
  return (
    <div className={`bg-black min-h-screen w-full ${roboto.className}`}>
      {children}
    </div>
  )
}
export default layout
