import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request) {
   
    // if the matcher is / oe base url redirect to home
    const { pathname } = request.nextUrl

    if (pathname === '/') {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    return await updateSession(request)
}

export const config = {
    matcher: ['/', '/profile', '/login', '/playgrounds/lumina'],
};