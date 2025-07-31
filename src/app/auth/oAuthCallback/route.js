//copied from supabase docs , i am not responsible for any security issues that may arise from this code snippet howsoever


import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient_server } from '@/utils/supabase/supabaseServer'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/'
  }

  if (code) {
    const supabase = await createClient_server()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {

      //redirecting user to profile section if username is not set
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch the user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('user_id', user.id)
          .single()

        if (!profile || !profile.username) {
          return NextResponse.redirect(`${origin}/profile`)
        }
      }

      return NextResponse.redirect(`${origin}/profile`)


      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}