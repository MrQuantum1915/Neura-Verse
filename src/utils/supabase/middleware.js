import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()


  //setting custom cookies
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    if (profile) {

      if (profile.username) {
        supabaseResponse.cookies.set('username', profile.username, {
          // using http only makes it only availbale for server and not available to cleint component, but here username, profilepic are public asset so i removd httpOnly

          httpOnly: false,      // it true, it prevent JavaScript from accessing the cookie by document.cookie()

          path: '/',  // cookie is available site-wide (all paths)
          sameSite: 'lax', // cookie is sent only with same-site or top-level navigation; prevents some CSRF -  Cross-Site Request Forgery
          // only send cookie over HTTPS in production for secure transmission
          // secure: process.env.NODE_ENV === 'production',
          // maxAge: 60 * 60 * 24 * 7  // 1 week
        })
      }

      if (profile.profile_pic) {
        supabaseResponse.cookies.set('profile_pic', profile.profile_pic, {
          httpOnly: false,
          path: "/",
          sameSite: "lax",
          // secure: process.env.NODE_ENV === "production",
        })
      }

      if (profile.full_name) {
        supabaseResponse.cookies.set('full_name', profile.full_name, {
          httpOnly: false,
          path: "/",
          sameSite: "lax",
          // secure: process.env.NODE_ENV === "production",
        })
      }

    }
  }




  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}